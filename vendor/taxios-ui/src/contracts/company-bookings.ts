export type CompanyBookingStatus =
  | "cancelled"
  | "completed"
  | "confirmed"
  | "requested";

export type CompanyBookingLifecycleStatus =
  | "arrived"
  | "cancelled"
  | "completed"
  | "driver_accepted"
  | "enroute"
  | "picked_up"
  | "provider_accepted"
  | "requested";

export type CompanyBookingStatusColor =
  | "blue"
  | "green"
  | "grey"
  | "navy"
  | "orange"
  | "red";

export type CompanyBookingStatusIndicatorStatus =
  | "arrived"
  | "booked"
  | "cancelled"
  | "completed"
  | "enroute"
  | "underway";

export type CompanyBookingStatusIndicator = {
  color: CompanyBookingStatusColor;
  id: string;
  isPulsing?: boolean;
  label: string;
  status: CompanyBookingStatusIndicatorStatus;
};

export type CompanyBookingHistoryItem = {
  actorName: string | null;
  dateLabel: string;
  id: string;
  label: string;
  timeLabel: string;
  tone: CompanyBookingStatusColor;
};

export type CompanyBookingVehicleUnit = {
  driverName: string | null;
  driverVehicleVisible: boolean;
  label: string;
  ordinal: number;
  passengers: string[];
  publicId: string | null;
  statusColor: CompanyBookingStatusColor;
  statusIndicators: CompanyBookingStatusIndicator[];
  statusLabel: string;
  unitId: string;
  vehicleDisplayName: string | null;
  vehicleLicensePlate: string | null;
};

export type CompanyBookingAllowedAction = {
  disabled?: boolean;
  id: "cancel_booking";
  label: string;
  reason?: string;
};

export type CompanyBookingRow = {
  allowedActions: CompanyBookingAllowedAction[];
  bookingId: string;
  publicId: string | null;
  bookedByEmail: string | null;
  bookedByName: string;
  createdDateLabel: string;
  createdTimeLabel: string;
  driverName: string | null;
  driverVehicleVisible: boolean;
  from: string;
  history: CompanyBookingHistoryItem[];
  lifecycleStatus: CompanyBookingLifecycleStatus;
  note: string | null;
  passengers: string[];
  pickupDateLabel: string;
  pickupTimeLabel: string;
  status: CompanyBookingStatus;
  statusColor: CompanyBookingStatusColor;
  statusIndicators: CompanyBookingStatusIndicator[];
  statusLabel: string;
  to: string;
  vehicleDisplayName: string | null;
  vehicleLicensePlate: string | null;
  vehicleUnits: CompanyBookingVehicleUnit[];
};

export type CompanyBookingsPage = {
  continueCursor: string;
  isDone: boolean;
  page: CompanyBookingRow[];
};

export type CompanyBookingsCopy = {
  allLoadedLabel: string;
  detailBackdropLabel: string;
  detailBookedAtLabel: string;
  detailBookedByLabel: string;
  detailBookingIdLabel: string;
  detailCloseButtonLabel: string;
  detailCancelErrorFallback: string;
  detailCancelLabel: string;
  detailCancelWorkingLabel: string;
  detailDriverLabel: string;
  detailDriverPendingLabel: string;
  detailDriverVehicleLabel: string;
  detailHistoryEmptyLabel: string;
  detailHistoryLabel: string;
  detailNoteEmptyLabel: string;
  detailNoteLabel: string;
  detailOpenRowLabel: string;
  detailPassengersLabel: string;
  detailPickupAtLabel: string;
  detailRouteLabel: string;
  detailVehicleLabel: string;
  emptyDescription: string;
  emptyTitle: string;
  fromLabel: string;
  loadMoreLabel: string;
  loadingMoreLabel: string;
  subtitle: string;
  tableCreated: string;
  tableId: string;
  tablePassengers: string;
  tablePickup: string;
  tableRoute: string;
  tableStatus: string;
  title: string;
  toLabel: string;
  visibleLabel: string;
};
