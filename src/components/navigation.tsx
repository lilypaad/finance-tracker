"use client";

import { useState } from "react";
import { useMedia } from "react-use";
import { usePathname, useRouter } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavButton } from "@/components/nav-button";

const routes = [
  {
    href: "/",
    label: "Overview",
  },
  {
    href: "/transactions",
    label: "Transactions",
  },
  {
    href: "/accounts",
    label: "Accounts",
  },
  {
    href: "/categories",
    label: "Categories",
  },
  {
    href: "/settings",
    label: "Settings",
  },
];

export function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMedia("(max-width: 1024px)", false);

  const onClick = (href: string) => {
    router.push(href);
    setDrawerOpen(false);
  }

  if(isMobile) {
    return (
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetTrigger>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
          >
            <Menu className="size-10" />
          </Button>
        </SheetTrigger>
        <SheetTitle></SheetTitle>
        <SheetContent side="left" className="px-2">
          <nav className="flex flex-col gap-y-2 pt-12">
            {routes.map((r) => (
              <Button
                key={r.href}
                variant={r.href === pathname ? "secondary" : "ghost"}
                onClick={() => onClick(r.href)}
                className="w-full justify-start"
              >
                {r.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {routes.map((r) => (
        <NavButton
          key={r.href}
          href={r.href}
          label={r.label}
          isActive={pathname === r.href}
        />
      ))}
    </nav>
  )
};
