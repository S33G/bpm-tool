import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
  title: "BPM Tool - BPM to Milliseconds Calculator",
  description: "Convert BPM to milliseconds for precise audio effect timing. Calculate delay times, reverb decay, compressor release, and more for your DAW.",
  keywords: ["BPM", "milliseconds", "ms", "delay calculator", "music production", "DAW", "audio effects", "tempo", "beat sync"],
  authors: [{ name: "BPM Tool" }],
  openGraph: {
    title: "BPM Tool - BPM to Milliseconds Calculator",
    description: "Convert BPM to milliseconds for precise audio effect timing in your DAW.",
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
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
