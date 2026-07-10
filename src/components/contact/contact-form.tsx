"use client";

import * as React from "react";
import { useGsap } from "@/lib/anim/use-gsap";
import type { ContactForm as ContactFormConfig } from "@/lib/contact/page";

/**
 * Client-side mailto composer. Builds a `mailto:` link from the entered values
 * — addressed to the selected topic's inbox — and hands off to the visitor's
 * email app. Makes NO backend call (CLAUDE.md golden rule #3): there is no
 * fake submission, so it stays stub-only.
 */
export function ContactForm(form: ContactFormConfig) {
  const scope = useGsap<HTMLFormElement>(({ gsap, scope }) => {
    gsap.from(scope, {
      scrollTrigger: { trigger: scope, start: "top 85%", once: true },
      y: 36,
      autoAlpha: 0,
      duration: 0.7,
      ease: "power3.out",
    });
  }, []);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [topicId, setTopicId] = React.useState(form.topics[0]?.id ?? "");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) {
      setError(true);
      return;
    }
    setError(false);
    const topic = form.topics.find((t) => t.id === topicId) ?? form.topics[0];
    const signature = name || email ? `\n\n— ${name}${email ? ` (${email})` : ""}` : "";
    const body = encodeURIComponent(message.trim() + signature);
    const subject = encodeURIComponent(form.subject);
    window.location.href = `mailto:${topic.email}?subject=${subject}&body=${body}`;
  };

  return (
    <form
      ref={scope}
      className="ct-form"
      aria-labelledby="ct-form-heading"
      onSubmit={handleSubmit}
      noValidate
    >
      <h3 id="ct-form-heading" className="ct-form-title">
        {form.heading}
      </h3>
      <p className="ct-form-intro">{form.intro}</p>

      <div className="ct-form-grid">
        <div className="ct-field">
          <label htmlFor="ct-name">{form.nameLabel}</label>
          <input
            id="ct-name"
            type="text"
            autoComplete="name"
            placeholder={form.namePlaceholder}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="ct-field">
          <label htmlFor="ct-email">{form.emailLabel}</label>
          <input
            id="ct-email"
            type="email"
            autoComplete="email"
            placeholder={form.emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="ct-field ct-field-full">
          <label htmlFor="ct-topic">{form.topicLabel}</label>
          <select
            id="ct-topic"
            value={topicId}
            onChange={(event) => setTopicId(event.target.value)}
          >
            {form.topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.label}
              </option>
            ))}
          </select>
        </div>
        <div className="ct-field ct-field-full">
          <label htmlFor="ct-message">{form.messageLabel}</label>
          <textarea
            id="ct-message"
            rows={5}
            placeholder={form.messagePlaceholder}
            aria-invalid={error}
            aria-describedby={error ? "ct-message-error" : undefined}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              if (error) setError(false);
            }}
          />
          {error ? (
            <p id="ct-message-error" className="ct-field-error" role="alert">
              {form.emptyMessageError}
            </p>
          ) : null}
        </div>
      </div>

      <button type="submit" className="ct-send">
        {form.submitLabel} →
      </button>
      <p className="ct-form-note">{form.note}</p>
    </form>
  );
}
