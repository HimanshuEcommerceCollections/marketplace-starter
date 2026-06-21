import type { BrandId } from "@/lib/brand/registry";

/** Auto-filled by track(); callers omit brand + ts. */
interface BaseProps {
  brand: BrandId;
  ts: string;
  path?: string;
  session_id?: string;
}

export interface PageViewProps extends BaseProps {
  path: string;
  referrer?: string;
  title?: string;
}
export interface ServiceViewProps extends BaseProps {
  service_id: string;
  category?: string;
  displayed_price?: number;
  currency?: string;
}
export interface ConfigStartProps extends BaseProps {
  service_id: string;
  service_type: string;
}
export interface ConfigCompleteProps extends BaseProps {
  service_id: string;
  service_type: string;
  option_count: number;
  displayed_price: number;
  currency: string;
}
export interface BookStartProps extends BaseProps {
  service_id: string;
  service_type: string;
  step: number;
}
export interface BookSubmitProps extends BaseProps {
  request_id: string;
  service_type: string;
  displayed_price: number;
  currency: string;
  // false once a booking is submitted to the live backend; true for the demo stub.
  is_stub: boolean;
}
export interface ProApplySubmitProps extends BaseProps {
  service_category?: string;
  is_stub: true;
}
export interface WaitlistSubmitProps extends BaseProps {
  service_id?: string;
  is_stub: true;
}

/** THE typed event map — keys are EXACTLY the 8 required event names. */
export interface AnalyticsEventMap {
  page_view: PageViewProps;
  service_view: ServiceViewProps;
  config_start: ConfigStartProps;
  config_complete: ConfigCompleteProps;
  book_start: BookStartProps;
  book_submit: BookSubmitProps;
  pro_apply_submit: ProApplySubmitProps;
  waitlist_submit: WaitlistSubmitProps;
}

export type AnalyticsEventName = keyof AnalyticsEventMap;

/** Input props: caller-supplied fields (brand + ts are injected by track()). */
export type EventInput<E extends AnalyticsEventName> = Omit<
  AnalyticsEventMap[E],
  "brand" | "ts"
>;
