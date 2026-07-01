"use client";

import * as React from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripePaymentElementOptions } from "@stripe/stripe-js";
import { CalendarCheck, Loader2, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/components/layout/brand-provider";
import { formatMoney } from "@/lib/money";
import { getStripe } from "@/lib/payments/stripe";
import { getPayment } from "@/lib/payments/api";
import { buildStripeAppearance } from "@/styles/stripe-appearance";
import { useBookingDraft } from "./booking-provider";

/**
 * Poll the payment until the backend (via the verified Stripe webhook) marks it
 * PAID. The webhook is the source of truth — success is NEVER inferred from the
 * client SDK alone. Returns "timeout" if it's still settling after the window.
 */
async function waitForPaid(
  paymentId: string,
  isCancelled: () => boolean,
): Promise<"paid" | "failed" | "timeout"> {
  const ATTEMPTS = 20;
  const DELAY_MS = 2000;
  for (let i = 0; i < ATTEMPTS; i += 1) {
    if (isCancelled()) return "timeout";
    try {
      const payment = await getPayment(paymentId);
      if (payment.status === "PAID") return "paid";
      if (payment.status === "FAILED") return "failed";
    } catch {
      // Transient read error — keep polling.
    }
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  }
  return "timeout";
}

type Phase = "ready" | "confirming" | "verifying" | "processing" | "error";

const TRUST_POINTS = [
  "Secured by Stripe",
  "SSL encrypted",
  "Card details never stored on our servers",
  "Instant confirmation after payment",
];

function PaymentForm({
  paymentId,
  amountLabel,
  billingDefaults,
  businessName,
  onConfirmed,
}: {
  paymentId: string;
  amountLabel: string;
  billingDefaults: { name?: string; email?: string; phone?: string };
  businessName: string;
  onConfirmed: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [phase, setPhase] = React.useState<Phase>("ready");
  const [error, setError] = React.useState<string>();
  const cancelledRef = React.useRef(false);

  React.useEffect(
    () => () => {
      cancelledRef.current = true;
    },
    [],
  );

  const busy = phase === "confirming" || phase === "verifying";
  const locked = busy || phase === "processing";

  // US-optimized Payment Element: wallets + Link surfaced first, cards always
  // available, contact details prefilled from the booking to reduce friction.
  const paymentElementOptions: StripePaymentElementOptions = {
    layout: { type: "tabs", defaultCollapsed: false },
    wallets: { applePay: "auto", googlePay: "auto" },
    paymentMethodOrder: ["card", "apple_pay", "google_pay", "link", "cashapp"],
    business: { name: businessName },
    defaultValues: { billingDetails: billingDefaults },
  };

  async function pay() {
    if (!stripe || !elements || locked) return;
    setError(undefined);
    setPhase("confirming");

    // Card details go straight to Stripe; our server never sees them.
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: { return_url: window.location.href },
    });

    if (confirmError) {
      setError(
        confirmError.message ??
          "We couldn't process your payment. Please check your details and try again.",
      );
      setPhase("error");
      return;
    }

    // Confirmed client-side; the booking is only CONFIRMED once our backend
    // verifies the webhook. Poll until then — never trust the client result.
    setPhase("verifying");
    const result = await waitForPaid(paymentId, () => cancelledRef.current);
    if (cancelledRef.current) return;

    if (result === "paid") {
      onConfirmed();
    } else if (result === "failed") {
      setError(
        "Your payment didn't go through. No charge was made — please try a different card.",
      );
      setPhase("error");
    } else {
      // Captured but still settling — the webhook will finalize it.
      setPhase("processing");
    }
  }

  return (
    <div className="space-y-6">
      {/* Payment card — houses the Stripe Element */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
          <Lock aria-hidden strokeWidth={1.75} className="size-4 text-primary" />
          Payment details
        </div>

        <PaymentElement options={paymentElementOptions} />

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        {phase === "processing" ? (
          <p
            role="status"
            aria-live="polite"
            className="mt-4 flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-foreground"
          >
            <CalendarCheck
              aria-hidden
              strokeWidth={1.75}
              className="mt-0.5 size-4 shrink-0"
            />
            <span>
              Your payment was received and is being confirmed. You&apos;ll get
              an email the moment your booking is confirmed — it&apos;s safe to
              close this page.
            </span>
          </p>
        ) : null}

        <Button
          type="button"
          size="lg"
          onClick={() => void pay()}
          disabled={!stripe || locked}
          aria-busy={busy}
          className="mt-5 w-full bg-highlight text-highlight-foreground hover:bg-highlight/90"
        >
          {phase === "confirming" ? (
            <>
              <Loader2 className="animate-spin" aria-hidden /> Processing
              payment…
            </>
          ) : phase === "verifying" ? (
            <>
              <Loader2 className="animate-spin" aria-hidden /> Confirming your
              booking…
            </>
          ) : phase === "processing" ? (
            <>
              <Loader2 className="animate-spin" aria-hidden /> Awaiting
              confirmation…
            </>
          ) : (
            <>
              <Lock aria-hidden strokeWidth={2} /> Pay {amountLabel}
            </>
          )}
        </Button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck aria-hidden strokeWidth={1.75} className="size-3.5" />
          Payments are processed securely by Stripe. Your card details never
          reach our servers.
        </p>
      </div>

      {/* Trust indicators — subtle, minimal */}
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        {TRUST_POINTS.map((point) => (
          <li key={point} className="flex items-center gap-1.5">
            <ShieldCheck
              aria-hidden
              strokeWidth={1.75}
              className="size-3.5 text-primary"
            />
            {point}
          </li>
        ))}
      </ul>

      {/* Cancellation policy */}
      <div className="rounded-2xl border border-border bg-muted/40 p-4">
        <p className="text-sm font-medium text-foreground">
          Flexible cancellation
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Free cancellation up to 24 hours before your appointment. Cancel or
          reschedule within 24 hours and a fee may apply. A coordinator will
          confirm all details before your session.
        </p>
      </div>
    </div>
  );
}

/**
 * Payment step (live bookings only). Mounts Stripe Elements with the client
 * secret created after the booking, collects payment, and advances to the
 * success step only after the backend confirms the payment. The surrounding
 * two-column layout (form + sticky booking summary) is supplied by the wizard.
 */
export function WizardStepPayment() {
  const { state, dispatch } = useBookingDraft();
  const { config } = useBrand();
  const {
    clientSecret,
    publishableKey,
    paymentId,
    amount,
    currency,
    firstName,
    lastName,
    email,
    phone,
  } = state;

  const stripePromise = React.useMemo(
    () => getStripe(publishableKey ?? undefined),
    [publishableKey],
  );

  const appearance = React.useMemo(() => buildStripeAppearance(), []);

  if (!clientSecret || !paymentId || amount == null || !currency) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
      >
        Payment could not be initialized. Please go back and try again.
      </p>
    );
  }

  if (!stripePromise) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
      >
        Payments are temporarily unavailable. Please try again later.
      </p>
    );
  }

  const amountLabel = formatMoney({ amount, currency });
  const billingDefaults = {
    name: `${firstName} ${lastName}`.trim() || undefined,
    email: email || undefined,
    phone: phone || undefined,
  };

  return (
    <Elements
      key={clientSecret}
      stripe={stripePromise}
      options={{ clientSecret, appearance, loader: "auto" }}
    >
      <PaymentForm
        paymentId={paymentId}
        amountLabel={amountLabel}
        billingDefaults={billingDefaults}
        businessName={config.shortName}
        onConfirmed={() => dispatch({ type: "PAYMENT_OK" })}
      />
    </Elements>
  );
}
