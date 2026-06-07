import type {
  DriverPoolCopy,
  DriverPoolPayload,
} from "../../contracts/driver-pool";

export const demoDriverPoolCopy: DriverPoolCopy = {
  actionsColumn: "Actions",
  availableCountLabel: "Available jobs",
  availableDescription:
    "Provider jobs released into the internal Driver Pool and ready to claim.",
  availableEmptyDescription:
    "Jobs moved by dispatch into the Driver Pool will appear here.",
  availableEmptyTitle: "No Driver Pool jobs",
  availableTitle: "Driver Pool",
  companyColumn: "Company",
  destinationColumn: "Destination",
  lifecycleColumn: "Lifecycle",
  missingVehicleLabel: "Vehicle assigned after claim",
  openPickupTimeLabel: "Open",
  passengerColumn: "Passenger",
  pickupColumn: "Pickup",
  pickupTimeColumn: "Pickup time",
  providerColumn: "Provider",
  statusLabels: {
    arrived: "Arrived",
    cancelled: "Cancelled",
    completed: "Completed",
    driver_accepted: "Driver accepted",
    enroute: "Enroute",
    picked_up: "Picked up",
    provider_accepted: "Provider accepted",
    requested: "Requested",
  },
  subtitle:
    "Claim available provider jobs first; execution starts from My Jobs after dispatch vehicle assignment.",
  title: "Driver Pool",
  vehicleColumn: "Vehicle",
  visibleLabel: "visible",
};

export const demoDriverPoolPayload: DriverPoolPayload = {
  availableRows: [
    {
      allowedActions: [
        {
          id: "claim_driver_pool_job",
          label: "Claim job",
        },
      ],
      assignedVehicleDisplayName: null,
      assignedVehicleLicensePlate: null,
      bookingId: "booking_driver_pool_available",
      publicId: "BKG-P0OL1",
      companyName: "Hoffmann Mobility GmbH",
      destinationAddress: "BER Airport",
      lifecycleStatus: "provider_accepted",
      passengerSummary: "Mina Rider",
      pickupAddress: "HQ Berlin",
      providerName: "City Funk Berlin",
      requestedPickupAt: "09:00",
    },
  ],
  availableVisibleCount: 1,
};

export const demoDriverPoolEmptyPayload: DriverPoolPayload = {
  availableRows: [],
  availableVisibleCount: 0,
};
