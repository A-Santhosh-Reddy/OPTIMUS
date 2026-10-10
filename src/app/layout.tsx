import type { Metadata } from "next";
import "./globals.css";
import { APP_CONFIG } from "@/lib/constants";
import { BilyAgent } from "@/components/ai/bily-agent";

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} | ${APP_CONFIG.tagline}`,
  description: APP_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060b19] text-slate-100 antialiased selection:bg-cyan-500 selection:text-white relative">
        {children}
        {/* Floating AI Threat Copilot Widget (Bottom-Right Corner) */}
        <BilyAgent />
      </body>
    </html>
  );
}
