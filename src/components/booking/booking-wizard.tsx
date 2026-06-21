"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { submitBooking, BookingApiError } from "@/lib/booking/api";
import {
  BookingProvider,
  useBookingDraft,
  buildBookingRequest,
  toServerBooking,
  toConfiguration,
  selectionSummary,
  addOnsSummary,
  formatWindowLabel,
  WIZARD_STEPS,
} from "./booking-provider";
import { BookingStepLayout } from "./booking-step-layout";
import { BookingSummaryCard } from "./booking-summary-card";
import { RequestSummaryCard } from "./request-summary-card";
import { WizardStepConfig } from "./wizard-step-config";
import { WizardStepPricing } from "./wizard-step-pricing";
import { WizardStepDetails } from "./wizard-step-details";
import { WizardStepReview } from "./wizard-step-review";
import { BookingSuccessScreen } from "./booking-success-screen";
import { formatMoney } from "@/lib/money";
import type { WizardStep } from "./booking-provider";
import { ArrowRight } from "lucide-react";
import { analytics } from "@/lib/analytics/analytics";
import { computePrice } from "@/lib/pricing/engine";
import type { FieldErrors } from "@/lib/forms/validate";
import type { Service } from "@/lib/catalog/types";
import type { PricingTable } from "@/lib/pricing/types";
import type { BrandId } from "@/lib/brand/registry";

export interface BookingWizardProps {
  service: Service;
  pricing: PricingTable;
  brandId: BrandId;
  /** Present when wired to live data — enables real (API) booking submission. */
  liveServiceId?: string;
  optionIdByGroupKey?: Record<string, Record<string, string>>;
  durationMinutes?: number;
}

export function BookingWizard(props: BookingWizardProps) {
  return (
    <BookingProvider
      service={props.service}
      pricing={props.pricing}
      brandId={props.brandId}
      liveServiceId={props.liveServiceId}
      optionIdByGroupKey={props.optionIdByGroupKey}
      durationMinutes={props.durationMinutes}
    >
      <WizardInner />
    </BookingProvider>
  );
}

/** Map the wizard's internal steps onto the 6-step booking flow indicator. */
const FLOW_INDEX: Record<WizardStep, number> = {
  config: 1, // Configure
  pricing: 2, // Pricing
  details: 3, // Details
  review: 4, // Confirm
  success: 5, // Done
};

