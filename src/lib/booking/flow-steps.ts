/** The 6-step booking flow shown in the Step indicator (config-driven). */
export interface BookingFlowStep {
  id: string;
  label: string;
}

export const BOOKING_FLOW_STEPS: BookingFlowStep[] = [
  { id: "select", label: "Select" },
  { id: "configure", label: "Configure" },
  { id: "pricing", label: "Pricing" },
  { id: "details", label: "Details" },
  { id: "confirm", label: "Confirm" },
  { id: "done", label: "Done" },
];
