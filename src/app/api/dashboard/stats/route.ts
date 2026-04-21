import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [
    totalPackages,
    activeAlerts,
    criticalIssues,
    integrations,
    recentAlerts,
    severityCounts,
  ] = await Promise.all([
    db.packageSubscription.count({ where: { userId } }),
    db.alert.count({ where: { userId, status: "NEW" } }),
    db.alert.count({
      where: { userId, status: "NEW", advisory: { severity: "CRITICAL" } },
    }),
    db.integration.count({ where: { userId, enabled: true } }),
    db.alert.findMany({
      where: { userId },
      include: { advisory: true, packageSubscription: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.alert.groupBy({
      by: ["status"],
      where: { userId, status: "NEW" },
      _count: true,
    }),
  ]);

  // Get alerts per day for the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const alertsByDay = await db.alert.findMany({
    where: { userId, createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true, advisory: { select: { severity: true } } },
  });

  const dailyCounts: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    dailyCounts[date.toISOString().split("T")[0]] = 0;
  }
  for (const alert of alertsByDay) {
    const day = alert.createdAt.toISOString().split("T")[0];
    if (dailyCounts[day] !== undefined) {
      dailyCounts[day]++;
    }
  }

  // Severity breakdown
  const severityBreakdown = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const alert of alertsByDay) {
    const sev = alert.advisory.severity.toLowerCase() as keyof typeof severityBreakdown;
    if (sev in severityBreakdown) {
      severityBreakdown[sev]++;
    }
  }

  return NextResponse.json({
    stats: {
      totalPackages,
      activeAlerts,
      criticalIssues,
      integrationsConnected: integrations,
    },
    alertsPerDay: Object.entries(dailyCounts).map(([date, count]) => ({ date, count })),
    severityBreakdown,
    recentAlerts: recentAlerts.map((a) => ({
      id: a.id,
      packageName: a.advisory.packageName,
      title: a.advisory.title,
      severity: a.advisory.severity.toLowerCase(),
      status: a.status.toLowerCase(),
      detectedAt: a.createdAt,
      sourceUrl: a.advisory.sourceUrl,
    })),
  });
}
