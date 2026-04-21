import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const passwordHash = await bcrypt.hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@breachsignal.io" },
    update: {},
    create: {
      name: "Jane Smith",
      email: "demo@breachsignal.io",
      passwordHash,
      plan: "INDIVIDUAL",
    },
  });

  console.log(`Created user: ${user.email}`);

  // Create package subscriptions
  const packages = [
    { packageName: "react", version: "18.2.0" },
    { packageName: "next", version: "14.1.0" },
    { packageName: "lodash", version: "4.17.19" },
    { packageName: "axios", version: "1.6.2" },
    { packageName: "express", version: "4.18.2" },
    { packageName: "prisma", version: "5.8.0" },
    { packageName: "zod", version: "3.22.4" },
    { packageName: "typescript", version: "5.3.3" },
    { packageName: "sequelize", version: "6.35.0" },
    { packageName: "jsonwebtoken", version: "9.0.0" },
    { packageName: "bcryptjs", version: "2.4.3" },
    { packageName: "dotenv", version: "16.3.1" },
  ];

  for (const pkg of packages) {
    await prisma.packageSubscription.upsert({
      where: {
        userId_packageName_ecosystem: {
          userId: user.id,
          packageName: pkg.packageName,
          ecosystem: "npm",
        },
      },
      update: {},
      create: {
        userId: user.id,
        packageName: pkg.packageName,
        version: pkg.version,
        ecosystem: "npm",
      },
    });
  }

  console.log(`Created ${packages.length} package subscriptions`);

  // Create advisories
  const advisories = [
    {
      externalId: "GHSA-jf85-cpcp-j695-lodash",
      packageName: "lodash",
      title: "Prototype Pollution in lodash",
      summary: "Versions of lodash prior to 4.17.21 are vulnerable to Regular Expression Denial of Service (ReDoS) via the toNumber, trim and trimEnd functions. Prototype pollution vulnerability affecting lodash template function.",
      severity: "CRITICAL" as const,
      affectedVersions: "< 4.17.21",
      patchedVersions: "4.17.21",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      sourceUrl: "https://github.com/advisories/GHSA-jf85-cpcp-j695",
      cvssScore: 9.8,
      cveId: "CVE-2021-23337",
    },
    {
      externalId: "GHSA-wf5p-g6vw-rhxx-axios",
      packageName: "axios",
      title: "Server-Side Request Forgery in axios",
      summary: "Axios before 1.6.3 is vulnerable to a Server-Side Request Forgery (SSRF) attack when using a proxy. An attacker can make any request through the proxy by providing a specially crafted URL.",
      severity: "HIGH" as const,
      affectedVersions: "< 1.6.3",
      patchedVersions: "1.6.3",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      sourceUrl: "https://github.com/advisories/GHSA-wf5p-g6vw-rhxx",
      cvssScore: 7.5,
      cveId: "CVE-2023-45857",
    },
    {
      externalId: "GHSA-gp8f-8m3g-qvj9-next",
      packageName: "next",
      title: "Authorization bypass in Next.js middleware",
      summary: "Next.js before 14.1.4 is vulnerable to an authorization bypass. An attacker can bypass middleware-based authentication and authorization by adding specific headers to requests.",
      severity: "HIGH" as const,
      affectedVersions: ">= 12.0.0, < 14.1.4",
      patchedVersions: "14.1.4",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      sourceUrl: "https://github.com/advisories/GHSA-gp8f-8m3g-qvj9",
      cvssScore: 8.1,
      cveId: "CVE-2024-34350",
    },
    {
      externalId: "GHSA-rv95-896h-c2vc-express",
      packageName: "express",
      title: "Open Redirect vulnerability in express",
      summary: "Express.js before 4.18.2 is vulnerable to an open redirect attack via the res.redirect() method when user input is passed directly.",
      severity: "MEDIUM" as const,
      affectedVersions: "< 4.18.2",
      patchedVersions: "4.18.2",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      sourceUrl: "https://github.com/advisories/GHSA-rv95-896h-c2vc",
      cvssScore: 5.4,
      cveId: "CVE-2024-29041",
    },
    {
      externalId: "GHSA-wrh2-8pf6-pcrq-sequelize",
      packageName: "sequelize",
      title: "SQL Injection in sequelize",
      summary: "Sequelize ORM is vulnerable to SQL injection when using replacements in raw queries. This affects applications that pass user input directly to raw query replacements.",
      severity: "HIGH" as const,
      affectedVersions: "< 6.35.2",
      patchedVersions: "6.35.2",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      sourceUrl: "https://github.com/advisories/GHSA-wrh2-8pf6-pcrq",
      cvssScore: 8.6,
      cveId: "CVE-2023-25813",
    },
    {
      externalId: "GHSA-36fh-84j7-cv5h-jsonwebtoken",
      packageName: "jsonwebtoken",
      title: "Unrestricted key type in jsonwebtoken",
      summary: "Versions of jsonwebtoken prior to 9.0.0 allow an attacker to forge tokens by providing a malicious key to the verify function.",
      severity: "HIGH" as const,
      affectedVersions: "< 9.0.0",
      patchedVersions: "9.0.0",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
      sourceUrl: "https://github.com/advisories/GHSA-36fh-84j7-cv5h",
      cvssScore: 7.6,
      cveId: "CVE-2022-23529",
    },
  ];

  for (const adv of advisories) {
    await prisma.advisory.upsert({
      where: { externalId: adv.externalId },
      update: {},
      create: adv,
    });
  }

  console.log(`Created ${advisories.length} advisories`);

  // Create alerts for matching packages
  const allAdvisories = await prisma.advisory.findMany();
  const allSubs = await prisma.packageSubscription.findMany({
    where: { userId: user.id },
  });

  let alertCount = 0;
  for (const advisory of allAdvisories) {
    const matchingSub = allSubs.find(
      (s) => s.packageName === advisory.packageName
    );
    if (!matchingSub) continue;

    await prisma.alert.upsert({
      where: {
        id: `seed-${advisory.id}`,
      },
      update: {},
      create: {
        id: `seed-${advisory.id}`,
        userId: user.id,
        advisoryId: advisory.id,
        packageSubscriptionId: matchingSub.id,
        status: alertCount < 3 ? "NEW" : alertCount < 5 ? "ACKNOWLEDGED" : "RESOLVED",
        sentEmail: true,
        sentSlack: alertCount < 4,
      },
    });
    alertCount++;
  }

  console.log(`Created ${alertCount} alerts`);

  // Create integrations
  await prisma.integration.upsert({
    where: { userId_type: { userId: user.id, type: "SLACK" } },
    update: {},
    create: {
      userId: user.id,
      type: "SLACK",
      config: { webhookUrl: "https://hooks.slack.com/services/example" },
      enabled: true,
    },
  });

  await prisma.integration.upsert({
    where: { userId_type: { userId: user.id, type: "EMAIL" } },
    update: {},
    create: {
      userId: user.id,
      type: "EMAIL",
      config: { email: "demo@breachsignal.io" },
      enabled: true,
    },
  });

  await prisma.integration.upsert({
    where: { userId_type: { userId: user.id, type: "TELEGRAM" } },
    update: {},
    create: {
      userId: user.id,
      type: "TELEGRAM",
      config: { botToken: "example", chatId: "-1001234567890" },
      enabled: true,
    },
  });

  console.log("Created integrations");
  console.log("\nSeed complete!");
  console.log("Demo login: demo@breachsignal.io / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
