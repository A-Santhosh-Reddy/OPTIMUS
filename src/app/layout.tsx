import type { Metadata } from "next";
import "./globals.css";
import { APP_CONFIG } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/next";

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
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
