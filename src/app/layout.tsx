import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import ThemeToggle from "./theme-toggle";

const display = IBM_Plex_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const bodySans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "UPB Presidencial",
  description: "Plataforma de comparacion y perfil de candidatos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${bodySans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="site-header">
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

          <ThemeToggle />
        </header>

        <main className="site-main">{children}</main>
      </body>
    </html>
  );
}
