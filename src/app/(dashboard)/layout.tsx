import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { Sidebar } from "@/components/navigation/sidebar";
import { Topbar } from "@/components/navigation/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex relative overflow-hidden font-sans">
      {/* Precision Ambient Aurora Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Northern Lights - Ribbon 1: Luminous Emerald & Mint */}
        <div className="cyber-glow-orb -top-28 -left-28 w-[750px] h-[750px] bg-emerald-500/18 blur-[140px] animate-aurora-1" />
        
        {/* Northern Lights - Ribbon 2: Royal Indigo & Violet */}
        <div className="cyber-glow-orb top-1/4 -right-40 w-[850px] h-[850px] bg-indigo-600/18 blur-[150px] animate-aurora-2" />
        
        {/* Northern Lights - Ribbon 3: Arctic Teal */}
        <div className="cyber-glow-orb -bottom-32 left-1/3 w-[800px] h-[800px] bg-teal-500/15 blur-[135px] animate-aurora-3" />

        {/* Refined Hairline Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]" />

        {/* Precision Defense Radar Shield Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] pointer-events-none opacity-[0.08] animate-shield-pulse">
          <svg viewBox="0 0 400 400" className="w-full h-full text-teal-400">
            {/* Concentric Defense Radar Rings */}
            <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" className="opacity-40" />
            <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-60" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="opacity-50" />
            <circle cx="200" cy="200" r="60" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-40" />

            {/* Radar Crosshairs */}
            <line x1="20" y1="200" x2="380" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
            <line x1="200" y1="200" x2="200" y2="380" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />

            {/* Giant Cyber Shield Emblem */}
            <path
              d="M 200 65 L 310 115 C 310 240 200 325 200 325 C 200 325 90 240 90 115 Z"
              fill="rgba(37, 99, 235, 0.02)"
              stroke="currentColor"
              strokeWidth="2"
            />
            {/* Inner Shield Trace */}
            <path
              d="M 200 95 L 285 135 C 285 230 200 295 200 295 C 200 295 115 230 115 135 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="8 4"
              className="opacity-70"
            />

            {/* Shield Center Core */}
            <circle cx="200" cy="195" r="24" fill="rgba(37, 99, 235, 0.08)" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M 194 195 L 206 195 M 200 189 L 200 201"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* SOC Sidebar */}
      <Sidebar
        userRole={user.role}
        userName={user.name}
        userEmail={user.email}
        username={user.username || undefined}
        organizationName={user.organizationName}
      />

      {/* Main Content Area (Responsive margin: 0 on mobile, 64 on desktop) */}
      <div className="ml-0 md:ml-64 flex-1 flex flex-col min-w-0 z-10 relative w-full">
        <Topbar
          userName={user.name}
          organizationName={user.organizationName}
        />
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
