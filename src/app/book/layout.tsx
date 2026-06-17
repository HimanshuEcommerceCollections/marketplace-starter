import { BookingHeader } from "@/components/booking/booking-header";

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BookingHeader />
      {children}
    </>
  );
}
