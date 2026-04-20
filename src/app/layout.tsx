import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-serif",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Observatorio Presidencial Colombia 2026",
  description: "Borrador interactivo de candidatos con identidad visual institucional y carrusel 3D.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.variable} ${ibmPlexSerif.variable} h-full antialiased`}
      data-theme="light"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
