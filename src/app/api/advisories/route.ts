import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const severity = searchParams.get("severity");
  const ecosystem = searchParams.get("ecosystem");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

  const where: Record<string, unknown> = {};

  if (severity) {
    where.severity = severity.toUpperCase();
  }
  if (ecosystem) {
    where.ecosystem = ecosystem.toLowerCase();
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { packageName: { contains: search, mode: "insensitive" } },
    ];
  }

  const [advisories, total] = await Promise.all([
    db.advisory.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.advisory.count({ where }),
  ]);

  return NextResponse.json({
    advisories,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}
