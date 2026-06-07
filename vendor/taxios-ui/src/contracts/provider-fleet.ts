export type ProviderFleetActionId = "register_provider_vehicle";
export type ProviderFleetVehicleActionId = "end_driver_vehicle_session";

export type ProviderFleetAction = {
  disabled?: boolean;
  id: ProviderFleetActionId;
  label: string;
  reason?: string;
};

export type ProviderFleetVehicleAction = {
  disabled?: boolean;
  id: ProviderFleetVehicleActionId;
  label: string;
  reason?: string;
};

export type ProviderFleetVehicleStatus = "active" | "inactive";
export type ProviderFleetVehicleOperationalStatus =
  | "available"
  | "inactive"
  | "occupied";

export type ProviderFleetVehicleRow = {
  activeDriverName: string | null;
  activeSessionId: string | null;
  activeSessionStartedAt: number | null;
  allowedActions: ProviderFleetVehicleAction[];
  displayName: string;
  licensePlate: string;
  operationalStatus: ProviderFleetVehicleOperationalStatus;
  publicId: string | null;
  status: ProviderFleetVehicleStatus;
  vehicleId: string;
};

export type ProviderFleetPayload = {
  activeVehicleCount: number;
  allowedActions: ProviderFleetAction[];
  vehicles: ProviderFleetVehicleRow[];
};

export type ProviderFleetCopy = {
  activeCountLabel: string;
  emptyDescription: string;
  emptyTitle: string;
  formSlotLabel: string;
  licensePlateColumn: string;
  activeDriverColumn: string;
  sessionActionsColumn: string;
  operationalStatusLabels: Record<ProviderFleetVehicleOperationalStatus, string>;
  statusColumn: string;
  statusLabels: Record<ProviderFleetVehicleStatus, string>;
  subtitle: string;
  title: string;
  vehicleColumn: string;
};

export type ProviderVehicleFormData = {
  displayName: string;
  licensePlate: string;
};

export type ProviderVehicleFormCopy = {
  alreadyExistsLabel: string;
  displayNameLabel: string;
  displayNamePlaceholder: string;
  errorFallback: string;
  formTitle: string;
  licensePlateLabel: string;
  licensePlatePlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  successLabel: string;
  unavailableLabel: string;
};
