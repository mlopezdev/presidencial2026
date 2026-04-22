"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const COLLAPSE_OFFSET = 24;

export default function SiteHeader() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsCollapsed(window.scrollY > COLLAPSE_OFFSET);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`site-header${isCollapsed ? " is-collapsed" : ""}`}>
      <div className="brand-row">
        <div className="brand-mark" aria-hidden="true" />
        <div className="brand-copy">
          <p className="brand-label">Consultoria Ciudadana</p>
          <h1 className="brand-name">UPB Presidencial</h1>
        </div>
      </div>

      <nav className="main-nav" aria-label="Navegacion principal">
        <Link href="/">Inicio</Link>
        <Link href="/candidatos">Candidatos</Link>
        <Link href="/compara">Compara</Link>
        <Link href="/contactanos">Contactanos</Link>
      </nav>
    </header>
  );
}
