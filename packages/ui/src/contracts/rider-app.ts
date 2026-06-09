/* =====================================================================
 * TaxiOS Rider App — Contracts
 *
 * Pure type definitions for the passenger-facing Rider App. These mirror
 * the shape of data returned by backend tRPC "view" endpoints. UI renders
 * this data only — it never derives business logic, status, or available
 * actions on its own.
 *
 * Product framing: the Rider App is for passengers. Company context is
 * lightweight (workspace chip, "Abgerechnet über …" label). No role,
 * organization, finance, provider, or admin surfaces live here.
 *
 * HARD RULE: every actionable button on every screen is rendered from a
 * backend-provided `allowedActions` array. The UI never infers an action
 * from a status value.
 * ===================================================================== */

/* ---------------------------------------------------------------------
 * Shared building blocks
 * ------------------------------------------------------------------- */

/** Every backend-allowed action the Rider App can surface. */
export type RiderActionId =
  | "book_ride"
  | "book_another_ride"
  | "schedule_ride"
  | "request_ride"
  | "continue_to_riders"
  | "view_trip"
  | "view_booking"
  | "track_ride"
  | "remove_self_from_ride"
  | "cancel_ride"
  | "call_driver"
  | "message_driver"
  | "share_trip"
  | "contact_support"
  | "open_privacy"
  | "open_notifications_settings"
  | "switch_workspace"
  | "sign_out";

/**
 * Backend-owned action descriptor. The UI renders exactly what it receives:
 * `disabled` + `reason` produce a locked control with an accessible hint,
 * `href` turns the control into a link. The UI must not synthesize actions.
 */
export type RiderAction = {
  id: RiderActionId;
  label: string;
  disabled?: boolean;
  href?: string | null;
  reason?: string;
};

/** Lifecycle status of a ride from the passenger's point of view. */
export type RiderRideStatus =
  | "requested"
  | "confirmed"
  | "driver_assigned"
  | "enroute"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled";

/** Whether a ride is a private (personal) ride or a company ride. */
export type RiderRideKind = "personal" | "company";

/** A single passenger on a ride; `isCurrentRider` flags the signed-in user. */
export type RiderPassenger = {
  id: string;
  name: string;
  initials: string;
  isCurrentRider?: boolean;
};

/** Lightweight company context shown to passengers (no admin surfaces). */
export type RiderWorkspaceContext = {
  workspaceLabel: string;
  billedToLabel: string;
};

/* ---------------------------------------------------------------------
 * Trip summary + detail
 * ------------------------------------------------------------------- */

/** Compact ride representation used in cards and lists. */
export type RiderTripSummary = {
  tripId: string;
  publicId: string;
  kind: RiderRideKind;
  status: RiderRideStatus;
  statusLabel: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupDateLabel: string;
  pickupTimeLabel: string;
  workspaceLabel: string | null;
  vehicleClassLabel: string;
  passengerCountLabel: string;
};

export type RiderTripHistoryEntry = {
  id: string;
  label: string;
  timestampLabel: string;
};

/** Full passenger-facing ride detail. */
export type RiderTripDetail = {
  tripId: string;
  publicId: string;
  kind: RiderRideKind;
  status: RiderRideStatus;
  statusLabel: string;
  pickupAddress: string;
  destinationAddress: string;
  viaAddress: string | null;
  pickupDateLabel: string;
  pickupTimeLabel: string;
  vehicleClassLabel: string;
  passengers: RiderPassenger[];
  isShared: boolean;
  workspace: RiderWorkspaceContext | null;
  bookedByLabel: string;
  noteLabel: string | null;
  history: RiderTripHistoryEntry[];
  allowedActions: RiderAction[];
};

/* ---------------------------------------------------------------------
 * Live tracking
 * ------------------------------------------------------------------- */

export type RiderDriver = {
  name: string;
  initials: string;
  ratingLabel: string;
  tripsLabel: string;
  vehicleLabel: string;
  licensePlate: string;
  vehicleColorLabel: string;
};

export type RiderTrackingStep = {
  id: string;
  label: string;
  state: "done" | "active" | "upcoming";
  timeLabel: string | null;
};

export type RiderTrackingPayload = {
  tripId: string;
  publicId: string;
  status: RiderRideStatus;
  statusLabel: string;
  etaMinutes: number;
  etaLabel: string;
  driver: RiderDriver;
  pickupAddress: string;
  destinationAddress: string;
  steps: RiderTrackingStep[];
  safetyHint: string;
  allowedActions: RiderAction[];
};

