import type { Metadata } from "next";
import "./globals.css";
import { APP_CONFIG } from "@/lib/constants";
import { BilyAgent } from "@/components/ai/bily-agent";
import { LanguageProvider } from "@/context/language-context";

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} | ${APP_CONFIG.tagline}`,
  description: APP_CONFIG.description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060b19] text-slate-100 antialiased selection:bg-cyan-500 selection:text-white relative">
        <LanguageProvider>
          {children}
          {/* Floating AI Threat Copilot Widget (Bottom-Right Corner) */}
          <BilyAgent />
        </LanguageProvider>
      </body>
    </html>
  );
}
