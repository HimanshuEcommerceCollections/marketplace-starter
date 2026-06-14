"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  BookingProvider,
  useBookingDraft,
  buildBookingRequest,
  toConfiguration,
  WIZARD_STEPS,
} from "./booking-provider";
import { WizardStepper } from "./wizard-stepper";
import { WizardStepConfig } from "./wizard-step-config";
import { WizardStepSchedule } from "./wizard-step-schedule";
import { WizardStepContact } from "./wizard-step-contact";
import { WizardStepReview } from "./wizard-step-review";
import { BookingSuccessScreen } from "./booking-success-screen";
import { analytics } from "@/lib/analytics/analytics";
import { computePrice } from "@/lib/pricing/engine";
import { validateForm, type FieldErrors } from "@/lib/forms/validate";
import { ContactSchema } from "@/lib/booking/contract.schema";
import type { Service } from "@/lib/catalog/types";
import type { PricingTable } from "@/lib/pricing/types";
import type { BrandId } from "@/lib/brand/registry";

export interface BookingWizardProps {
  service: Service;
  pricing: PricingTable;
  brandId: BrandId;
}

export function BookingWizard(props: BookingWizardProps) {
  return (
    <BookingProvider
      service={props.service}
      pricing={props.pricing}
      brandId={props.brandId}
    >
      <WizardInner />
    </BookingProvider>
  );
}

function WizardInner() {
  const ctx = useBookingDraft();
  const { state, dispatch, service, pricing } = ctx;
  const [contactErrors, setContactErrors] = React.useState<FieldErrors>();
  const stepRef = React.useRef<HTMLDivElement>(null);
  const index = WIZARD_STEPS.indexOf(state.step);

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
        const breakdown = computePrice(pricing, toConfiguration(state, service));
        analytics.configComplete({
          service_id: service.id,
          service_type: service.service_type,
          option_count: Object.keys(state.selections).length,
          displayed_price: breakdown.total.amount,
          currency: breakdown.total.currency,
        });
        dispatch({ type: "SET_STEP", step: "schedule" });
        return;
      }
      case "schedule": {
        analytics.bookStart({
          service_id: service.id,
          service_type: service.service_type,
          step: index,
        });
        dispatch({ type: "SET_STEP", step: "contact" });
        return;
      }
      case "contact": {
        const result = validateForm(ContactSchema, state.contact);
        if (!result.success) {
          setContactErrors(result.errors);
          stepRef.current?.focus();
          return;
        }
        setContactErrors(undefined);
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

  function submit() {
    dispatch({ type: "SUBMIT_START" });
    const request = buildBookingRequest(ctx);
    analytics.bookSubmit({
      request_id: request.request_id,
      service_type: request.service_type,
      displayed_price: request.displayed_price.total.amount,
      currency: request.displayed_price.total.currency,
      is_stub: true,
    });
    dispatch({ type: "SUBMIT_OK", request });
  }

  if (state.step === "success") {
    return <BookingSuccessScreen request={state.request} />;
  }

  return (
    <div className="space-y-8">
      <WizardStepper step={state.step} />

      {contactErrors && Object.keys(contactErrors).length > 0 ? (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          Please fix the highlighted fields before continuing.
        </div>
      ) : null}

      <div ref={stepRef} tabIndex={-1} className="outline-none">
        {state.step === "config" ? <WizardStepConfig /> : null}
        {state.step === "schedule" ? <WizardStepSchedule /> : null}
        {state.step === "contact" ? (
          <WizardStepContact errors={contactErrors} />
        ) : null}
        {state.step === "review" ? <WizardStepReview /> : null}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={goBack}
          disabled={index === 0}
        >
          Back
        </Button>
        {state.step === "review" ? (
          <Button
            type="button"
            onClick={submit}
            disabled={state.status === "submitting"}
          >
            Submit booking
          </Button>
        ) : (
          <Button type="button" onClick={goNext}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
