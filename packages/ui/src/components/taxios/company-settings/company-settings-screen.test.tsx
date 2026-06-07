import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import type {
  CompanySettingsCopy,
  CompanySettingsPayload,
} from "../../../contracts/company-settings";
import { CompanySettingsWorkspaceContent } from "./company-settings-screen";

const copy: CompanySettingsCopy = {
  bookingSectionDescription: "Regeln für neue Buchungen.",
  bookingSectionTitle: "Buchungen",
  cancelLabel: "Abbrechen",
  dataSectionDescription: "Exports und Nachvollziehbarkeit.",
  dataSectionTitle: "Daten & Export",
  editLabel: "Bearbeiten",
  generalSectionDescription: "Basisdaten und Workspace-Defaults.",
  generalSectionTitle: "Allgemein",
  integrationsSectionDescription: "Kalender, Accounting und API.",
  integrationsSectionTitle: "Integrationen",
  notificationsSectionDescription: "Ruhige Workspace-Hinweise.",
  notificationsSectionTitle: "Benachrichtigungen",
  readOnlyLabel: "Nur Anzeige",
  saveLabel: "Speichern",
  savedLabel: "Gespeichert",
  securitySectionDescription: "Konto, Rollen und Zugriff.",
  securitySectionTitle: "Sicherheit",
  subtitle: "Selten geänderte Regeln für den aktiven Company-Workspace.",
  title: "Einstellungen",
};

const payload: CompanySettingsPayload = {
  allowedActions: [
    {
      id: "update_company_general_settings",
      label: "Allgemeine Einstellungen bearbeiten",
    },
    {
      id: "update_company_booking_settings",
      label: "Buchungsregeln bearbeiten",
    },
    {
      id: "update_company_notification_settings",
      label: "Benachrichtigungseinstellungen bearbeiten",
    },
    {
      disabled: true,
      id: "open_password_settings",
      label: "Passwort und Konto verwalten",
      reason: "Das sichere Account-Portal wird separat angebunden.",
    },
    {
      href: "/company-organization?section=members",
      id: "open_roles_settings",
      label: "Rollen in Organisation verwalten",
    },
    {
      href: "/company-finance",
      id: "open_billing",
      label: "Finanzen oeffnen",
    },
    {
      href: "/company-reports",
      id: "open_audit_export",
      label: "Berichte und Exporte oeffnen",
    },
    {
      disabled: true,
      id: "open_integrations",
      label: "Integrationen verwalten",
      reason: "Integrationen werden in einem späteren Slice angebunden.",
    },
  ],
  booking: {
    allowGuestPassengers: true,
    bookingMinimumLeadTimeMinutes: 30,
    cancellationWindowMinutes: 60,
    requireCostCenter: false,
    requirePassengerProfile: false,
  },
  general: {
    locale: "de-DE",
    organizationName: "Smoke Company HQ",
    organizationPublicId: "COM-SMOKE",
    supportEmail: null,
    timezone: "Europe/Berlin",
  },
  notifications: {
    notificationBillingAlertsEnabled: true,
    notificationBookingUpdatesEnabled: true,
  },
  organizationId: "organization_1",
  organizationName: "Smoke Company HQ",
  settingsId: null,
  updatedAt: null,
};

describe("CompanySettingsWorkspaceContent", () => {
  test("renders the settings sections and readonly company identity", () => {
    render(
      <CompanySettingsWorkspaceContent
        activeSection="general"
        copy={copy}
        payload={payload}
      />,
    );

    expect(screen.getByRole("heading", { name: "Einstellungen" })).not.toBeNull();
    expect(screen.getAllByText("Allgemein").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Buchungen").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Benachrichtigungen").length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText("Smoke Company HQ").length).toBeGreaterThan(0);
    expect(screen.getByText("COM-SMOKE")).not.toBeNull();
  });

  test("submits editable general settings", async () => {
    const user = userEvent.setup();
    const onUpdateGeneral = vi.fn(async () => undefined);

    render(
      <CompanySettingsWorkspaceContent
        activeSection="general"
        copy={copy}
        onUpdateGeneral={onUpdateGeneral}
        payload={payload}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Bearbeiten/ }));
    await user.type(screen.getByLabelText("Support-Mail"), "team@example.test");
    await user.click(screen.getByRole("button", { name: /Speichern/ }));

    expect(onUpdateGeneral).toHaveBeenCalledWith({
      locale: "de-DE",
      supportEmail: "team@example.test",
      timezone: "Europe/Berlin",
    });
  });

  test("shows disabled edit reason for users without manage rights", () => {
    render(
      <CompanySettingsWorkspaceContent
        activeSection="general"
        copy={copy}
        payload={{
          ...payload,
          allowedActions: payload.allowedActions.map((action) =>
            action.id === "update_company_general_settings"
              ? {
                  ...action,
                  disabled: true,
                  reason: "Nur Admins können Company-Einstellungen bearbeiten.",
                }
              : action,
          ),
        }}
      />,
    );

    expect(
      (screen.getByRole("button", { name: /Bearbeiten/ }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });

  test("renders feedback with shared status tokens, not raw red or emerald", () => {
    const { rerender } = render(
      <CompanySettingsWorkspaceContent
        activeSection="general"
        copy={copy}
        errorMessage="Speichern fehlgeschlagen"
        payload={payload}
        savingSection={null}
      />,
    );

    const errorFeedback = screen.getByText("Speichern fehlgeschlagen");

    expect(errorFeedback.className).toContain(
      "border-[var(--taxis-status-danger-ring)]",
    );
    expect(errorFeedback.className).toContain(
      "bg-[var(--taxis-status-danger-bg)]",
    );
    expect(errorFeedback.className).toContain(
      "text-[var(--taxis-status-danger-text)]",
    );
    expect(errorFeedback.className).not.toContain("red-");

    rerender(
      <CompanySettingsWorkspaceContent
        activeSection="general"
        copy={copy}
        payload={payload}
        savingSection={null}
        successMessage="Gespeichert"
      />,
    );

    const successFeedback = screen.getByText("Gespeichert");

    expect(successFeedback.className).toContain(
      "border-[var(--taxis-status-success-ring)]",
    );
    expect(successFeedback.className).toContain(
      "bg-[var(--taxis-status-success-bg)]",
    );
    expect(successFeedback.className).toContain(
      "text-[var(--taxis-status-success-text)]",
    );
    expect(successFeedback.className).not.toContain("emerald-");
  });
});
