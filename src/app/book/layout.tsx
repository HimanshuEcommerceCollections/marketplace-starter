import { Container } from "@/components/layout/container";

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container size="md" className="py-12">
      {children}
    </Container>
  );
}
