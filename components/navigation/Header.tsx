"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { primaryNavigation } from "@/data/links";
import { TerminalBrand } from "@/components/layout/TerminalBrand";
import { MagneticLink } from "@/components/ui/MagneticLink";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="site-header">
      <div className="header-inner mx-auto flex w-full items-center justify-between">
        <Link className="wordmark" href="/" aria-label="jopantech home">
          <TerminalBrand />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <Link key={item.label} href={item.href}>{item.label}</Link>
          ))}
        </nav>

        <div className="header-actions">
          <MagneticLink className="header-contact-button" href="/#contact" onClick={() => setMenuOpen(false)}>
            Request a review <span aria-hidden="true">→</span>
          </MagneticLink>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-nav${menuOpen ? " is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {primaryNavigation.map((item) => (
          <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>
            {item.label}<span aria-hidden="true">↗</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
