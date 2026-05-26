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
            padding: "28px 20px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 640, marginInline: "auto" }}>
            Proyecto creado en la clase de <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Política Internacional y Transformación Digital</strong> de la{" "}
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>UPB Bucaramanga</strong>.
          </p>
        </footer>
      </body>
    </html>
  );
}
