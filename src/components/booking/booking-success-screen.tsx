"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SampleBadge } from "@/components/shared/sample-badge";
import { formatMoney } from "@/lib/money";
import type { BookingRequest } from "@/lib/booking/contract";

/**
 * Confirmation screen. Renders the booking_request summary. When `request` is
 * undefined (e.g. a direct visit to /book/success without state), it degrades
 * to a [Sample] placeholder instead of erroring.
 */
export function BookingSuccessScreen({
  request,
}: {
  request?: BookingRequest;
}) {
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <Card>
      <CardContent className="p-8 text-center" role="status">
        <CheckCircle2
          className="mx-auto size-12 text-success"
          aria-hidden
        />
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 text-2xl font-bold outline-none"
        >
          Request received
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This is a stub confirmation — nothing was sent to a backend.
        </p>

        <div className="mx-auto mt-6 max-w-sm text-left">
          {request ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Request ID</dt>
                <dd className="font-mono text-xs">{request.request_id}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Service type</dt>
                <dd>{request.service_type}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="capitalize">{request.status}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Estimated total</dt>
                <dd className="font-semibold">
                  {formatMoney(request.displayed_price.total)}
                </dd>
              </div>
            </dl>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-4 text-center">
              <SampleBadge />
              <p className="text-sm text-muted-foreground">
                No booking in progress. Start from a service to see a real
                confirmation.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link href="/services">Browse services</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
