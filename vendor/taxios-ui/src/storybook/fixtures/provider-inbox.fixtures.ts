import type {
  ProviderInboxCopy,
  ProviderJobFormCopy,
  ProviderInboxRow,
} from "../../contracts/provider-inbox";

export const demoProviderInboxCopy: ProviderInboxCopy = {
  acceptedJobsDescription:
    "Accepted provider-owned jobs that can later move to driver assignment or Driver Pool.",
  acceptedJobsEmptyDescription:
    "Accepted provider jobs will appear here after a request is confirmed.",
  acceptedJobsEmptyTitle: "No accepted jobs",
  acceptedJobsTitle: "Accepted jobs",
  actionsLabel: "Actions",
  assignedJobsDescription:
    "Provider-internal jobs already assigned by dispatch.",
  assignedJobsEmptyDescription:
    "Assigned internal jobs will appear here after dispatch assigns them.",
  assignedJobsEmptyTitle: "No assigned jobs",
  assignedJobsTitle: "Assigned jobs",
  assignedBookingsDescription:
    "Company requests assigned to this provider workspace and waiting for operational handling.",
  assignedBookingsTitle: "Provider requests",
  assignedDriverLabel: "Driver",
  assignedVehicleLabel: "Vehicle",
  assignDriverEmptyLabel: "No active drivers",
  assignDriverLabel: "Assign driver",
  assignVehicleEmptyLabel: "No active vehicles",
  assignVehicleLabel: "Assign vehicle",
  availableJobsDescription:
    "Accepted provider-owned jobs released into the provider-internal Driver Pool.",
  availableJobsEmptyDescription:
    "Jobs moved to the internal Driver Pool will appear here for dispatch handling.",
  availableJobsEmptyTitle: "No available jobs",
  availableJobsTitle: "Available jobs",
  closedJobsDescription:
    "Completed and cancelled jobs are kept separate from active provider operations.",
  closedJobsEmptyDescription: "Completed and cancelled provider jobs will appear here.",
  closedJobsEmptyTitle: "No closed jobs",
  closedJobsTitle: "Closed jobs",
  companyColumn: "Company",
  destinationColumn: "Destination",
  emptyDescription:
    "Assigned provider bookings will appear here once a company request is scoped to your provider organization.",
  emptyTitle: "No assigned bookings",
  globalPoolDescription:
    "Open company requests that are not assigned to a provider yet.",
  globalPoolEmptyDescription:
    "Open company requests will appear here before a provider accepts them.",
  globalPoolEmptyTitle: "No global pool requests",
  globalPoolTitle: "Global Pool",
  historyDescription:
    "Completed and cancelled bookings are kept separate from active provider operations.",
  historyEmptyDescription: "Completed and cancelled provider bookings will appear here.",
  historyEmptyTitle: "No closed jobs",
  historyTitle: "Closed jobs",
  openPickupTimeLabel: "Open",
  passengerColumn: "Passenger",
  pickupColumn: "Pickup",
  pickupTimeColumn: "Pickup time",
  statusColumn: "Status",
  statusLabels: {
    cancelled: "Cancelled",
    completed: "Completed",
    confirmed: "Confirmed",
    requested: "Requested",
  },
  subtitle: "Review company requests assigned to your provider organization.",
  title: "Provider requests",
  visibleLabel: "visible",
};

export const demoProviderJobFormCopy: ProviderJobFormCopy = {
  destinationLabel: "Destination",
  destinationPlaceholder: "Client site",
  errorFallback: "Provider job could not be created. Please try again.",
  formTitle: "Create internal provider job",
  optionalPickupTimeLabel: "Pickup time",
  passengerLabel: "Passenger",
  passengerPlaceholder: "Passenger name",
  pickupLabel: "Pickup",
  pickupPlaceholder: "Provider base",
  submitLabel: "Create job",
  submittingLabel: "Creating...",
  successLabel: "Provider job created.",
};

export const demoProviderInboxRows: ProviderInboxRow[] = [
  {
    allowedActions: [
      {
        id: "confirm_booking",
        label: "Confirm",
      },
      {
        id: "reject_booking",
        label: "Reject",
      },
    ],
    bookingId: "booking_requested_1",
    publicId: "BKG-M4Q8TA",
    companyName: "Hoffmann Mobility GmbH",
    destinationAddress: "BER Terminal 1",
    passengerSummary: "Mina Rider",
    pickupAddress: "HQ Berlin",
    requestedPickupAt: "09:00",
    status: "requested",
  },
  {
    allowedActions: [
      {
        id: "complete_booking",
        label: "Complete",
      },
      {
        id: "assign_driver_vehicle",
        label: "Assign driver + vehicle",
      },
    ],
    bookingId: "booking_confirmed_1",
    publicId: "BKG-Q7N2HC",
    companyName: "Atlas Consulting",
    destinationAddress: "Berlin Hauptbahnhof",
    passengerSummary: "Jonas Keller, Priya Mehta",
    pickupAddress: "Potsdamer Platz 1",
    requestedPickupAt: "10:30",
    status: "confirmed",
  },
  {
    allowedActions: [],
    bookingId: "booking_completed_1",
    publicId: "BKG-3K9WPD",
    companyName: "Northstar Labs",
    destinationAddress: "Messe Berlin",
    passengerSummary: "Aylin Demir",
    pickupAddress: "Friedrichstrasse 42",
    requestedPickupAt: "11:15",
    status: "completed",
  },
];

export const demoProviderDriverOptions = [
  {
    displayName: "Dana Driver",
    email: "dana.driver@example.test",
    userId: "user_driver_1",
  },
  {
    displayName: "Maya Driver",
    email: "maya.driver@example.test",
    userId: "user_driver_2",
  },
];

export const demoProviderVehicleOptions = [
  {
    displayName: "TX 101",
    licensePlate: "B TX 101",
    vehicleId: "vehicle_1",
  },
  {
    displayName: "TX 200",
    licensePlate: "B TX 200",
    vehicleId: "vehicle_2",
  },
];

export const demoProviderInboxActiveRows = demoProviderInboxRows.filter(
  (row) => row.status === "requested" || row.status === "confirmed",
);

export const demoProviderInboxTerminalHistoryRows = demoProviderInboxRows.filter(
  (row) => row.status === "cancelled" || row.status === "completed",
);

export const demoProviderInboxReadOnlyRows: ProviderInboxRow[] = [
  {
    ...demoProviderInboxRows[0],
    allowedActions: [
      {
        disabled: true,
        id: "confirm_booking",
        label: "Confirm",
        reason: "Only provider operators can confirm bookings.",
      },
      {
        disabled: true,
        id: "reject_booking",
        label: "Reject",
        reason: "Only provider operators can reject bookings.",
      },
    ],
  },
];
