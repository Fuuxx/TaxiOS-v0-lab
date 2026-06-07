import type { DriverJobStatus } from "./driver-jobs";

export type DriverPoolActionId = "claim_driver_pool_job";

export type DriverPoolAction = {
  disabled?: boolean;
  id: DriverPoolActionId;
  label: string;
  reason?: string;
};

export type DriverPoolRow = {
  allowedActions: DriverPoolAction[];
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

export type DriverPoolPayload = {
  availableRows: DriverPoolRow[];
  availableVisibleCount: number;
};

export type DriverPoolCopy = {
  actionsColumn: string;
  availableCountLabel: string;
  availableDescription: string;
  availableEmptyDescription: string;
  availableEmptyTitle: string;
  availableTitle: string;
  companyColumn: string;
  destinationColumn: string;
  lifecycleColumn: string;
  missingVehicleLabel: string;
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
