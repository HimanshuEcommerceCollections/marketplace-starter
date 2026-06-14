import { Container } from "@/components/layout/container";
import { SampleBadge } from "@/components/shared/sample-badge";

export interface Stat {
  label: string;
  value: string;
}

/** RULE: numbers are [Sample] placeholders, never fabricated as factual. */
export function StatStrip({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null;
  return (
    <section className="border-y border-border bg-secondary/20 py-10">
      <Container>
        <div className="mb-4 flex justify-center">
          <SampleBadge />
        </div>
        <dl className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-3xl font-bold">{s.value}</dd>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
