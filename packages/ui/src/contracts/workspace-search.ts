export type WorkspaceSearchTargetType =
  | "audit"
  | "booking"
  | "booking_vehicle_unit"
  | "driver"
  | "invite"
  | "invoice"
  | "member"
  | "organization"
  | "unit"
  | "vehicle";

export type WorkspaceSearchTone =
  | "blue"
  | "green"
  | "grey"
  | "navy"
  | "orange"
  | "red";

export type WorkspaceSearchResult = {
  href: string | null;
  meta: string[];
  publicId: string | null;
  resultId: string;
  statusKey: string | null;
  statusLabel: string | null;
  subtitle: string;
  targetType: WorkspaceSearchTargetType;
  title: string;
  tone: WorkspaceSearchTone;
  typeLabel: string;
};

export type WorkspaceSearchGroup = {
  label: string;
  results: WorkspaceSearchResult[];
  targetType: WorkspaceSearchTargetType;
  total: number;
};

export type WorkspaceSearchState = "empty" | "error" | "idle" | "loading" | "ready";
