import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { packageJsonSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = packageJsonSchema.parse(body);

    const allDeps = {
      ...parsed.dependencies,
      ...parsed.devDependencies,
    };

    const packageNames = Object.keys(allDeps);

    if (packageNames.length === 0) {
      return NextResponse.json(
        { error: "No dependencies found in the uploaded file." },
        { status: 400 }
      );
    }

    if (packageNames.length > 200) {
      return NextResponse.json(
        { error: "Too many dependencies. Maximum 200 packages allowed." },
        { status: 400 }
      );
    }

    const existing = await db.packageSubscription.findMany({
      where: {
        userId: session.user.id,
        packageName: { in: packageNames },
      },
      select: { packageName: true },
    });

    const existingNames = new Set(existing.map((e) => e.packageName));
    const newPackages = packageNames.filter((name) => !existingNames.has(name));

    if (newPackages.length > 0) {
      await db.packageSubscription.createMany({
        data: newPackages.map((name) => ({
          userId: session.user.id,
          packageName: name,
          version: String(allDeps[name] ?? "").replace(/[\^~>=<]*/g, "") || undefined,
          ecosystem: "npm",
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      imported: newPackages.length,
      skipped: existingNames.size,
      total: packageNames.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid package.json format." },
      { status: 400 }
    );
  }
}
