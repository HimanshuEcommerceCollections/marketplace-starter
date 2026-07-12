"use client";

import * as React from "react";
import { submitCorporateInquiry } from "@/lib/corporate/api";
import type { FieldErrors } from "@/lib/forms/validate";
import type { CorporateInquiryConfig } from "@/lib/corporate/page";

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={`${id}-error`} className="corp-field-err">
      {errors[0]}
    </p>
  );
}

/**
 * "Request a proposal" corporate inquiry form. Wired to the live backend via
 * the same-origin BFF (`submitCorporateInquiry` → POST /api/corporate-inquiries),
 * where staff triage it in the admin dashboard. The selected service chips +
 * free-text message are folded into `notes`; team size maps to `headcount` and
 * format to `event_type`. Validation runs locally first for instant field errors.
 */
export function CorporateInquiryForm({
  config,
}: {
  config: CorporateInquiryConfig["form"];
}) {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<FieldErrors>();
  const [done, setDone] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  function toggleService(svc: string) {
    setSelected((s) =>
      s.includes(svc) ? s.filter((x) => x !== svc) : [...s, svc],
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    const services = selected.length
      ? selected.join(", ")
      : "Open to suggestions";
    const message = String(form.get("message") ?? "").trim();
    const notes =
      `Services of interest: ${services}` + (message ? `\n\n${message}` : "");
    const result = await submitCorporateInquiry({
      company: form.get("company"),
      contact: { name: form.get("name"), email: form.get("email") },
      headcount: form.get("teamSize") || undefined,
      event_type: form.get("format"),
      notes,
    });
    setPending(false);
    if (result.success) {
      setErrors(undefined);
      setDone(true);
    } else {
      setErrors(result.errors);
    }
  }

  if (done) {
    return (
      <div className="corp-form-card">
        <h2>{config.heading}</h2>
        <p role="status" className="corp-done">
          Thanks — your inquiry has been received. A coordinator will follow up
          within one business day.
        </p>
      </div>
    );
  }

  return (
    <form className="corp-form-card" onSubmit={onSubmit} noValidate>
      <h2>{config.heading}</h2>
      {config.intro ? <p className="corp-form-intro">{config.intro}</p> : null}

      {errors?._form ? (
        <p role="alert" className="corp-form-err">
          {errors._form[0]}
        </p>
      ) : null}

      <div className="corp-grid">
        <div className="corp-field">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            placeholder="Company name"
            aria-invalid={!!errors?.company}
          />
          <FieldError id="company" errors={errors?.company} />
        </div>
        <div className="corp-field">
          <label htmlFor="name">Your name</label>
          <input
            id="name"
            name="name"
            placeholder="Your name"
            aria-invalid={!!errors?.["contact.name"]}
          />
          <FieldError id="name" errors={errors?.["contact.name"]} />
        </div>

        <div className="corp-field">
          <label htmlFor="email">Work email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            aria-invalid={!!errors?.["contact.email"]}
          />
          <FieldError id="email" errors={errors?.["contact.email"]} />
        </div>
        <div className="corp-field">
          <label htmlFor="teamSize">Team size</label>
          <select id="teamSize" name="teamSize" defaultValue={config.teamSizes[0]}>
            {config.teamSizes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="corp-field full">
          <label id="svc-label">Services of interest</label>
          <div className="corp-chips" role="group" aria-labelledby="svc-label">
            {config.services.map((svc) => (
              <button
                key={svc}
                type="button"
                className="corp-chip"
                aria-pressed={selected.includes(svc)}
                onClick={() => toggleService(svc)}
              >
                {svc}
              </button>
            ))}
          </div>
        </div>

        <div className="corp-field full">
          <label htmlFor="format">Format</label>
          <select id="format" name="format" defaultValue={config.formats[0]}>
            {config.formats.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="corp-field full">
          <label htmlFor="message">Anything else</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Goals, timing, office setup, budget range…"
          />
        </div>
      </div>

      <button type="submit" className="corp-send" disabled={pending}>
        {pending ? "Submitting…" : `${config.submitLabel} →`}
      </button>
      {config.note ? <p className="corp-note">{config.note}</p> : null}
    </form>
  );
}
