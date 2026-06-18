import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import {
  demoCompanyDashboardCopyDe,
  demoCompanyDashboardData,
} from "../../../storybook/fixtures/company-dashboard.fixtures";
import {
  CompanyDashboardRidesWorkspaceContent,
  CompanyDashboardWorkspaceContent,
} from "./company-dashboard-screen";

describe("CompanyDashboardWorkspaceContent", () => {
  test("does not render the legacy inline booking form or booking history on the workspace dashboard", () => {
    render(
      <CompanyDashboardWorkspaceContent
        bookingForm={<div>Fahrt anfragen</div>}
        copy={demoCompanyDashboardCopyDe}
        dashboardData={demoCompanyDashboardData}
        headerDateLabel="Donnerstag, 14. Mai"
      />,
    );

    expect(screen.queryByText("Fahrt anfragen")).toBeNull();
    expect(screen.queryByText("Letzte Buchungshistorie")).toBeNull();
  });

  test("hides fastbooking when create booking is not allowed", () => {
    render(
      <CompanyDashboardWorkspaceContent
        copy={demoCompanyDashboardCopyDe}
        dashboardData={{
          ...demoCompanyDashboardData,
          allowedActions: [
            {
              disabled: true,
              id: "create_booking",
              label: "Create booking",
            },
          ],
        }}
        headerDateLabel="Donnerstag, 14. Mai"
      />,
    );

    expect(screen.queryByText("Fastbooking")).toBeNull();
    expect(
      screen.queryByLabelText("Neue Fastbooking-Route offnen"),
    ).toBeNull();
  });

  test("renders fastbooking before rides and live feed", () => {
    render(
      <CompanyDashboardWorkspaceContent
        copy={demoCompanyDashboardCopyDe}
        dashboardData={demoCompanyDashboardData}
        headerDateLabel="Donnerstag, 14. Mai"
      />,
    );

    const fastbookingHeading = screen.getByRole("heading", {
      name: demoCompanyDashboardCopyDe.fastbooking.title,
    });
    const ridesHeading = screen.getByRole("heading", {
      name: demoCompanyDashboardCopyDe.rides.title,
    });
    const liveFeedHeading = screen.getByRole("heading", {
      name: demoCompanyDashboardCopyDe.liveFeed.title,
    });

    expect(
      fastbookingHeading.compareDocumentPosition(ridesHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      fastbookingHeading.compareDocumentPosition(liveFeedHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      ridesHeading.compareDocumentPosition(liveFeedHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test("renders dashboard ride status without row action controls", () => {
    render(
      <CompanyDashboardWorkspaceContent
        copy={demoCompanyDashboardCopyDe}
        dashboardData={demoCompanyDashboardData}
        headerDateLabel="Donnerstag, 14. Mai"
        rideActionSlots={{
          "BER-5562": <button type="button">Stornieren</button>,
        }}
      />,
    );

    expect(screen.queryByRole("button", { name: "Stornieren" })).toBeNull();
    expect(screen.getAllByRole("columnheader").map((header) => header.textContent)).toEqual([
      "Zeit",
      "Passagiere",
      "Route",
      "ID",
      "Status",
    ]);
    expect(screen.getByText("BKG-7K4Q2M")).toBeTruthy();
    expect(screen.getAllByTitle("Taxi-Status: bestellt").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Von").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Nach").length).toBeGreaterThan(0);
  });

  test("renders company rides without booking history and supports ten active rows", () => {
    const tenTrips = Array.from({ length: 10 }, (_, index) => ({
      ...demoCompanyDashboardData.upcomingTrips[
        index % demoCompanyDashboardData.upcomingTrips.length
      ],
      id: `booking-${index}`,
      publicId: `BKG-TEST${index}`,
    }));

    const { container } = render(
      <CompanyDashboardRidesWorkspaceContent
        activeRowCapacity={10}
        copy={demoCompanyDashboardCopyDe.rides}
        recentBookingHistory={demoCompanyDashboardData.recentBookingHistory}
        recentBookingHistorySummary={
          demoCompanyDashboardData.recentBookingHistorySummary
        }
        showRecentHistory={false}
        upcomingTrips={tenTrips}
      />,
    );

    const capacitySurface = container.querySelector(
      ".taxios-rides-capacity-surface",
    ) as HTMLElement | null;

    expect(capacitySurface).toBeTruthy();
    expect(
      capacitySurface?.style.getPropertyValue("--taxios-rides-row-capacity"),
    ).toBe("10");
    expect(screen.queryByText("Letzte Buchungshistorie")).toBeNull();
    expect(screen.getAllByRole("row")).toHaveLength(11);
    expect(screen.getByText("BKG-TEST9")).toBeTruthy();
  });
});
