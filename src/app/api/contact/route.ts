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

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  // No mail provider configured — tell the client so it can fall back to
  // opening the visitor's email app instead of silently failing.
  if (!apiKey) {
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

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? `portfolio@${new URL(siteConfig.url).hostname}`,
      to: [process.env.CONTACT_TO_EMAIL ?? siteConfig.email],
      reply_to: email,
      subject: `Portfolio enquiry from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!response.ok) {
    console.error("Resend rejected the message:", await response.text());
    return NextResponse.json(
      { error: "send_failed", message: "Could not send the message." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
