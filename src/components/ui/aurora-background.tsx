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
      {/* Aurora Ambient Light Curtains */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Northern Lights - Ribbon 1: Luminous Emerald & Mint */}
        <div className="absolute -top-[20%] left-[10%] w-[700px] h-[550px] rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-400/18 to-transparent blur-[130px] animate-aurora-1" />

        {/* Northern Lights - Ribbon 2: Royal Indigo & Violet */}
        <div className="absolute top-[25%] -right-[10%] w-[750px] h-[650px] rounded-full bg-gradient-to-bl from-indigo-500/22 via-purple-600/18 to-transparent blur-[140px] animate-aurora-2" />

        {/* Northern Lights - Ribbon 3: Deep Arctic Cyan & Teal */}
        <div className="absolute -bottom-[15%] left-[25%] w-[800px] h-[600px] rounded-full bg-gradient-to-tr from-teal-500/18 via-cyan-500/15 to-transparent blur-[135px] animate-aurora-3" />

        {/* Subtle Precision Cyber Starlight Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]" />

        {/* Soft Contrast Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(3,7,18,0.6)_100%)]" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
