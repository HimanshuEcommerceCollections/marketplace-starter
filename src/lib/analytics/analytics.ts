import { isEnabled } from "@/lib/flags/resolve";
import { getActiveBrandId } from "@/lib/brand/registry";
import { consoleTransport, type AnalyticsTransport } from "./transport";
import type {
  AnalyticsEventMap,
  AnalyticsEventName,
  EventInput,
} from "./events";

let transports: AnalyticsTransport[] = [consoleTransport];

/** Register an additional transport (e.g. a real provider in a brand repo). */
export function registerTransport(t: AnalyticsTransport) {
  transports = [...transports, t];
}

/** Replace all transports. */
export function setTransports(ts: AnalyticsTransport[]) {
  transports = ts;
}

export function track<E extends AnalyticsEventName>(
  event: E,
  props: EventInput<E>,
) {
  const enriched = {
    brand: getActiveBrandId(),
    ts: new Date().toISOString(),
    ...props,
  } as AnalyticsEventMap[E];

  if (isEnabled("analyticsDebug") && typeof console !== "undefined") {
    console.debug("[analytics:debug]", event, enriched);
  }
  for (const t of transports) t.send(event, enriched);
}

/** Typed convenience helpers — one per required event. */
export const analytics = {
  pageView: (p: EventInput<"page_view">) => track("page_view", p),
  serviceView: (p: EventInput<"service_view">) => track("service_view", p),
  configStart: (p: EventInput<"config_start">) => track("config_start", p),
  configComplete: (p: EventInput<"config_complete">) =>
    track("config_complete", p),
  bookStart: (p: EventInput<"book_start">) => track("book_start", p),
  bookSubmit: (p: EventInput<"book_submit">) => track("book_submit", p),
  proApplySubmit: (p: EventInput<"pro_apply_submit">) =>
    track("pro_apply_submit", p),
  waitlistSubmit: (p: EventInput<"waitlist_submit">) =>
    track("waitlist_submit", p),
};
