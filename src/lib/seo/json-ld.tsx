import type { JsonLdThing } from "./jsonld";

/**
 * Inject JSON-LD as a <script type="application/ld+json">. Server component.
 * Data is our own (never user input), so JSON.stringify is safe here.
 */
export function JsonLd({ data }: { data: JsonLdThing | JsonLdThing[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
