import { render, screen, within } from "@testing-library/react";
import { Clock3 } from "lucide-react";
import { describe, expect, test } from "vitest";

import {
  OperationsDataTable,
  OperationsDataTableBody,
  OperationsDataTableCell,
  OperationsDataTableHeader,
  OperationsDataTableHeaderCell,
  OperationsDataTableRow,
  TableStatusCell,
} from "./workspace-operations-table";

describe("operations clarity components", () => {
  test("renders a status cell from provided status fields only", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableStatusCell
              status={{
                ariaLabel: "Ride status: driver assigned",
                description: "Driver and vehicle were provided by the payload.",
                icon: <Clock3 data-testid="status-icon" />,
                label: "Driver assigned",
                tone: "info",
              }}
            />
          </tr>
        </tbody>
      </table>,
    );

    expect(screen.getByText("Driver assigned")).toBeTruthy();
    expect(screen.getByText("Ride status: driver assigned")).toBeTruthy();
    expect(
      screen.getByText("Driver and vehicle were provided by the payload."),
    ).toBeTruthy();
    expect(screen.getByTestId("status-icon")).toBeTruthy();
  });

  test("renders operations table rows through slots without data mapping", () => {
    render(
      <OperationsDataTable title="Operations">
        <OperationsDataTableHeader>
          <OperationsDataTableHeaderCell>Time</OperationsDataTableHeaderCell>
          <OperationsDataTableHeaderCell>Status</OperationsDataTableHeaderCell>
        </OperationsDataTableHeader>
        <OperationsDataTableBody>
          <OperationsDataTableRow>
            <OperationsDataTableCell>09:20</OperationsDataTableCell>
            <TableStatusCell status={{ label: "Provided", tone: "success" }} />
          </OperationsDataTableRow>
        </OperationsDataTableBody>
      </OperationsDataTable>,
    );

    const table = screen.getByRole("table");

    expect(within(table).getByText("09:20")).toBeTruthy();
    expect(within(table).getByText("Provided")).toBeTruthy();
    expect(screen.getByText("Operations")).toBeTruthy();
  });

  test("renders table loading state through WorkspaceStateView", () => {
    render(
      <OperationsDataTable
        state={{ title: "Operations are loading", variant: "loading" }}
        title="Operations"
      />,
    );

    expect(screen.getByRole("status")).toBeTruthy();
    expect(screen.getByText("Operations are loading")).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });
});
