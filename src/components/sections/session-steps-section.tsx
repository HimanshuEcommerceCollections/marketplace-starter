import Image from "next/image";
import { Container } from "@/components/layout/container";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { FeatureItem } from "@/lib/brand/types";
import type { Surface } from "@/lib/services/landing";

export interface SessionStepsSectionProps {
  heading?: string;
  subheading?: string;
  image?: {
    src?: string;
    alt?: string;
    caption?: { title: string; lines: string[] };
  };
  imagePosition?: "left" | "right";
  items: FeatureItem[];
  surface?: Surface;
}

/**
 * Two-column "what happens" detail — an image frame beside an icon list of
 * labeled phases (e.g. "What Happens During a Session?"). Server component,
 * token-only. Desktop: image and list side by side · Mobile/tablet: stacked,
 * image first.
 */
export function SessionStepsSection({
  heading,
  subheading,
  image,
  imagePosition = "left",
  items,
  surface = "default",
}: SessionStepsSectionProps) {
  const showImage = !!image?.src && !image.src.toLowerCase().endsWith(".svg");
  const caption = image?.caption;

  const media = (
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
              <p key={line} className="text-sm text-surface-inverse-foreground/60">
                {line}
              </p>
            ))}
          </div>
        ) : null}
      </AspectRatio>
    </div>
  );

  const content = (
    <div className="flex flex-col gap-6">
      {heading ? (
        <div>
          <h2
            id="session-steps-heading"
            className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl"
          >
            {heading}
          </h2>
          {subheading ? (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {subheading}
            </p>
          ) : null}
        </div>
      ) : null}

      <ul role="list" className="flex flex-col gap-6">
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <li key={item.title} className="flex items-start gap-4">
              <span
                aria-hidden
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
              >
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <section
      aria-labelledby={heading ? "session-steps-heading" : undefined}
      className={cn("py-16 md:py-20 lg:py-28", surface === "muted" && "bg-muted")}
    >
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {imagePosition === "right" ? (
          <>
            <div className="order-2 lg:order-1">{content}</div>
            <div className="order-1 lg:order-2">{media}</div>
          </>
        ) : (
          <>
            {media}
            {content}
          </>
        )}
      </Container>
    </section>
  );
}
