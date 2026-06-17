import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { BookingFlowStepper } from "./booking-flow-stepper";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface BackAction {
  label: string;
  /** Use href for a link (e.g. exit to /book) or onBack for an in-wizard step back. */
  href?: string;
  onBack?: () => void;
}

export interface BookingStepLayoutProps {
  /** Zero-based index into BOOKING_FLOW_STEPS. */
  currentStepIndex: number;
  /** Render the stepper as fully complete (final "Done" step). */
  complete?: boolean;
  /** Center the content (used by the Done screen). */
  centered?: boolean;
  service: { title: string; icon?: string };
  /** Step heading. Rendered as a subhead under the service title, or as the
   *  main heading when `showServiceIdentity` is false. */
  heading?: string;
  /** Optional supporting copy under the heading. */
  description?: string;
  /** Show the service icon + title block. Default true. */
  showServiceIdentity?: boolean;
  /** Back affordance ("Back to Services" link / "Edit Configuration" button). */
  back?: BackAction;
  /** Optional right-rail content (sticky on desktop). */
  summary?: React.ReactNode;
  /** Whether the summary also shows on mobile (below the form). Default true. */
  summaryMobile?: boolean;
  children: React.ReactNode;
}

const BACK_CLS =
  "inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function BookingStepLayout({
  currentStepIndex,
  complete = false,
  centered = false,
  service,
  heading,
  description,
  showServiceIdentity = true,
  back,
  summary,
  summaryMobile = true,
  children,
}: BookingStepLayoutProps) {
  const Icon = getIcon(service.icon);

  const main = (
    <>
      {back ? (
        back.href ? (
          <Link href={back.href} className={BACK_CLS}>
            <ArrowLeft className="size-4" aria-hidden />
            {back.label}
          </Link>
        ) : (
          <button type="button" onClick={back.onBack} className={BACK_CLS}>
            <ArrowLeft className="size-4" aria-hidden />
            {back.label}
          </button>
        )
      ) : null}

      {showServiceIdentity ? (
        <>
          <div className="mt-4 flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-inverse text-surface-inverse-foreground"
            >
              <Icon className="size-5" strokeWidth={1.75} />
            </span>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {service.title}
            </h1>
          </div>
          {heading ? (
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              {heading}
            </h2>
          ) : null}
        </>
      ) : heading ? (
        <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {heading}
        </h1>
      ) : null}

      {description ? (
        <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
      ) : null}

      <div className="mt-6">{children}</div>
    </>
  );

  return (
    <Container size="xl" className="py-8 md:py-10">
      <BookingFlowStepper currentIndex={currentStepIndex} complete={complete} />

      {summary ? (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-3 lg:gap-10">
          <div className="min-w-0 lg:col-span-2">{main}</div>
          <aside
            className={cn(
              "min-w-0 lg:col-span-1",
              !summaryMobile && "hidden lg:block",
            )}
          >
            <div className="lg:sticky lg:top-6">{summary}</div>
          </aside>
        </div>
      ) : centered ? (
        <div className="mx-auto mt-8 max-w-2xl text-center lg:mt-10">{main}</div>
      ) : (
        <div className="mt-8 max-w-2xl lg:mt-10">{main}</div>
      )}
    </Container>
  );
}
