/**
 * Data-driven configuration for the "Contact" page — a centered full-bleed
 * photo hero, a two-column body (contact-method cards + a client-side mailto
 * composer), and a closing dark band with reachability chips. Mirrors the
 * shape and conventions of the other migrated pages (@/lib/about/page,
 * @/lib/faq/page); brand copy lives in brands/<slug>/contact-page.config.ts
 * and colors flow through the token layer.
 *
 * The form makes NO backend call (CLAUDE.md golden rule #3): it composes a
 * mailto: link from the entered values and hands off to the visitor's email
 * app, so it stays stub-only with no fake submission.
 */

export interface ContactHero {
  eyebrow?: string;
  /** First title line (e.g. "Talk."). */
  title: string;
  /** Accent line rendered italic in the highlight color on its own line. */
  titleAccent?: string;
  sub?: string;
  /** Full-bleed background photo (public path or whitelisted remote URL). */
  image: string;
}

/** One contact-method card: icon, heading, blurb, and a mailto/tel link. */
export interface ContactMethod {
  /** Phosphor icon name resolved via getPhosphorIcon (e.g. "CalendarCheck"). */
  icon?: string;
  title: string;
  body: string;
  /** Visible link text (email address or phone number). */
  linkLabel: string;
  /** Link target — a mailto: or tel: URL. */
  href: string;
}

/** A topic the composer can address the email to. */
export interface ContactTopic {
  /** Stable <option> value. */
  id: string;
  label: string;
  /** Destination address the composed mailto is sent to. */
  email: string;
}

/** The mailto-composer form copy (labels/placeholders are structural). */
export interface ContactForm {
  heading: string;
  intro: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  topicLabel: string;
  topics: ContactTopic[];
  messageLabel: string;
  messagePlaceholder: string;
  /** Shown if the visitor tries to send with an empty message. */
  emptyMessageError: string;
  submitLabel: string;
  note: string;
  /** Subject line for the composed email. */
  subject: string;
}

export interface ContactBandChip {
  /** Chip value (e.g. "Mon–Sat", "12"). Illustrative placeholder only. */
  value: string;
  label: string;
}

/** Closing solid-dark band with a location statement and reachability chips. */
export interface ContactDarkBand {
  eyebrow?: string;
  /** First title line; the accent renders italic in the highlight color. */
  title: string;
  titleAccent?: string;
  body?: string;
  chips: ContactBandChip[];
}

export interface ContactPageConfig {
  hero: ContactHero;
  /** Section heading for the contact grid (visually hidden). */
  methodsHeading: string;
  methods: ContactMethod[];
  form: ContactForm;
  band: ContactDarkBand;
}
