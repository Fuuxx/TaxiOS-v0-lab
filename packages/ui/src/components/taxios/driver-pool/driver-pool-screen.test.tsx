import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { DriverPoolScreen } from "./driver-pool-screen";

const copy = {
  actionsColumn: "Actions",
  availableCountLabel: "Available jobs",
  availableDescription: "Jobs released into the Driver Pool.",
  availableEmptyDescription: "Released jobs will appear here.",
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
  subtitle: "Claim available jobs from your provider workspace.",
  title: "Driver Pool",
  vehicleColumn: "Vehicle",
  visibleLabel: "visible",
};

describe("DriverPoolScreen", () => {
  test("renders available pool jobs and claim actions", () => {
    render(
      <DriverPoolScreen
        copy={copy}
        organizationName="City Funk Berlin"
        payload={{
          availableRows: [
            {
              allowedActions: [{ id: "claim_driver_pool_job", label: "Claim job" }],
              assignedVehicleDisplayName: null,
              assignedVehicleLicensePlate: null,
              bookingId: "booking_123",
              companyName: "Hoffmann Mobility GmbH",
              destinationAddress: "BER Airport",
              lifecycleStatus: "provider_accepted",
              passengerSummary: "Mina Rider",
              pickupAddress: "HQ Berlin",
              providerName: "City Funk Berlin",
              publicId: "BKG-POOL",
              requestedPickupAt: "09:00",
            },
          ],
          availableVisibleCount: 1,
        }}
        actionRenderer={({ action }) => (
          <button type="button">{action.label}</button>
        )}
      />,
    );

    expect(screen.getAllByText("Driver Pool").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Hoffmann Mobility GmbH").length).toBeGreaterThan(0);
    expect(screen.getAllByText("BKG-POOL").length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("button", { name: "Claim job" }).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Vehicle assigned after claim").length).toBeGreaterThan(0);
  });

  test("renders an empty state when no pool jobs are available", () => {
    render(
      <DriverPoolScreen
        copy={copy}
        organizationName="City Funk Berlin"
        payload={{
          availableRows: [],
          availableVisibleCount: 0,
        }}
      />,
    );

    expect(screen.getByText("No Driver Pool jobs")).not.toBeNull();
    expect(screen.getByText("Released jobs will appear here.")).not.toBeNull();
  });
});
