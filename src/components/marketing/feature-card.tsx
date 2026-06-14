import * as React from "react";
import * as Icons from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { FeatureItem } from "@/lib/brand/types";

type IconComponent = React.ComponentType<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

function IconByName({ name }: { name?: string }) {
  if (!name) return null;
  const lookup = Icons as unknown as Record<string, IconComponent>;
  const Icon = lookup[name] ?? Icons.Sparkles;
  return <Icon className="size-6 text-primary" aria-hidden />;
}

export function FeatureCard({ icon, title, description }: FeatureItem) {
  return (
    <Card className="h-full">
      <CardHeader>
        <IconByName name={icon} />
        <CardTitle className="mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
