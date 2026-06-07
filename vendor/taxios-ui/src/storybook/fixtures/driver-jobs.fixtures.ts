import type {
  DriverJobsCopy,
  DriverJobsPayload,
} from "../../contracts/driver-jobs";

export const demoDriverJobsCopy: DriverJobsCopy = {
  actionsColumn: "Actions",
  activeCountLabel: "Active jobs",
  activeDescription:
    "Assigned jobs currently available for driver lifecycle execution.",
  activeEmptyDescription:
    "Assigned driver jobs will appear here after provider dispatch assigns them.",
  activeEmptyTitle: "No active driver jobs",
  activeTitle: "Active jobs",
  companyColumn: "Company",
  destinationColumn: "Destination",
  historyCountLabel: "History",
  historyDescription:
    "Completed and cancelled jobs remain visible without execution actions.",
  historyEmptyDescription:
    "Completed and cancelled driver jobs will appear here.",
  historyEmptyTitle: "No driver history",
  historyTitle: "History",
  lifecycleColumn: "Lifecycle",
  missingVehicleLabel: "No vehicle assigned",
  noActionsLabel: "No action",
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
    "Execute assigned provider jobs through backend-owned lifecycle actions.",
  title: "Driver jobs",
  vehicleColumn: "Vehicle",
  visibleLabel: "visible",
};

export const demoDriverJobsPayload: DriverJobsPayload = {
  activeRows: [
    {
      allowedActions: [
        {
          id: "accept_driver_job",
          label: "Accept job",
        },
      ],
      assignedVehicleDisplayName: "TX 100",
      assignedVehicleLicensePlate: "B TX 100",
      bookingId: "booking_driver_active",
      publicId: "BKG-V8Q3JC",
      companyName: "Hoffmann Mobility GmbH",
      destinationAddress: "BER Airport",
      lifecycleStatus: "provider_accepted",
      passengerSummary: "Mina Rider",
      pickupAddress: "HQ Berlin",
      providerName: "City Funk Berlin",
      requestedPickupAt: "09:00",
    },
  ],
  activeVisibleCount: 1,
  historyRows: [],
  historyVisibleCount: 0,
};

export const demoDriverJobsMissingVehiclePayload: DriverJobsPayload = {
  activeRows: [
    {
      ...demoDriverJobsPayload.activeRows[0],
      allowedActions: [
        {
          disabled: true,
          id: "accept_driver_job",
          label: "Accept job",
          reason: "Assigned vehicle is required before driver execution.",
        },
      ],
      assignedVehicleDisplayName: null,
      assignedVehicleLicensePlate: null,
      bookingId: "booking_driver_missing_vehicle",
      publicId: "BKG-R6T4WA",
    },
  ],
  activeVisibleCount: 1,
  historyRows: [],
  historyVisibleCount: 0,
};

export const demoDriverJobsHistoryPayload: DriverJobsPayload = {
  activeRows: [],
  activeVisibleCount: 0,
  historyRows: [
    {
      ...demoDriverJobsPayload.activeRows[0],
      allowedActions: [],
      bookingId: "booking_driver_completed",
      publicId: "BKG-N9D2KP",
      lifecycleStatus: "completed",
    },
  ],
  historyVisibleCount: 1,
};

export const demoDriverJobsEmptyPayload: DriverJobsPayload = {
  activeRows: [],
  activeVisibleCount: 0,
  historyRows: [],
  historyVisibleCount: 0,
};
