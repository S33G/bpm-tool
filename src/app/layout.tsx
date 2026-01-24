import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { AppHeader, AppFooter } from "@/components/layout";

export const metadata: Metadata = {
  title: "GrooveLab - Musician Utilities",
  description: "Musician utilities for timing, groove, and harmony. Explore BPM tools, swing grids, chords, scales, and more.",
  keywords: ["music tools", "BPM", "groove", "swing", "chord generator", "piano keyboard", "pitch analyzer", "metronome", "scales", "setlist", "music production", "DAW"],
  authors: [{ name: "GrooveLab" }],
  openGraph: {
    title: "GrooveLab - Musician Utilities",
    description: "Musician utilities for timing, groove, and harmony.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <ToastProvider>
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col">
              <AppHeader />
              <div className="flex-1">
                {children}
              </div>
              <AppFooter />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
