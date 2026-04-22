"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Candidatos", href: "/candidatos" },
  { label: "Compara candidatos", href: "/compara" },
  { label: "Contactanos", href: "/contactanos" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[color:var(--line-soft)] bg-[color:var(--surface)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-6 py-6">
        <div className="flex items-center gap-3 text-center">
          <span className="h-9 w-9 rounded-full bg-[radial-gradient(circle_at_30%_30%,#dfe7ef,transparent_55%),linear-gradient(140deg,var(--brand),var(--brand-soft))]" />
          <div>
            <p className="text-[0.55rem] font-semibold uppercase tracking-[0.45em] text-[color:var(--ink-muted)]">
              Consultoria Ciudadana
            </p>
            <p className="text-lg font-semibold text-[color:var(--ink)]" style={{ fontFamily: "var(--font-serif)" }}>
              UPB Presidencial
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)] md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition ${
                  isActive
                    ? "text-[color:var(--ink)]"
                    : "hover:text-[color:var(--ink)]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
