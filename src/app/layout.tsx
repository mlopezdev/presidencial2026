import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import NavBar from "@/components/NavBar";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexSerif = IBM_Plex_Serif({
  variable: "--font-plex-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Presidencial 2026 · Colombia",
  description: "Conoce, compara y analiza a los 14 candidatos a la Presidencia de Colombia 2026.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${plexSans.variable} ${plexSerif.variable}`} suppressHydrationWarning>
      <body>
        <NavBar />
        <div style={{ paddingTop: 72 }}>{children}</div>
        <footer
          style={{
            borderTop: "1px solid var(--line)",
            background: "var(--bg-2, #FAFBFC)",
            padding: "36px 20px 40px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0 auto 22px", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 640 }}>
            Proyecto creado en la clase de <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Política Internacional y Transformación Digital</strong> de la{" "}
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>UPB Bucaramanga</strong>.
          </p>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 14 }}>
            Creado por
          </div>
          <ul
            style={{
              listStyle: "none", margin: "0 auto", padding: 0,
              display: "flex", flexWrap: "wrap", justifyContent: "center",
              gap: "8px 10px", maxWidth: 720,
            }}
          >
            {[
              "Ilych Jhosue Esteban Blanco Mendoza",
              "Miguel Andrés Granados Blanco",
              "Kerent Ximena Trujillo García",
              "Juan Diego Albarracín Melgarejo",
            ].map((nombre) => (
              <li
                key={nombre}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontSize: 13.5, fontWeight: 500, color: "var(--ink)",
                  background: "var(--surface, #fff)", border: "1px solid var(--line)",
                  borderRadius: 999, padding: "7px 14px 7px 12px",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 7, height: 7, borderRadius: 999,
                    background: "linear-gradient(180deg, color-mix(in oklab, var(--brand) 100%, white 18%), var(--brand))",
                    flexShrink: 0,
                  }}
                />
                {nombre}
              </li>
            ))}
          </ul>

          <p style={{ margin: "24px auto 0", fontSize: 12, color: "var(--ink-3)" }}>
            © {new Date().getFullYear()} · UPB Bucaramanga ·{" "}
            <a href="/api" style={{ color: "var(--brand)", textDecoration: "underline", textUnderlineOffset: 2 }}>
              API pública
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
