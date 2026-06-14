import type { AnalyticsEventName, AnalyticsEventMap } from "./events";

export interface AnalyticsTransport {
  name: string;
  send<E extends AnalyticsEventName>(
    event: E,
    props: AnalyticsEventMap[E],
  ): void;
}

/** Default STUB transport: console only, NO network. */
export const consoleTransport: AnalyticsTransport = {
  name: "console",
  send(event, props) {
    if (typeof console !== "undefined") {
      console.info(`[analytics:stub] ${event}`, props);
    }
  },
};
