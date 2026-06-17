import Image from "next/image";
import { MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import type { Surface } from "@/lib/services/landing";

export interface ServiceAreaSectionProps {
  heading: string;
  /** Narrative paragraphs rendered beside the image. */
  paragraphs: string[];
  /** Pin label overlaid on the image (e.g. "Raleigh & Wake County, NC"). */
  mapLabel?: string;
  /** Coverage chips, each rendered with a map-pin glyph. */
  areas: string[];
  image?: {
    src?: string;
    alt?: string;
    caption?: { title: string; lines: string[] };
  };
  surface?: Surface;
}

/**
 * "Local to Raleigh and Wake County" — an image frame (with an optional pin
 * label) beside coverage copy and location chips. Server component, token-only.
 * Desktop: image left, copy right · Mobile/tablet: stacked, image first.
 */
export function ServiceAreaSection({
  heading,
  paragraphs,
  mapLabel,
  areas,
  image,
  surface = "default",
}: ServiceAreaSectionProps) {
  const showImage = !!image?.src && !image.src.toLowerCase().endsWith(".svg");
  const caption = image?.caption;

  return (
    <section
      aria-labelledby="service-area-heading"
      className={cn(
        "py-16 md:py-20 lg:py-28",
        surface === "muted" && "bg-muted",
      )}
    >
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-inverse text-surface-inverse-foreground">
          <AspectRatio ratio={4 / 3}>
            {showImage ? (
              <Image
                src={image!.src!}
                alt={image?.alt ?? ""}
                fill
                sizes="(min-width: 64rem) 50vw, 100vw"
                className="object-cover"
              />
            ) : caption ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-surface-inverse-foreground/70">
                  {caption.title}
                </p>
                {caption.lines.map((line) => (
                  <p
                    key={line}
                    className="text-sm text-surface-inverse-foreground/60"
                  >
                    {line}
                  </p>
                ))}
              </div>
            ) : null}
          </AspectRatio>

          {mapLabel ? (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-surface-inverse/80 px-3 py-1 text-xs font-medium text-surface-inverse-foreground backdrop-blur">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              {mapLabel}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-5">
          <h2
            id="service-area-heading"
            className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl"
          >
            {heading}
          </h2>
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-lg leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}

          {areas.length > 0 ? (
            <ul className="mt-1 flex flex-wrap gap-2">
              {areas.map((area) => (
                <li
                  key={area}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-muted-foreground"
                >
                  <MapPin
                    className="size-3.5 shrink-0 text-highlight"
                    aria-hidden
                  />
                  {area}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
