import type { Metadata } from "next";
import { Fira_Sans, IBM_Plex_Mono, Varela_Round } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/providers";
import Navbar from "@/components/nav/Navbar";

// Qulto Design System tipográfia:
//  • Fira Sans     → UI + display + body
//  • IBM Plex Mono → azonosítók, kódok, MARC mezők
//  • Varela Round  → logó / wordmark
const firaSans = Fira_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

const varelaRound = Varela_Round({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "400",
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
    var theme = saved === 'light' || saved === 'dark' || saved === 'unicorn'
      ? saved
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
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
      className={`${firaSans.variable} ${plexMono.variable} ${varelaRound.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* No-FOUC téma-inicializálás a hidratáció előtt (klasszikus inline script). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
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
