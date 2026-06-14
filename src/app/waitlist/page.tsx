import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { WaitlistForm } from "@/components/forms/waitlist-form";
import { isEnabled } from "@/lib/flags/resolve";

export const metadata: Metadata = { title: "Join the waitlist" };

export default function WaitlistPage() {
  return (
    <Container size="md" className="py-12">
      <h1 className="text-3xl font-bold tracking-tight">Join the waitlist</h1>
      <p className="mt-2 text-muted-foreground">
        Be the first to know when new [Sample] services launch. Stub-only form.
      </p>
      <div className="mt-8">
        {isEnabled("waitlistForm") ? (
          <WaitlistForm />
        ) : (
          <p className="text-sm text-muted-foreground">
            The waitlist is currently closed.
          </p>
        )}
      </div>
    </Container>
  );
}