const STEP_HEADING: Record<WizardStep, string> = {
  config: "Configure Your Session",
  pricing: "Review Your Pricing",
  details: "Your Details",
  review: "Review & Confirm",
  success: "Done",
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function WizardInner() {
  const ctx = useBookingDraft();
  const { state, dispatch, service, pricing } = ctx;
  const { status: authStatus } = useAuth();
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>();
  const [consent, setConsent] = React.useState(false);
  const stepRef = React.useRef<HTMLDivElement>(null);
  const index = WIZARD_STEPS.indexOf(state.step);

  // Where to return after signing in to complete a live booking.
  const loginRedirect = `/login?next=${encodeURIComponent(`/book?service=${service.id}`)}`;

  // config_start fires once when the wizard mounts.
  React.useEffect(() => {
    analytics.configStart({
      service_id: service.id,
      service_type: service.service_type,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Move focus to the step container on each step change (a11y).
  React.useEffect(() => {
    stepRef.current?.focus();
  }, [state.step]);

  function goNext() {
    switch (state.step) {
      case "config": {
        if (belowMin) return; // minimum-booking gate not yet met
        const breakdown = computePrice(pricing, toConfiguration(state, service));
        analytics.configComplete({
          service_id: service.id,
          service_type: service.service_type,
          option_count: Object.keys(state.selections).length,
          displayed_price: breakdown.total.amount,
          currency: breakdown.total.currency,
        });
        dispatch({ type: "SET_STEP", step: "pricing" });
        return;
      }
      case "pricing": {
        analytics.bookStart({
          service_id: service.id,
          service_type: service.service_type,
          step: index,
        });
        dispatch({ type: "SET_STEP", step: "details" });
        return;
      }
      case "details": {
        const errs: FieldErrors = {};
        if (!state.firstName.trim()) errs.firstName = ["First name is required"];
        if (!state.lastName.trim()) errs.lastName = ["Last name is required"];
        if (!EMAIL_RE.test(state.email)) errs.email = ["Enter a valid email"];
        if (!state.windows[0]?.date)
          errs.window1 = ["Select a date for your first window"];
        if (Object.keys(errs).length > 0) {
          setFieldErrors(errs);
          stepRef.current?.focus();
          return;
        }
        setFieldErrors(undefined);
        dispatch({ type: "SET_STEP", step: "review" });
        return;
      }
      default:
        return;
    }
  }

  function goBack() {
    if (index <= 0) return;
    dispatch({ type: "SET_STEP", step: WIZARD_STEPS[index - 1] });
  }

  async function submit() {
    if (state.status === "submitting") return;
    const request = buildBookingRequest(ctx);

    // No live service wired (static fallback / API down) → keep the stub behavior.
    if (!ctx.liveServiceId) {
      dispatch({ type: "SUBMIT_START" });
      analytics.bookSubmit({
        request_id: request.request_id,
        service_type: request.service_type,
        displayed_price: request.displayed_price.total.amount,
        currency: request.displayed_price.total.currency,
        is_stub: true,
      });
      dispatch({ type: "SUBMIT_OK", request });
      return;
    }

    // Live submit requires an authenticated customer — gate at submit time.
    if (authStatus !== "authenticated") {
      router.push(loginRedirect);
      return;
    }

    dispatch({ type: "SUBMIT_START" });
    try {
      const created = await submitBooking(toServerBooking(ctx));
      analytics.bookSubmit({
        request_id: created.reference,
        service_type: request.service_type,
        displayed_price: created.priceAmount,
        currency: created.currency,
        is_stub: false,
      });
      dispatch({ type: "SUBMIT_OK", request, reference: created.reference });
    } catch (err) {
      if (err instanceof BookingApiError && err.status === 401) {
        router.push(loginRedirect);
        return;
      }
      dispatch({
        type: "SUBMIT_ERROR",
        error:
          err instanceof BookingApiError
            ? err.message
            : "Could not submit your booking. Please try again.",
      });
    }
  }

  const isConfig = state.step === "config";
  const isPricing = state.step === "pricing";
  const isDetails = state.step === "details";
  const isReview = state.step === "review";
  const isSuccess = state.step === "success";
  const primaryStep = isConfig || isPricing || isDetails;
  const showSummary = primaryStep || isReview;
  const breakdown = computePrice(pricing, toConfiguration(state, service));
  const baseLabel = selectionSummary(service, state.selections);
  // Minimum-booking gate (e.g. Beauty's $75): block leaving Configure until the
  // DRAFT total reaches the floor.
  const minBooking = service.min_booking ?? 0;
  const belowMin = breakdown.total.amount < minBooking;

  const PRIMARY_CTA: Partial<Record<WizardStep, string>> = {
    config: "See Pricing",
    pricing: "Continue to Details",
    details: "Review & Confirm",
  };

  const DESCRIPTION: Partial<Record<WizardStep, string>> = {
    details: "Enter your contact information and preferred scheduling windows.",
    review:
      "Please review your booking request before submitting. A coordinator will confirm all details.",
  };

  const summaryNode = isReview ? (
    <RequestSummaryCard
      serviceTitle={service.title}
      session={baseLabel}
      addOns={addOnsSummary(service, state.selections)}
      schedule={formatWindowLabel(state.windows[0])}
      total={`From ${formatMoney(breakdown.total).replace(/\.00$/, "")}`}
    />
  ) : (
    <BookingSummaryCard
      serviceTitle={service.title}
      baseLabel={baseLabel || undefined}
      breakdown={breakdown}
      onSeePricing={goNext}
      seePricingDisabled={isConfig && belowMin}
      condensed={isDetails}
    />
  );

  return (
    <BookingStepLayout
      currentStepIndex={FLOW_INDEX[state.step]}
      complete={isSuccess}
      centered={isSuccess}
      service={{ title: service.title, icon: service.icon }}
      heading={isSuccess ? undefined : STEP_HEADING[state.step]}
      description={DESCRIPTION[state.step]}
      showServiceIdentity={isConfig}
      back={
        isConfig
          ? { label: "Back to Services", href: "/book" }
          : isPricing
            ? { label: "Edit Configuration", onBack: goBack }
            : isReview
              ? { label: "Back to Details", onBack: goBack }
              : undefined
      }
      summaryMobile={isConfig}
      summary={showSummary ? summaryNode : undefined}
    >
      {fieldErrors && Object.keys(fieldErrors).length > 0 ? (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          Please fix the highlighted fields before continuing.
        </div>
      ) : null}

      <div ref={stepRef} tabIndex={-1} className="outline-none">
        {state.step === "config" ? <WizardStepConfig /> : null}
        {state.step === "pricing" ? <WizardStepPricing /> : null}
        {state.step === "details" ? (
          <WizardStepDetails errors={fieldErrors} />
        ) : null}
        {state.step === "review" ? <WizardStepReview /> : null}
        {state.step === "success" ? (
          <BookingSuccessScreen
            request={state.request}
            reference={state.reference}
            live={Boolean(ctx.liveServiceId)}
          />
        ) : null}
      </div>

      {primaryStep ? (
        <Button
          type="button"
          size="lg"
          onClick={goNext}
          disabled={isConfig && belowMin}
          className="mt-8 w-full bg-highlight text-highlight-foreground hover:bg-highlight/90"
        >
          {isConfig && belowMin
            ? `Add services to reach the ${formatMoney({ amount: minBooking, currency: breakdown.total.currency }).replace(/\.00$/, "")} minimum`
            : PRIMARY_CTA[state.step]}
          <ArrowRight aria-hidden />
        </Button>
      ) : isReview ? (
        <div className="mt-8 space-y-4">
          <label className="flex items-start gap-3 rounded-xl bg-muted p-4 text-sm text-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-primary"
            />
            <span>
              I understand that a coordinator will confirm this booking request
              before it is finalized. This is a request, not a confirmed booking.
            </span>
          </label>
          {state.status === "error" && state.error ? (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {state.error}
            </p>
          ) : null}
          <Button
            type="button"
            size="lg"
            onClick={() => void submit()}
            disabled={!consent || state.status === "submitting"}
            className="w-full bg-highlight text-highlight-foreground hover:bg-highlight/90"
          >
            {state.status === "submitting"
              ? "Submitting…"
              : consent
                ? "Submit Booking Request"
                : "Submit Booking Request (Check box above to enable)"}
          </Button>
          <p className="text-xs text-muted-foreground">
            DRAFT EXPERIENCE — This request will be reviewed by a coordinator.
            Pricing and availability subject to confirmation.
          </p>
        </div>
      ) : null}
    </BookingStepLayout>
  );
}