/* ---------------------------------------------------------------------
 * Home + Trips collections
 * ------------------------------------------------------------------- */

export type RiderQuickAction = {
  id: "track_ride" | "trips" | "support";
  label: string;
  description: string;
};

export type RiderHomePayload = {
  greetingLabel: string;
  workspace: RiderWorkspaceContext;
  nextTrip: RiderTripSummary | null;
  quickActions: RiderQuickAction[];
  upcomingTrips: RiderTripSummary[];
  allowedActions: RiderAction[];
};

export type RiderTripsTab = "upcoming" | "past" | "cancelled";

export type RiderTripsPayload = {
  nextTrip: RiderTripSummary | null;
  upcomingTrips: RiderTripSummary[];
  pastTrips: RiderTripSummary[];
  cancelledTrips: RiderTripSummary[];
};

/* ---------------------------------------------------------------------
 * Booking flow (Book ride / Schedule / Riders / Confirmation)
 * ------------------------------------------------------------------- */

export type RiderBookingMode = "now" | "schedule";
export type RiderBookingRequestStyle = "standard" | "quick";

export type RiderVehicleOption = {
  id: string;
  label: string;
  description: string;
  capacityLabel: string;
  disabled?: boolean;
  reason?: string;
};

export type RiderBookingPayload = {
  mode: RiderBookingMode;
  workspace: RiderWorkspaceContext;
  vehicleOptions: RiderVehicleOption[];
  riderSummaryLabel: string;
  allowedActions: RiderAction[];
};

export type RiderGuest = {
  id: string;
  name: string;
  phoneLabel: string | null;
};

export type RiderRidersPayload = {
  currentRider: RiderPassenger;
  guests: RiderGuest[];
  companyBookingHint: string;
  companyBookingAllowed: boolean;
  allowedActions: RiderAction[];
};

export type RiderConfirmationDetailRow = {
  id: string;
  label: string;
  value: string;
};

export type RiderConfirmationPayload = {
  publicId: string;
  pickupAddress: string;
  destinationAddress: string;
  detailRows: RiderConfirmationDetailRow[];
  allowedActions: RiderAction[];
};

/* ---------------------------------------------------------------------
 * Inbox (driver chat + notifications)
 * ------------------------------------------------------------------- */

export type RiderChatMessage = {
  id: string;
  authorLabel: string;
  body: string;
  timeLabel: string;
  fromRider: boolean;
};

export type RiderLiveChat = {
  tripId: string;
  driver: RiderDriver;
  isLive: boolean;
  routeLabel: string;
  messages: RiderChatMessage[];
  inputPlaceholder: string;
  allowedActions: RiderAction[];
};

export type RiderNotificationTone =
  | "info"
  | "success"
  | "attention"
  | "neutral";

export type RiderNotification = {
  id: string;
  title: string;
  body: string;
  timeLabel: string;
  tone: RiderNotificationTone;
  unread: boolean;
};

export type RiderInboxPayload = {
  liveChat: RiderLiveChat | null;
  notifications: RiderNotification[];
};

/* ---------------------------------------------------------------------
 * Account
 * ------------------------------------------------------------------- */

export type RiderAccountTab = "personal" | "company";

export type RiderAccountField = {
  id: string;
  label: string;
  value: string;
};

export type RiderAccountLink = {
  id: "open_notifications_settings" | "contact_support" | "open_privacy";
  label: string;
  description: string;
};

export type RiderAccountPayload = {
  profileName: string;
  profileInitials: string;
  profileRoleLabel: string;
  personalFields: RiderAccountField[];
  companyMemberLabel: string;
  companyWorkspaceLabel: string;
  companyFields: RiderAccountField[];
  links: RiderAccountLink[];
  currentWorkspaceLabel: string;
  allowedActions: RiderAction[];
};

/* ---------------------------------------------------------------------
 * Copy (German UI strings, screen-scoped)
 * ------------------------------------------------------------------- */

export type RiderAppCopy = {
  /** Bottom tab bar labels. */
  tabHome: string;
  tabTrips: string;
  tabInbox: string;
  tabAccount: string;
  /** Generic states reused across screens. */
  loadingLabel: string;
  errorTitle: string;
  errorDescription: string;
  retryLabel: string;
  companyRideLabel: string;
  personalRideLabel: string;
  billedToPrefix: string;
};
