import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const editorial = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const uiSans = Plus_Jakarta_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
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
      className={`${editorial.variable} ${uiSans.variable} h-full antialiased`}
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
        </header>

        <main className="site-main">{children}</main>
      </body>
    </html>
  );
}
