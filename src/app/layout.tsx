import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { AppHeader, AppFooter } from "@/components/layout";

export const metadata: Metadata = {
  title: "tunetool - Musician Utilities",
  description: "A suite of musician-focused tools: BPM calculator, chord generator, keyboard visualizer, pitch analyzer, metronome, scale explorer, and setlist builder.",
  keywords: ["music tools", "BPM", "chord generator", "piano keyboard", "pitch analyzer", "metronome", "scales", "setlist", "music production", "DAW"],
  authors: [{ name: "tunetool" }],
  openGraph: {
    title: "tunetool - Musician Utilities",
    description: "A suite of musician-focused tools for timing, chords, scales, and more.",
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
