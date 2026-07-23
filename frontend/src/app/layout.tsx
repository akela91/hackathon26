import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "@/lib/providers";
import Navbar from "@/components/nav/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Library Wrapped 📚 — Az évünk könyvekben",
  description:
    "Interaktív, gamifikált visszatekintés a könyvtári kölcsönzési adatokra. Statisztikák, animált chartok és kvíz.",
};

// Ez a script a hidratáció ELŐTT fut (next/script beforeInteractive), hogy a
// mentett/rendszer téma azonnal beálljon, és ne villanjon fel a rossz téma
// (FOUC) az oldal betöltésekor.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var saved = localStorage.getItem('lw-theme');
    var theme = saved === 'light' || saved === 'dark'
      ? saved
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hu"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <div className="bg-aurora" />
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
