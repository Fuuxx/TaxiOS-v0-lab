export type CompanyReportsActionId = "view_company_reports";

export type CompanyReportsAction = {
  disabled?: boolean;
  id: CompanyReportsActionId;
  label: string;
  reason?: string;
};

export type CompanyReportsTone =
  | "blue"
  | "green"
  | "neutral"
  | "orange"
  | "red";

export type CompanyReportsMetric = {
  description: string;
  label: string;
  tone: CompanyReportsTone;
  value: string;
};

export type CompanyReportsStatusBreakdownId =
  | "active"
  | "cancelled"
  | "completed"
  | "requested";

export type CompanyReportsStatusBreakdown = {
  description: string;
  id: CompanyReportsStatusBreakdownId;
  label: string;
  tone: CompanyReportsTone;
  value: number;
};

export type CompanyReportsRecentRow = {
  bookingId: string;
  passengerSummary: string;
  pickupLabel: string;
  publicId: string | null;
  routeLabel: string;
  statusLabel: string;
  tone: CompanyReportsTone;
};

export type CompanyReportsPayload = {
  allowedActions: CompanyReportsAction[];
  bookingStatusBreakdown: CompanyReportsStatusBreakdown[];
  coverageLabel: string;
  financeMetrics: CompanyReportsMetric[];
  organizationId: string;
  organizationName: string;
  recentRows: CompanyReportsRecentRow[];
  summaryMetrics: CompanyReportsMetric[];
};

export type CompanyReportsCopy = {
  bookingStatusSectionTitle: string;
  emptyDescription: string;
  emptyTitle: string;
  financeSectionTitle: string;
  passengerColumn: string;
  pickupColumn: string;
  recentSectionTitle: string;
  referenceColumn: string;
  routeColumn: string;
  statusColumn: string;
  subtitle: string;
  summarySectionTitle: string;
  title: string;
};
