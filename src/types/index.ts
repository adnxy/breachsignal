export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type SignalType =
  | "VULNERABILITY"
  | "MALWARE"
  | "COMPROMISE"
  | "DEPRECATION"
  | "LICENSE_CHANGE"
  | "MAINTAINER_CHANGE"
  | "REGISTRY_REMOVAL"
  | "SUSPICIOUS_RELEASE";

export type IntegrationType = "slack" | "pagerduty" | "telegram" | "email";

export type PlanTier = "free" | "individual" | "team";

export interface Advisory {
  id: string;
  externalId: string;
  packageName: string;
  ecosystem: string;
  title: string;
  summary: string;
  severity: Severity;
  affectedVersions: string;
  patchedVersions: string | null;
  publishedAt: Date;
  sourceUrl: string;
  cvssScore: number | null;
  cveId: string | null;
  createdAt: Date;
}

export interface Signal {
  id: string;
  type: SignalType;
  title: string;
  description: string;
  severity: Severity;
  packageName: string;
  ecosystem: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface TrackedPackage {
  id: string;
  packageName: string;
  currentVersion: string | null;
  latestSafeVersion: string | null;
  ecosystem: string;
  status: "safe" | "vulnerable" | "unknown";
  lastAlertAt: Date | null;
  muted: boolean;
}

export interface AlertItem {
  id: string;
  packageName: string;
  title: string;
  severity: Severity;
  status: "new" | "acknowledged" | "resolved" | "ignored";
  detectedAt: Date;
  sourceUrl: string;
  summary: string;
  affectedVersions: string;
  patchedVersions: string | null;
}

export interface IntegrationConfig {
  id: string;
  type: IntegrationType;
  enabled: boolean;
  config: Record<string, string>;
}

export interface FeedEvent {
  id: string;
  type: SignalType;
  title: string;
  severity: Severity;
  packageName: string;
  ecosystem: string;
  timestamp: Date;
  description: string;
}

export interface DashboardStats {
  totalPackages: number;
  activeAlerts: number;
  criticalIssues: number;
  integrationsConnected: number;
}

export interface GitHubRepo {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string;
  language: string | null;
  private: boolean;
  vulnerabilities: number;
  lastScanAt: Date | null;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  color: string;
  packagesCount: number;
  alertsCount: number;
  criticalCount: number;
}

export interface PricingPlan {
  name: string;
  tier: PlanTier;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}
