import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { integrationSchema } from "@/lib/validations";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const integrations = await db.integration.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json(integrations);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = integrationSchema.parse(body);

    const { type, ...configFields } = data;

    const integration = await db.integration.upsert({
      where: {
        userId_type: {
          userId: session.user.id,
          type: type.toUpperCase() as "SLACK" | "PAGERDUTY" | "TELEGRAM" | "EMAIL",
        },
      },
      update: {
        config: configFields,
        enabled: true,
      },
      create: {
        userId: session.user.id,
        type: type.toUpperCase() as "SLACK" | "PAGERDUTY" | "TELEGRAM" | "EMAIL",
        config: configFields,
        enabled: true,
      },
    });

    return NextResponse.json(integration);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
