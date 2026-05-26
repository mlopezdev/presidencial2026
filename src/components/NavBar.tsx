"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/lib/useIsMobile";

const navItems = [
  { key: "/", label: "Inicio" },
  { key: "/candidatos", label: "Candidatos" },
  { key: "/compara", label: "Comparar" },
  { key: "/historial", label: "Historial" },
  { key: "/congreso-2026", label: "Congreso 2026" },
  { key: "/contactanos", label: "Contacto" },
];

export default function NavBar() {
  const pathname = usePathname();
  const isMobile = useIsMobile(820);
  const [open, setOpen] = useState(false);

  // Cierra el menú al navegar
  useEffect(() => { setOpen(false); }, [pathname]);

  // Bloquea scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (!isMobile) return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, open]);

  if (isMobile) {
    const active = navItems.find((it) => it.key === pathname);
    return (
      <>
        <div style={{
          position: "fixed", top: 12, left: 0, right: 0,
          zIndex: 60, display: "flex", justifyContent: "center", padding: "0 12px",
          pointerEvents: "none",
        }}>
          <header className="liquid-nav" style={{
            pointerEvents: "auto", width: "100%", maxWidth: 480,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 8px 8px 14px", borderRadius: 999,
          }}>
            <Link href="/" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <span aria-hidden="true" style={{
                width: 24, height: 24, borderRadius: 7,
                background: "linear-gradient(180deg, color-mix(in oklab, var(--brand) 100%, white 18%) 0%, var(--brand) 100%)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 12, letterSpacing: "-0.02em", flexShrink: 0,
              }}>P</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.015em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {active ? active.label : "Presidencial 2026"}
              </span>
            </Link>
            <button
              type="button"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              style={{
                width: 38, height: 38, borderRadius: 999, border: 0,
                background: open ? "var(--brand)" : "rgba(0,0,0,0.05)",
                color: open ? "#fff" : "var(--ink)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0, transition: "background 180ms ease, color 180ms ease",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                ) : (
                  <>
                    <path d="M4 7h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M4 12h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </header>
        </div>

        {/* Drawer */}
        {open && (
          <>
            <div
              onClick={() => setOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 55,
                background: "rgba(13,30,45,0.35)", backdropFilter: "blur(4px)",
              }}
            />
            <nav
              aria-label="Principal"
              style={{
                position: "fixed", zIndex: 58, top: 68, left: 12, right: 12,
                background: "rgba(255,255,255,0.96)",
                backdropFilter: "saturate(180%) blur(20px)",
                WebkitBackdropFilter: "saturate(180%) blur(20px)",
                border: "1px solid rgba(255,255,255,0.7)",
                borderRadius: 20,
                boxShadow: "0 24px 60px -20px rgba(13,30,45,0.32), 0 4px 12px rgba(13,30,45,0.08)",
                padding: 8,
                display: "flex", flexDirection: "column", gap: 2,
              }}
            >
              {navItems.map((it) => {
                const isActive = pathname === it.key;
                return (
                  <Link
                    key={it.key}
                    href={it.key}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    style={{
                      fontSize: 16, fontWeight: isActive ? 600 : 500,
                      color: isActive ? "#fff" : "var(--ink)",
                      background: isActive
                        ? "linear-gradient(180deg, color-mix(in oklab, var(--brand) 100%, white 12%), var(--brand))"
                        : "transparent",
                      padding: "14px 18px", borderRadius: 12,
                      letterSpacing: "-0.01em",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}
                  >
                    {it.label}
                    {isActive && <span style={{ fontSize: 12, opacity: 0.8 }}>actual</span>}
                  </Link>
                );
              })}
            </nav>
          </>
        )}
      </>
    );
  }

  return (
    <div style={{
      position: "fixed", top: 16, left: 0, right: 0,
      zIndex: 50, display: "flex", justifyContent: "center", padding: "0 16px",
      pointerEvents: "none",
    }}>
      <header
        className="liquid-nav"
        style={{
          pointerEvents: "auto",
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 10px 8px 18px", borderRadius: 999,
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Specular highlight */}
        <span aria-hidden="true" style={{
          position: "absolute", inset: 0, borderRadius: "inherit",
          background: "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 55%)",
          pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.7,
        }} />

        {/* Brand */}
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "transparent", padding: "4px 10px 4px 0",
          position: "relative", zIndex: 1,
        }}>
          <span aria-hidden="true" style={{
            width: 26, height: 26, borderRadius: 8,
            background: "linear-gradient(180deg, color-mix(in oklab, var(--brand) 100%, white 18%) 0%, var(--brand) 100%)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: "-0.02em",
            boxShadow: "0 1px 0 rgba(255,255,255,0.5) inset, 0 2px 5px -1px rgba(0,0,0,0.18)",
          }}>
            P
          </span>
          <span style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.015em" }}>
            Presidencial 2026
          </span>
        </Link>

        {/* Divider */}
        <span aria-hidden="true" style={{
          width: 1, height: 22,
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)",
          margin: "0 4px", position: "relative", zIndex: 1,
        }} />

        {/* Nav items */}
        <nav aria-label="Principal" style={{ display: "flex", gap: 2, position: "relative", zIndex: 1 }}>
          {navItems.map((it) => {
            const active = pathname === it.key;
            return (
              <Link
                key={it.key}
                href={it.key}
                aria-current={active ? "page" : undefined}
                style={{
                  fontSize: 15, fontWeight: active ? 600 : 500,
                  color: active ? "#fff" : "var(--ink-2)",
                  background: active
                    ? "linear-gradient(180deg, color-mix(in oklab, var(--brand) 100%, white 12%), var(--brand))"
                    : "transparent",
                  padding: "8px 16px", borderRadius: 999,
                  transition: "background 200ms ease, color 200ms ease",
                  letterSpacing: "-0.01em",
                  boxShadow: active ? "0 1px 0 rgba(255,255,255,0.35) inset, 0 4px 12px -4px rgba(13,30,45,0.35)" : "none",
                  display: "inline-flex", alignItems: "center",
                }}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
      </header>
    </div>
  );
}
