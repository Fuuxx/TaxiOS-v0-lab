export type ProviderInboxActionId =
  | "accept_global_pool_booking"
  | "assign_driver_vehicle"
  | "complete_booking"
  | "confirm_booking"
  | "move_accepted_booking_to_driver_pool"
  | "reject_booking";

export type ProviderInboxStatus =
  | "cancelled"
  | "completed"
  | "confirmed"
  | "requested";

export type ProviderInboxAction = {
  disabled?: boolean;
  id: ProviderInboxActionId;
  label: string;
  reason?: string;
};

export type ProviderInboxWorkspaceAction = {
  disabled?: boolean;
  id: "create_provider_job";
  label: string;
  reason?: string;
};

export type ProviderInboxRow = {
  allowedActions: ProviderInboxAction[];
  assignedDriverEmail?: string | null;
  assignedDriverName?: string | null;
  assignedVehicleDisplayName?: string | null;
  assignedVehicleLicensePlate?: string | null;
  bookingId: string;
  publicId: string | null;
  companyName: string;
  destinationAddress: string;
  passengerSummary: string;
  pickupAddress: string;
  requestedPickupAt: string | null;
  status: ProviderInboxStatus;
};

export type ProviderDriverOption = {
  displayName: string;
  email: string | null;
  userId: string;
};

export type ProviderVehicleOption = {
  displayName: string;
  licensePlate: string;
  vehicleId: string;
};

export type ProviderJobFormCopy = {
  destinationLabel: string;
  destinationPlaceholder: string;
  errorFallback: string;
  formTitle: string;
  optionalPickupTimeLabel: string;
  passengerLabel: string;
  passengerPlaceholder: string;
  pickupLabel: string;
  pickupPlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  successLabel: string;
};

export type ProviderJobFormData = {
  destinationAddress: string;
  passengerName: string;
  pickupAddress: string;
  requestedPickupAt: string;
};

export type ProviderInboxCopy = {
  acceptedJobsDescription: string;
  acceptedJobsEmptyDescription: string;
  acceptedJobsEmptyTitle: string;
  acceptedJobsTitle: string;
  actionsLabel: string;
  assignedJobsDescription: string;
  assignedJobsEmptyDescription: string;
  assignedJobsEmptyTitle: string;
  assignedJobsTitle: string;
  assignedBookingsDescription: string;
  assignedBookingsTitle: string;
  assignedDriverLabel: string;
  assignedVehicleLabel: string;
  assignDriverEmptyLabel: string;
  assignDriverLabel: string;
  assignVehicleEmptyLabel: string;
  assignVehicleLabel: string;
  availableJobsDescription: string;
  availableJobsEmptyDescription: string;
  availableJobsEmptyTitle: string;
  availableJobsTitle: string;
  closedJobsDescription: string;
  closedJobsEmptyDescription: string;
  closedJobsEmptyTitle: string;
  closedJobsTitle: string;
  companyColumn: string;
  destinationColumn: string;
  emptyDescription: string;
  emptyTitle: string;
  globalPoolDescription: string;
  globalPoolEmptyDescription: string;
  globalPoolEmptyTitle: string;
  globalPoolTitle: string;
  historyDescription: string;
  historyEmptyDescription: string;
  historyEmptyTitle: string;
  historyTitle: string;
  openPickupTimeLabel: string;
  passengerColumn: string;
  pickupColumn: string;
  pickupTimeColumn: string;
  statusColumn: string;
  statusLabels: Record<ProviderInboxStatus, string>;
  subtitle: string;
  title: string;
  visibleLabel: string;
};

export type ProviderInboxActionContext = {
  assignDriverEmptyLabel: string;
  assignDriverLabel: string;
  assignVehicleEmptyLabel: string;
  assignVehicleLabel: string;
  driverOptions: ProviderDriverOption[];
  vehicleOptions: ProviderVehicleOption[];
};
