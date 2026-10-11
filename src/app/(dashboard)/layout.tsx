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
    <div className="min-h-screen theme-lapis-vermilion bg-[#eef0fc] text-[#080f2a] flex relative overflow-hidden font-sans">
      {/* Lapis Vermilion (Clay · Imperial) Ambient Lighting Environment */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Ultramarine Lapis & Vermilion Glow Orbs */}
        <div className="cyber-glow-orb -top-24 -left-24 w-[750px] h-[750px] bg-[#1e3a8a]/12" />
        <div className="cyber-glow-orb top-1/4 -right-40 w-[850px] h-[850px] bg-[#dc2626]/10" />
        <div className="cyber-glow-orb -bottom-32 left-1/3 w-[800px] h-[800px] bg-[#1e3a8a]/10" />
        <div className="cyber-glow-orb top-2/3 right-1/4 w-[600px] h-[600px] bg-[#b4bce8]/30" />

        {/* Soft Imperial Clay Matrix Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(180,188,232,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(180,188,232,0.22)_1px,transparent_1px)] bg-[size:48px_48px] opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]" />

        {/* Imperial Defense Radar Shield Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] pointer-events-none opacity-[0.05] animate-shield-pulse">
          <svg viewBox="0 0 400 400" className="w-full h-full text-[#1e3a8a]">
            {/* Concentric Defense Radar Rings */}
            <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" className="opacity-40" />
            <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-60" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="opacity-50" />
            <circle cx="200" cy="200" r="60" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-40" />

            {/* Radar Crosshairs */}
            <line x1="20" y1="200" x2="380" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
            <line x1="200" y1="20" x2="200" y2="380" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />

            {/* Giant Cyber Shield Emblem */}
            <path
              d="M 200 65 L 310 115 C 310 240 200 325 200 325 C 200 325 90 240 90 115 Z"
              fill="rgba(30, 58, 138, 0.05)"
              stroke="currentColor"
              strokeWidth="2.5"
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

            {/* Shield Center Core / Lock Emblem */}
            <circle cx="200" cy="195" r="24" fill="rgba(30, 58, 138, 0.12)" stroke="currentColor" strokeWidth="2" />
            <path
              d="M 194 195 L 206 195 M 200 189 L 200 201"
              stroke="currentColor"
              strokeWidth="2.5"
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
