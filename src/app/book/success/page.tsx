import type { Metadata } from "next";
import { BookingSuccessScreen } from "@/components/booking/booking-success-screen";

export const metadata: Metadata = { title: "Booking received" };

/**
 * Standalone success route. The in-flow wizard shows the real computed request;
 * a direct visit here degrades to a placeholder (no state).
 */
export default function BookSuccessPage() {
  return <BookingSuccessScreen />;
}
