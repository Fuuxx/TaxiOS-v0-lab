export type DriverAvailableVehicleOption = {
  displayName: string;
  licensePlate: string;
  publicId: string | null;
  vehicleId: string;
};

export type DriverVehicleSessionStatus = "active" | "ended";

export type DriverVehicleSessionPayload = {
  endedAt: number | null;
  id: string;
  startedAt: number;
  status: DriverVehicleSessionStatus;
  vehicleDisplayName: string;
  vehicleId: string;
  vehicleLicensePlate: string;
};

export type DriverVehicleSessionSelectionPayload = {
  activeSession: DriverVehicleSessionPayload | null;
  availableVehicleCount: number;
  availableVehicles: DriverAvailableVehicleOption[];
};

