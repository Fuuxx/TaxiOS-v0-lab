export type LoadState<T> =
  | { status: "empty"; message?: string }
  | { status: "error"; message: string }
  | { status: "loading" }
  | { data: T; status: "ready" };

export type CompanyBookingActionId = "cancel_booking";

export type AllowedAction<ActionId extends string = string> = {
  disabled?: boolean;
  id: ActionId;
  label: string;
  reason?: string;
};

export type CompanyBookingAction = AllowedAction<CompanyBookingActionId>;

export type CompanyDashboardFastbookingMember = {
  id: string;
  name: string;
};

export type CompanyDashboardFastRoute = {
  avatars: string[];
  from: string;
  memberIds: string[];
  title: string;
  to: string;
};

export type CompanyDashboardFastRouteMemberChange = {
  from: string;
  memberIds: string[];
  to: string;
};

export type CompanyDashboardFastRouteMemberChangeHandler = (
  change: CompanyDashboardFastRouteMemberChange,
) => Promise<void> | void;

export type CompanyDashboardFastRouteBookingStart = {
  from: string;
  memberIds: string[];
  title: string;
  to: string;
};

export type CompanyDashboardFastRouteBookingStartHandler = (
  draft: CompanyDashboardFastRouteBookingStart,
) => Promise<void> | void;

export type DashboardStatIconKey =
  | "arrowUpRight"
  | "calendar"
  | "clock"
  | "wallet";

export type DashboardStatTrend = "down" | "flat" | "up";

export type CompanyDashboardMetricPayload = {
  delta?: string;
  iconKey: DashboardStatIconKey;
  label: string;
  sub: string;
  trend?: DashboardStatTrend;
  value: string;
};

export type BookingStatusColor =
  | "blue"
  | "green"
  | "grey"
  | "orange"
  | "red"
  | "violet";

export type BookingTaxiStatus =
  | "arrived"
  | "assigned"
  | "completed"
  | "inRide"
  | "issue"
  | "onWay"
  | "ordered";

export type BookingTaxiStatusPayload = {
  isPulsing?: boolean;
  status: BookingTaxiStatus;
};

export type BookingRow = {
  allowedActions?: CompanyBookingAction[];
  from: string;
  id: string;
  isPulsing?: boolean;
  passengers: string[];
  publicId: string | null;
  status: string;
  statusColor: BookingStatusColor;
  taxiStatuses?: BookingTaxiStatusPayload[];
  time: string;
  to: string;
};

export type BookingHistoryRow = Omit<BookingRow, "isPulsing" | "taxiStatuses">;

export type CompanyBookingFormData = {
  destinationAddress: string;
  passengerName: string;
  pickupAddress: string;
  requestedPickupAt: string;
};

export type CompanyBookingFormCopy = {
  destinationLabel: string;
  destinationPlaceholder: string;
  errorFallback: string;
  eyebrow: string;
  optionalPickupTimeLabel: string;
  passengerLabel: string;
  passengerPlaceholder: string;
  pickupLabel: string;
  pickupPlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  successLabel: string;
  subtitle: string;
  title: string;
};

export type CompanyBookingActionCopy = {
  errorFallback: string;
  labelByActionId: Record<CompanyBookingActionId, string>;
  workingLabelByActionId: Record<CompanyBookingActionId, string>;
};

export type ProviderFeedTone = "brand" | "neutral" | "ok";
export type ProviderFeedIcon = "approval" | "booking" | "vehicle";

export type ProviderFeedItem = {
  icon: ProviderFeedIcon;
  sub: string;
  time: string;
  title: string;
  tone: ProviderFeedTone;
};

export type CompanyDashboardTaxiStatusCopy = Record<BookingTaxiStatus, string>;

export type CompanyDashboardCopy = {
  sidebar: {
    accountInitials: string;
    accountName: string;
    accountType: string;
    billing: string;
    dashboard: string;
    locations: string;
    mainSection: string;
    members: string;
    newBooking: string;
    organizationSection: string;
    reports: string;
    rides: string;
    settings: string;
  };
  topbar: {
    company: string;
    dashboard: string;
    notificationsLabel: string;
    searchPlaceholder: string;
  };
  hero: {
    datePrefix: string;
    greetingName: string;
    greetingPrefix: string;
    overview: string;
    ridesTodaySuffix: string;
    systemStatus: string;
  };
  fastbooking: {
    activeSuffix: string;
    addMemberLabel: string;
    bookLabel: string;
    cardEyebrow: string;
    closeMemberPickerLabel: string;
    deselectAvatarLabel: string;
    emptyDescription: string;
    emptyTitle: string;
    destinationLabel: string;
    destinationPlaceholder: string;
    eyebrow: string;
    fromLabel: string;
    membersLabel: string;
    newRouteAriaLabel: string;
    newRouteHeading: string;
    noMembersFound: string;
    openMemberPickerLabel: string;
    pickupLabel: string;
    pickupPlaceholder: string;
    removeMemberLabel: string;
    routeTitleLabel: string;
    routeTitlePlaceholder: string;
    saveLabel: string;
    searchMembersLabel: string;
    searchPlaceholder: string;
    selectAvatarLabel: string;
    title: string;
    toLabel: string;
  };
  rides: {
    activeEmptyDescription: string;
    activeEmptyTitle: string;
    closeDetailLabel: string;
    costCenterLabel: string;
    dateLabel: string;
    detailBackdropLabel: string;
    detailCloseButtonLabel: string;
    dispatcherLabel: string;
    fareLabel: string;
    noteAction: string;
    passengersLabel: string;
    pickupLabel: string;
    routeLabel: string;
    statusLabel: string;
    statusLabels: CompanyDashboardTaxiStatusCopy;
    tableId: string;
    tablePassengers: string;
    tableRoute: string;
    tableStatus: string;
    tableTime: string;
    taxiStatusPrefix: string;
    taxiStatusTitle: string;
    todayLabel: string;
    title: string;
    tripBookedByLabel: string;
    unknownStatus: string;
    viewAll: string;
    destinationLabel: string;
    historyEmptyDescription: string;
    historyEmptyTitle: string;
    historyTitle: string;
    timeLabel: string;
    vehicleStatusTitle: string;
    cancelAction: string;
    employeePrefix: string;
  };
  liveFeed: {
    ariaLabel: string;
    eventsLabel: string;
    liveBadge: string;
    title: string;
    updatedNow: string;
  };
  dayStatus: {
    actionLabel: string;
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
  };
};

export type CompanyDashboardPayload = {
  allowedActions?: AllowedAction[];
  availableMembers: CompanyDashboardFastbookingMember[];
  fastRoutes: CompanyDashboardFastRoute[];
  feedItems: ProviderFeedItem[];
  recentBookingHistory?: BookingHistoryRow[];
  recentBookingHistorySummary?: {
    label: string;
    visibleCount: number;
  };
  stats: CompanyDashboardMetricPayload[];
  upcomingTrips: BookingRow[];
};

export type CompanyDashboardData = CompanyDashboardPayload;
export type DashboardTrip = BookingRow;
