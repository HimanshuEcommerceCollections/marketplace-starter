import { loadStripe, type Stripe } from "@stripe/stripe-js";

/**
 * Memoized Stripe.js loader. Prefers NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY; falls
 * back to the publishable key the backend returns with the PaymentIntent, so
 * the flow works even if the key isn't duplicated in the client env. Returns
 * null only when no key is available anywhere (component then shows a notice).
 */
let stripePromise: Promise<Stripe | null> | undefined;

export function getStripe(publishableKey?: string): Promise<Stripe | null> | null {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? publishableKey;
  if (!key) return null;
  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}
