import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { canManageBrands } from "@/lib/auth/rbac";
import { logAuditEvent } from "@/lib/audit/logger";

const CreateBrandSchema = z.object({
  brandName: z.string().min(2, "Brand name must be at least 2 characters"),
  officialDomain: z.string().min(3, "Official domain is required"),
  aliases: z.array(z.string()).optional().default([]),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brands = await db.brandAsset.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { createdAt: "desc" },
    });

    const parsedBrands = brands.map((b) => {
      let aliases: string[] = [];
      try {
        aliases = b.aliases ? JSON.parse(b.aliases) : [];
      } catch {}
      return {
        ...b,
        aliases,
      };
    });

    return NextResponse.json({ brands: parsedBrands });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch brand assets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageBrands(user)) {
      return NextResponse.json(
        { error: "Forbidden: Administrator role required to register protected brands" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = CreateBrandSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid brand payload", details: parsed.error.format() }, { status: 400 });
    }

    const { brandName, officialDomain, aliases } = parsed.data;
    const cleanDomain = officialDomain.toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

    const brand = await db.brandAsset.create({
      data: {
        organizationId: user.organizationId,
        brandName,
        officialDomain: cleanDomain,
        aliases: JSON.stringify(aliases),
        isActive: true,
      },
    });

    await logAuditEvent({
      organizationId: user.organizationId,
      actorId: user.id,
      actorEmail: user.email,
      action: "BRAND_CREATED",
      resourceType: "BrandAsset",
      resourceId: brand.id,
      metadata: { brandName, officialDomain: cleanDomain },
    });

    return NextResponse.json({ success: true, brand });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create brand asset" }, { status: 500 });
  }
}
