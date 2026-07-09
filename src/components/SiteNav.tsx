"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/components", label: "Components" },
  { href: "/notes", label: "Notes" },
];

export default function SiteNav() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/components") {
      return pathname?.startsWith("/components") ?? false;
    }
    return pathname?.startsWith(href) ?? false;
  }

  return (
    <header className="site-nav">
      <nav className="site-nav-inner">
        <div className="site-nav-links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive(link.href) ? "nav-link-active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
