import { NextResponse } from "next/server";
import { siteConfig } from "@/data/site";

export const runtime = "nodejs";

type Payload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot — real visitors never fill this in. */
  company?: unknown;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Very small in-memory throttle: enough to stop a bored bot, and it costs
 * nothing. It resets on a cold start, so put a real limiter (Upstash, Vercel
 * WAF) in front of this if the form ever gets hammered.
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

function asTrimmedString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Formspree's dashboard shows the whole endpoint, but it's natural to copy
 * just the id off the end of it — so accept either and build the URL here.
 * `.trim()` matters because a value pasted into a hosting dashboard often
 * arrives with a stray space, and an env var that exists but is blank isn't
 * nullish, so `??` would let it through into a request to nowhere.
 */
function resolveEndpoint(raw: string | undefined): string | null {
  const value = raw?.trim().replace(/\/+$/, "");
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? value : `https://formspree.io/f/${value}`;
}

export async function POST(request: Request) {
  const endpoint = resolveEndpoint(
    process.env.FORMSPREE_ENDPOINT ?? siteConfig.contactFormEndpoint ?? undefined,
  );

  // No form backend configured — tell the client so it can fall back to
  // opening the visitor's email app instead of silently failing.
  if (!endpoint) {
    return NextResponse.json(
      { error: "not_configured", message: "Email delivery is not set up." },
      { status: 501 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many messages. Try again shortly." },
      { status: 429 },
    );
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { error: "bad_request", message: "Invalid request body." },
      { status: 400 },
    );
  }

  // Honeypot tripped — accept it so the bot sees success, but send nothing.
  if (asTrimmedString(body.company, 100).length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = asTrimmedString(body.name, 120);
  const email = asTrimmedString(body.email, 200);
  const message = asTrimmedString(body.message, 5000);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email.";
  if (message.length < 10) {
    errors.message = "Please write at least a sentence or two.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "validation", fields: errors },
      { status: 422 },
    );
  }

  // Formspree is the sender, so there's no domain to own and no API key to
  // keep secret — the endpoint is public by design and spam is handled per
  // form on their side. Posting from here rather than from the browser keeps
  // the validation and the honeypot above in front of it, and keeps the form
  // id out of the page source.
  //
  // Two field names are load-bearing: `email` is what Formspree reads to set
  // the Reply-To on the notification, so hitting reply in Gmail goes to the
  // visitor rather than to Formspree; `subject` sets the subject line. Both
  // are their conventions, not arbitrary keys — renaming either quietly
  // loses the behaviour.
  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Without this Formspree replies with an HTML redirect page meant for a
        // browser, which would leave us parsing markup to find out what happened.
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        subject: `Portfolio enquiry from ${name}`,
      }),
      // Don't leave the visitor watching a spinner if Formspree hangs. Node's
      // default has no timeout at all, so a stalled connection would sit there
      // until the platform killed the function.
      signal: AbortSignal.timeout(10_000),
    });
  } catch (cause) {
    // DNS failure, no route to the host, TLS problem, timeout. `fetch` throws
    // on all of these rather than resolving, and an uncaught throw here would
    // surface as a bare 500 — an HTML error page the client can't read, and
    // nothing useful for the visitor.
    console.error("Could not reach Formspree:", cause);
    return NextResponse.json(
      { error: "unreachable", message: "Could not reach the mail service." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    console.error("Formspree rejected the message:", await response.text());
    return NextResponse.json(
      { error: "send_failed", message: "Could not send the message." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
