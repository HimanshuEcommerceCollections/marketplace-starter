import * as React from "react";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl", // shared homepage content rail (80rem)
  full: "max-w-none",
} as const;

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  size?: keyof typeof sizeMap;
}

/** Max-width + responsive horizontal gutter wrapper. All values are tokens. */
export function Container({
  className,
  as: Comp = "div",
  size = "xl",
  ...props
}: ContainerProps) {
  return (
    <Comp
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizeMap[size], className)}
      {...props}
    />
  );
}
