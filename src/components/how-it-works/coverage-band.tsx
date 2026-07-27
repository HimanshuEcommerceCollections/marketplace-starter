"use client";

import * as React from "react";
import { apiClient } from "@/lib/api/client";
import { useGsap } from "@/lib/anim/use-gsap";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import type { HowItWorksCoverage } from "@/lib/how-it-works/page";

const PinIcon = getPhosphorIcon("MapPin");

/**
 * `GET /areas` caps `limit` at 100, which is also far more markets than this band
 * can legibly render. Asking for the max keeps the band complete without paging.
 */
const AREA_LIMIT = 100;

/** The one field this band reads off an `AreaResponse`. */
interface AreaNameRow {
  name?: unknown;
}

/**
 * Coverage band — centered head + map-pin area pills over a soft photo wash.
 *
 * The pills reflect the REAL operating markets: `GET /areas` is role-aware, so an
 * anonymous caller sees exactly the ACTIVE ones, ordered by the `sortOrder` an
 * admin controls. That is the whole point — the previous hardcoded twelve-town
 * list meant a market an admin created never appeared here, and one they switched
 * off never disappeared.
 *
 * The `areas` prop is the SSR/fallback copy from the brand config. It renders
 * immediately (so the band is never blank and never shifts height on hydration)
 * and it stays if the fetch fails, is empty, or returns nothing usable. A live
 * answer replaces it; a broken API never produces an empty band.
 */
export function CoverageBand({
  eyebrow,
  heading,
  sub,
  areas,
  note,
}: HowItWorksCoverage) {
  const [liveAreas, setLiveAreas] = React.useState<string[] | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const res = await apiClient.get("/areas", {
          // Defaults already sort by the admin-controlled `sortOrder`, ascending.
          params: { limit: AREA_LIMIT },
          signal: controller.signal,
        });
        // `abort()` is a no-op once the response has landed, so the signal is what
        // stops a late answer from setting state on an unmounted band.
        if (controller.signal.aborted) return;
        if (res.status < 200 || res.status >= 300) return;
        const body = res.data as { data?: unknown } | null;
        const rows: unknown[] = Array.isArray(body?.data) ? body.data : [];
        const names = rows
          .map((row) => {
            const value = (row as AreaNameRow).name;
            return typeof value === "string" ? value.trim() : "";
          })
          .filter((name) => name.length > 0);
        // An empty live list is NOT an answer worth rendering: an ACTIVE market
        // with zero ZIPs is still a market, and a band with no pills reads as
        // "they serve nowhere". Keep the configured copy instead.
        if (names.length > 0) setLiveAreas(names);
      } catch {
        /* offline / aborted / malformed — the configured fallback stands */
      }
    })();
    return () => controller.abort();
  }, []);

  const shownAreas = liveAreas ?? areas;
  // Keyed on CONTENT, not array identity: the GSAP context is reverted and
  // replayed exactly once, when the live markets replace the fallback copy.
  const areaKey = shownAreas.join("|");

  const scope = useGsap<HTMLElement>(
    ({ gsap, scope }) => {
      gsap.from(scope.querySelectorAll(".js-hiw-coverage-reveal"), {
        scrollTrigger: { trigger: scope, start: "top 84%", once: true },
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
      });
      gsap.from(scope.querySelectorAll(".hiw-area-pill"), {
        scrollTrigger: {
          trigger: scope.querySelector(".hiw-area-pills"),
          start: "top 88%",
          once: true,
        },
        y: 14,
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.04,
        ease: "power2.out",
      });
    },
    [areaKey],
  );

  return (
    <section
      ref={scope}
      className="hiw-coverage"
      aria-labelledby="hiw-coverage-heading"
    >
      <div className="hiw-coverage-inner">
        <div className="hiw-section-head">
          {eyebrow ? (
            <p className="js-hiw-coverage-reveal hiw-eyebrow">{eyebrow}</p>
          ) : null}
          <h2 id="hiw-coverage-heading" className="js-hiw-coverage-reveal">
            {heading}
          </h2>
          {sub ? <p className="js-hiw-coverage-reveal">{sub}</p> : null}
        </div>
        <ul className="hiw-area-pills">
          {shownAreas.map((area) => (
            <li key={area} className="hiw-area-pill">
              <PinIcon weight="regular" aria-hidden />
              {area}
            </li>
          ))}
        </ul>
        {note ? (
          <p className="js-hiw-coverage-reveal hiw-coverage-note">{note}</p>
        ) : null}
      </div>
    </section>
  );
}
