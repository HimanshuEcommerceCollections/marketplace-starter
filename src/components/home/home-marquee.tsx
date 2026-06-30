/**
 * Infinite horizontal marquee of service names + service-area tags. Pure CSS
 * animation (see .home-marquee in home.css), so this stays a server component
 * and pauses automatically under prefers-reduced-motion.
 */
export interface HomeMarqueeProps {
  items: string[];
}

export function HomeMarquee({ items }: HomeMarqueeProps) {
  if (items.length === 0) return null;
  // Duplicate the set so the -50% keyframe loops seamlessly.
  const loop = [...items, ...items];

  return (
    <div className="home-marquee border-y border-border py-5" aria-hidden>
      <div className="home-marquee-track">
        {loop.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="inline-flex items-center gap-2.5 px-8 text-sm text-muted-foreground"
          >
            <span className="size-1 shrink-0 rounded-full bg-primary" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
