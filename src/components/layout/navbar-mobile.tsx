"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { NavItem } from "@/lib/brand/types";

export function NavbarMobile({
  links,
  cta,
}: {
  links: NavItem[];
  cta?: NavItem;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetTitle className="text-base font-semibold">Menu</SheetTitle>
        <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
          {links.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
          {cta ? (
            <SheetClose asChild>
              <Button asChild className="mt-4">
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            </SheetClose>
          ) : null}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
