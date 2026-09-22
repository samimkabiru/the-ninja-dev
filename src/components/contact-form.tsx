"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { siteConfig } from "@/data/site";

type Status = "idle" | "submitting" | "sent" | "error" | "fallback";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name.";
    if (!EMAIL_PATTERN.test(values.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (values.message.trim().length < 10) {
      next.message = "A sentence or two about the project, please.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          company: formData.get("company"),
        }),
      });

      if (response.ok) {
        setStatus("sent");
        setValues({ name: "", email: "", message: "" });
        return;
      }

      // Nothing we can do about it on this side — either no mail provider is
      // wired up (501), or one is but it couldn't be reached or refused the
      // message (502). Either way the visitor's message is valid and it isn't
      // their problem to solve, so hand them a pre-filled mailto link rather
      // than an apology. The real reason is in the server log.
      if (response.status === 501 || response.status === 502) {
        setStatus("fallback");
        return;
      }

      const data = (await response.json().catch(() => null)) as {
        fields?: Record<string, string>;
      } | null;

      if (data?.fields) setErrors(data.fields);
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const mailtoHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    `Project enquiry from ${values.name || "your site"}`,
  )}&body=${encodeURIComponent(values.message)}`;

  if (status === "sent") {
    return (
      <div role="status" className="card-quiet p-8 text-center">
        <p className="font-display text-lg font-semibold">Message sent.</p>
        <p className="mt-2 text-sm text-muted">
          Thanks — I&apos;ll get back to you within a day or two.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 text-left">
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="name"
          label="Name"
          value={values.name}
          error={errors.name}
          autoComplete="name"
          onChange={(value) => update("name", value)}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          value={values.email}
          error={errors.email}
          autoComplete="email"
          onChange={(value) => update("email", value)}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          What are you building?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="w-full resize-y rounded-xl bg-surface-alt px-4 py-3 text-sm shadow-[var(--ring)] outline-none transition-shadow focus:shadow-[inset_0_0_0_1px_var(--accent)]"
        />
        {errors.message ? (
          <p id="message-error" className="mt-1.5 text-xs text-red-500">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-fg shadow-soft-md transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? (
            <Loader2 size={15} className="animate-spin" aria-hidden="true" />
          ) : (
            <Send size={15} aria-hidden="true" />
          )}
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>

        <a
          href={`mailto:${siteConfig.email}`}
          className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-accent"
        >
          or email me directly
        </a>
      </div>

      <div aria-live="polite">
        {status === "error" ? (
          <p className="text-sm text-red-500">
            Something went wrong sending that. You can{" "}
            <a href={mailtoHref} className="underline underline-offset-4">
              email me directly
            </a>{" "}
            instead.
          </p>
        ) : null}

        {/* Covers both "no provider configured" and "provider unreachable".
            The visitor doesn't need to know which — the message they wrote is
            already in the mailto link either way, so the recovery is the same
            and naming the cause would only make it sound like their fault. */}
        {status === "fallback" ? (
          <p className="text-sm text-muted">
            Can&apos;t send that from here —{" "}
            <a
              href={mailtoHref}
              className="text-accent underline underline-offset-4"
            >
              open it in your email app
            </a>{" "}
            instead and it&apos;ll be ready to send.
          </p>
        ) : null}
      </div>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
};

function Field({
  id,
  label,
  value,
  error,
  type = "text",
  autoComplete,
  onChange,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-xl bg-surface-alt px-4 py-3 text-sm shadow-[var(--ring)] outline-none transition-shadow focus:shadow-[inset_0_0_0_1px_var(--accent)]"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
