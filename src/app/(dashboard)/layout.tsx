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
    <div className="min-h-screen bg-[#050814] text-slate-100 flex relative overflow-hidden">
      {/* Background Liquid Ambient Light Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="cyber-glow-orb -top-32 -left-32 w-96 h-96 bg-cyan-600/20" />
        <div className="cyber-glow-orb top-1/3 -right-48 w-[500px] h-[500px] bg-blue-600/15" />
        <div className="cyber-glow-orb -bottom-48 left-1/4 w-[600px] h-[600px] bg-indigo-600/15" />
        <div className="absolute inset-0 cyber-grid-overlay opacity-30" />
      </div>

      {/* SOC Sidebar */}
      <Sidebar
        userRole={user.role}
        userName={user.name}
        userEmail={user.email}
        username={user.username || undefined}
        organizationName={user.organizationName}
      />

      {/* Main Content Area (Offset by fixed sidebar width) */}
      <div className="ml-64 flex-1 flex flex-col min-w-0 z-10 relative">
        <Topbar
          userName={user.name}
          organizationName={user.organizationName}
        />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
