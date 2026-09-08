"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookHeart, Moon, Sparkles, Star, UserRound } from "lucide-react";
import clsx from "clsx";
import { nativeHaptics } from "@/lib/native/haptics";

const items = [
  { href: "/", label: "Dreams", icon: Moon },
  { href: "/tarot", label: "Tarot", icon: Sparkles },
  { href: "/horoscope", label: "Horoscope", icon: Star },
  { href: "/history", label: "Journal", icon: BookHeart },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function IOSBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="ios-bottom-navigation" aria-label="Primary app navigation">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            onClick={() => void nativeHaptics.tab()}
            className={clsx("ios-bottom-navigation__item", active && "is-active")}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
