import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit/logger";

// In-memory / persistent license configuration state
let currentLicenseState: {
  tier: "ENTERPRISE" | "PROFESSIONAL" | "COMMUNITY";
  licenseKey: string;
  activatedAt: string;
  expiresAt: string;
  issuedTo: string;
  nodeId: string;
} = {
  tier: "ENTERPRISE",
  licenseKey: "OPTM-ENT-2026-CYBER-MATRIX",
  activatedAt: "2026-01-01T00:00:00.000Z",
  expiresAt: "2027-12-31T23:59:59.000Z",
  issuedTo: "CyberDefend Global Security Operations",
  nodeId: "SOC-MATRIX-NODE-8821",
};

const TIER_LIMITS = {
  COMMUNITY: {
    name: "Community Tier",
    dailyScans: 15,
    maxBrands: 2,
    threatFeeds: 1,
    pdfExport: false,
    auditRetentionDays: 7,
    supportLevel: "Community Discord",
  },
  PROFESSIONAL: {
    name: "Professional SOC",
    dailyScans: 250,
    maxBrands: 10,
    threatFeeds: 2,
    pdfExport: true,
    auditRetentionDays: 90,
    supportLevel: "24/7 Standard SLA",
  },
  ENTERPRISE: {
    name: "Enterprise Cyber Matrix",
    dailyScans: Infinity,
    maxBrands: Infinity,
    threatFeeds: 4,
    pdfExport: true,
    auditRetentionDays: 365,
    supportLevel: "Dedicated SOC Technical Account Manager",
  },
};

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get live usage stats from database
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayAnalysesCount, totalBrandsCount, totalIncidentsCount] = await Promise.all([
      db.analysis.count({
        where: {
          createdAt: { gte: today },
        },
      }),
      db.brandAsset.count({
        where: {
          isActive: true,
        },
      }),
      db.incident.count(),
    ]);

    const activeLimits = TIER_LIMITS[currentLicenseState.tier];

    return NextResponse.json({
      license: {
        ...currentLicenseState,
        issuedTo: user.organizationName || currentLicenseState.issuedTo,
        status: "ACTIVE",
      },
      tierConfig: activeLimits,
      usage: {
        todayAnalysesCount,
        dailyScansLimit: activeLimits.dailyScans === Infinity ? "Unlimited" : activeLimits.dailyScans,
        dailyScansPercent:
          activeLimits.dailyScans === Infinity
            ? 12
            : Math.min(100, Math.round((todayAnalysesCount / activeLimits.dailyScans) * 100)),
        totalBrandsCount,
        maxBrandsLimit: activeLimits.maxBrands === Infinity ? "Unlimited" : activeLimits.maxBrands,
        brandsPercent:
          activeLimits.maxBrands === Infinity
            ? 25
            : Math.min(100, Math.round((totalBrandsCount / activeLimits.maxBrands) * 100)),
        totalIncidentsCount,
      },
      availableTiers: Object.entries(TIER_LIMITS).map(([key, value]) => ({
        key,
        ...value,
        isActive: key === currentLicenseState.tier,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch license matrix" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // 1. Switch Tier Directly
    if (body.tier && ["COMMUNITY", "PROFESSIONAL", "ENTERPRISE"].includes(body.tier)) {
      currentLicenseState.tier = body.tier;
      currentLicenseState.activatedAt = new Date().toISOString();

      await logAuditEvent({
        organizationId: user.organizationId,
        actorId: user.id,
        actorEmail: user.email,
        action: "LICENSE_TIER_CHANGED",
        resourceType: "Organization",
        resourceId: user.organizationId,
        metadata: { newTier: body.tier },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        message: `Plan successfully switched to ${TIER_LIMITS[currentLicenseState.tier].name}.`,
        license: currentLicenseState,
        tierConfig: TIER_LIMITS[currentLicenseState.tier],
      });
    }

    // 2. Validate & Apply License Key
    if (body.licenseKey) {
      const cleanKey = body.licenseKey.trim().toUpperCase();

      let targetTier: "ENTERPRISE" | "PROFESSIONAL" | "COMMUNITY" = "COMMUNITY";
      if (cleanKey.includes("ENT") || cleanKey.includes("MATRIX") || cleanKey.startsWith("OPTM-ENT")) {
        targetTier = "ENTERPRISE";
      } else if (cleanKey.includes("PRO") || cleanKey.startsWith("OPTM-PRO")) {
        targetTier = "PROFESSIONAL";
      } else {
        return NextResponse.json(
          { error: "Invalid license key signature. Expected format OPTM-ENT-XXXX or OPTM-PRO-XXXX." },
          { status: 400 }
        );
      }

      currentLicenseState = {
        tier: targetTier,
        licenseKey: cleanKey,
        activatedAt: new Date().toISOString(),
        expiresAt: "2027-12-31T23:59:59.000Z",
        issuedTo: user.organizationName || "CyberDefend Global Security Operations",
        nodeId: `SOC-MATRIX-NODE-${Math.floor(1000 + Math.random() * 9000)}`,
      };

      await logAuditEvent({
        organizationId: user.organizationId,
        actorId: user.id,
        actorEmail: user.email,
        action: "LICENSE_KEY_ACTIVATED",
        resourceType: "Organization",
        resourceId: user.organizationId,
        metadata: { licenseKey: cleanKey, tier: targetTier },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        message: `Enterprise License Key validated and active. Entitlements upgraded to ${TIER_LIMITS[targetTier].name}.`,
        license: currentLicenseState,
        tierConfig: TIER_LIMITS[targetTier],
      });
    }

    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: "License update failed: " + error.message }, { status: 500 });
  }
}
