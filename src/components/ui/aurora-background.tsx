import React from "react";

export function AuroraBackground({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Dark Teal Ambient Depth Curtains */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Ambient Ribbon 1: Subtle Turquoise Lighting */}
        <div className="absolute -top-[20%] left-[10%] w-[700px] h-[550px] rounded-full bg-[#00DCC2]/[0.04] blur-[140px] animate-aurora-1" />

        {/* Ambient Ribbon 2: Deep Outer Teal */}
        <div className="absolute top-[25%] -right-[10%] w-[750px] h-[650px] rounded-full bg-[#082E2B]/40 blur-[150px] animate-aurora-2" />

        {/* Ambient Ribbon 3: Secondary Surface Shadow */}
        <div className="absolute -bottom-[15%] left-[25%] w-[800px] h-[600px] rounded-full bg-[#0B302D]/35 blur-[135px] animate-aurora-3" />

        {/* Hairline Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(40,80,74,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(40,80,74,0.12)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]" />

        {/* Soft Vignette Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(6,35,33,0.7)_100%)]" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
