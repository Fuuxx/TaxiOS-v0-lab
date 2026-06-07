import type { Meta, StoryObj } from "@storybook/react-vite";

import { StoryCanvas } from "../../../storybook/story-canvas";
import { CompanySettingsWorkspaceContent } from "./company-settings-screen";

const copy = {
  bookingSectionDescription: "Vorlauf, Storno und Passagier-Regeln.",
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

const payload = {
  allowedActions: [
    {
      id: "update_company_general_settings" as const,
      label: "Allgemeine Einstellungen bearbeiten",
    },
    {
      id: "update_company_booking_settings" as const,
      label: "Buchungsregeln bearbeiten",
    },
    {
      id: "update_company_notification_settings" as const,
      label: "Benachrichtigungseinstellungen bearbeiten",
    },
    {
      disabled: true,
      id: "open_password_settings" as const,
      label: "Passwort und Konto verwalten",
      reason: "Das sichere Account-Portal wird separat angebunden.",
    },
    {
      href: "/company-organization?section=members",
      id: "open_roles_settings" as const,
      label: "Rollen in Organisation verwalten",
    },
    {
      href: "/company-finance",
      id: "open_billing" as const,
      label: "Finanzen oeffnen",
    },
    {
      href: "/company-reports",
      id: "open_audit_export" as const,
      label: "Berichte und Exporte oeffnen",
    },
    {
      disabled: true,
      id: "open_integrations" as const,
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
    locale: "de-DE" as const,
    organizationName: "Smoke Company HQ",
    organizationPublicId: "COM-SMOKE",
    supportEmail: "support@smoke.example",
    timezone: "Europe/Berlin" as const,
  },
  notifications: {
    notificationBillingAlertsEnabled: true,
    notificationBookingUpdatesEnabled: true,
  },
  organizationId: "organization_1",
  organizationName: "Smoke Company HQ",
  settingsId: "settings_1",
  updatedAt: Date.UTC(2026, 4, 20, 9, 30),
};

const meta = {
  title: "Taxios/TaxiOS/Company Settings/Screen",
  component: CompanySettingsWorkspaceContent,
  decorators: [
    (Story) => (
      <StoryCanvas contentClassName="p-0" maxWidth="none" tone="dashboard">
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CompanySettingsWorkspaceContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const General: Story = {
  args: {
    activeSection: "general",
    copy,
    payload,
  },
};

export const BookingRules: Story = {
  args: {
    activeSection: "bookings",
    copy,
    payload,
  },
};

export const ReadOnlyUser: Story = {
  args: {
    activeSection: "general",
    copy,
    payload: {
      ...payload,
      allowedActions: payload.allowedActions.map((action) =>
        action.id.startsWith("update_company_")
          ? {
              ...action,
              disabled: true,
              reason: "Nur Admins können Company-Einstellungen bearbeiten.",
            }
          : action,
      ),
    },
  },
};

export const ErrorFeedback: Story = {
  args: {
    activeSection: "general",
    copy,
    errorMessage: "Speichern fehlgeschlagen.",
    payload,
    savingSection: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Settings feedback uses shared danger status tokens while preserving the same form payload and callbacks.",
      },
    },
  },
};

export const SuccessFeedback: Story = {
  args: {
    activeSection: "general",
    copy,
    payload,
    savingSection: null,
    successMessage: "Gespeichert.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Settings feedback uses shared success status tokens instead of page-local emerald utilities.",
      },
    },
  },
};
