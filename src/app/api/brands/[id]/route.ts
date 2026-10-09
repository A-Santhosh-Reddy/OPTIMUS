import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { canManageBrands } from "@/lib/auth/rbac";
import { logAuditEvent } from "@/lib/audit/logger";
import { generateBrandPermutations } from "@/lib/detection/brand-permutations";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brand = await db.brandAsset.findFirst({
      where: { id: params.id, organizationId: user.organizationId },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand asset not found" }, { status: 404 });
    }

    let parsedAliases: string[] = [];
    try {
      parsedAliases = brand.aliases ? JSON.parse(brand.aliases) : [];
    } catch {}

    const brandObj = {
      brandName: brand.brandName,
      officialDomain: brand.officialDomain,
      aliases: parsedAliases,
    };

    // Generate live adversarial permutations
    const permutations = generateBrandPermutations(brandObj);

    // Fetch any historical findings in DB that impersonate this brand
    let relatedFindings: any[] = [];
    try {
      const dbSimilarities = await db.brandSimilarityResult.findMany({
        where: {
          brandName: {
            contains: brand.brandName,
          },
        },
        include: {
          analysis: true,
        },
        take: 5,
      });

      relatedFindings = dbSimilarities.map((s) => ({
        id: s.id,
        domain: s.analysis?.normalizedHostname || s.officialDomain,
        title: s.details,
        severity: s.analysis?.severity || "HIGH",
        similarityScore: s.similarityScore,
        matchType: s.matchType,
      }));
    } catch (e) {
      // Fallback if empty
      relatedFindings = [];
    }

    return NextResponse.json({
      brand: {
        ...brand,
        aliases: parsedAliases,
      },
      permutations,
      relatedFindings,
      totalPermutations: permutations.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch brand asset details" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageBrands(user)) {
      return NextResponse.json(
        { error: "Forbidden: Administrator role required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const brand = await db.brandAsset.findFirst({
      where: { id: params.id, organizationId: user.organizationId },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand asset not found" }, { status: 404 });
    }

    const updated = await db.brandAsset.update({
      where: { id: brand.id },
      data: {
        isActive: typeof body.isActive === "boolean" ? body.isActive : brand.isActive,
      },
    });

    await logAuditEvent({
      organizationId: user.organizationId,
      actorId: user.id,
      actorEmail: user.email,
      action: "BRAND_UPDATED",
      resourceType: "BrandAsset",
      resourceId: brand.id,
      metadata: { isActive: updated.isActive },
    });

    return NextResponse.json({ success: true, brand: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update brand asset" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageBrands(user)) {
      return NextResponse.json(
        { error: "Forbidden: Administrator role required" },
        { status: 403 }
      );
    }

    const brand = await db.brandAsset.findFirst({
      where: { id: params.id, organizationId: user.organizationId },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand asset not found" }, { status: 404 });
    }

    await db.brandAsset.delete({
      where: { id: brand.id },
    });

    await logAuditEvent({
      organizationId: user.organizationId,
      actorId: user.id,
      actorEmail: user.email,
      action: "BRAND_DELETED",
      resourceType: "BrandAsset",
      resourceId: brand.id,
      metadata: { brandName: brand.brandName, officialDomain: brand.officialDomain },
    });

    return NextResponse.json({ success: true, message: "Brand asset removed" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete brand asset" }, { status: 500 });
  }
}
