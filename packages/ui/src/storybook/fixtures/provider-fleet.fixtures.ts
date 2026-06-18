import type {
  ProviderFleetCopy,
  ProviderFleetPayload,
  ProviderVehicleFormCopy,
} from "../../contracts/provider-fleet";

export const demoProviderFleetCopy: ProviderFleetCopy = {
  activeCountLabel: "Active vehicles",
  emptyDescription:
    "Registered active provider vehicles will appear here after they are added.",
  emptyTitle: "No active vehicles",
  formSlotLabel: "Register provider vehicle",
  activeDriverColumn: "Active driver",
  licensePlateColumn: "License plate",
  operationalStatusLabels: {
    available: "Available",
    inactive: "Inactive",
    occupied: "Occupied",
  },
  sessionActionsColumn: "Session",
  statusColumn: "Status",
  statusLabels: {
    active: "Active",
    inactive: "Inactive",
  },
  subtitle:
    "Manage the active provider vehicle list used by backend-owned assignment actions.",
  title: "Provider fleet",
  vehicleColumn: "Vehicle",
};

export const demoProviderVehicleFormCopy: ProviderVehicleFormCopy = {
  alreadyExistsLabel: "Vehicle already exists.",
  displayNameLabel: "Vehicle name",
  displayNamePlaceholder: "TX 100",
  errorFallback: "Provider vehicle could not be registered. Please try again.",
  formTitle: "Register active vehicle",
  licensePlateLabel: "License plate",
  licensePlatePlaceholder: "B TX 100",
  submitLabel: "Register vehicle",
  submittingLabel: "Registering...",
  successLabel: "Provider vehicle registered.",
  unavailableLabel: "Provider vehicle registration is not available.",
};

export const demoProviderFleetPayload: ProviderFleetPayload = {
  activeVehicleCount: 2,
  allowedActions: [
    {
      id: "register_provider_vehicle",
      label: "Register vehicle",
    },
  ],
  vehicles: [
    {
      activeDriverName: null,
      activeSessionId: null,
      activeSessionStartedAt: null,
      allowedActions: [],
      displayName: "TX 100",
      licensePlate: "B TX 100",
      operationalStatus: "available",
      publicId: "VEH-K8Q4TC",
      status: "active",
      vehicleId: "vehicle_100",
    },
    {
      activeDriverName: "Dana Driver",
      activeSessionId: "session_200",
      activeSessionStartedAt: 1_800_000_000_000,
      allowedActions: [
        {
          id: "end_driver_vehicle_session",
          label: "End shift",
        },
      ],
      displayName: "TX 200",
      licensePlate: "B TX 200",
      operationalStatus: "occupied",
      publicId: "VEH-W6P2NA",
      status: "active",
      vehicleId: "vehicle_200",
    },
  ],
};

export const demoProviderFleetEmptyPayload: ProviderFleetPayload = {
  activeVehicleCount: 0,
  allowedActions: demoProviderFleetPayload.allowedActions,
  vehicles: [],
};

export const demoProviderFleetDisabledPayload: ProviderFleetPayload = {
  ...demoProviderFleetPayload,
  allowedActions: [
    {
      disabled: true,
      id: "register_provider_vehicle",
      label: "Register vehicle",
      reason: "Only provider operators can register vehicles.",
    },
  ],
};
