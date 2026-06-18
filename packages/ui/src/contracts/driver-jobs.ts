export type DriverJobActionId =
  | "accept_driver_job"
  | "complete_driver_job"
  | "mark_driver_arrived"
  | "mark_driver_enroute"
  | "mark_passenger_picked_up";

export type DriverJobAction = {
  disabled?: boolean;
  id: DriverJobActionId;
  label: string;
  reason?: string;
};

export type DriverJobStatus =
  | "arrived"
  | "cancelled"
  | "completed"
  | "driver_accepted"
  | "enroute"
  | "picked_up"
  | "provider_accepted"
  | "requested";

export type DriverJobRow = {
  allowedActions: DriverJobAction[];
  assignedVehicleDisplayName: string | null;
  assignedVehicleLicensePlate: string | null;
  bookingId: string;
  publicId: string | null;
  companyName: string;
  destinationAddress: string;
  lifecycleStatus: DriverJobStatus;
  passengerSummary: string;
  pickupAddress: string;
  providerName: string;
  requestedPickupAt: string | null;
};

export type DriverJobsPayload = {
  activeRows: DriverJobRow[];
  activeVisibleCount: number;
  historyRows: DriverJobRow[];
  historyVisibleCount: number;
};

export type DriverJobsCopy = {
  actionsColumn: string;
  activeCountLabel: string;
  activeDescription: string;
  activeEmptyDescription: string;
  activeEmptyTitle: string;
  activeTitle: string;
  companyColumn: string;
  destinationColumn: string;
  historyCountLabel: string;
  historyDescription: string;
  historyEmptyDescription: string;
  historyEmptyTitle: string;
  historyTitle: string;
  lifecycleColumn: string;
  missingVehicleLabel: string;
  noActionsLabel: string;
  openPickupTimeLabel: string;
  passengerColumn: string;
  pickupColumn: string;
  pickupTimeColumn: string;
  providerColumn: string;
  statusLabels: Record<DriverJobStatus, string>;
  subtitle: string;
  title: string;
  vehicleColumn: string;
  visibleLabel: string;
};
