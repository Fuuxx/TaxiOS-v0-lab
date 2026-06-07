export type CompanySettingsSectionId =
  | "bookings"
  | "data"
  | "general"
  | "integrations"
  | "notifications"
  | "security";

export type CompanySettingsLocale = "de-DE" | "en-US";
export type CompanySettingsTimezone = "Europe/Berlin" | "UTC";

export type CompanySettingsActionId =
  | "open_audit_export"
  | "open_billing"
  | "open_integrations"
  | "open_password_settings"
  | "open_roles_settings"
  | "update_company_booking_settings"
  | "update_company_general_settings"
  | "update_company_notification_settings";

export type CompanySettingsAction = {
  disabled?: boolean;
  href?: string;
  id: CompanySettingsActionId;
  label: string;
  reason?: string;
};

export type CompanySettingsGeneral = {
  locale: CompanySettingsLocale;
  organizationName: string;
  organizationPublicId: string | null;
  supportEmail: string | null;
  timezone: CompanySettingsTimezone;
};

export type CompanySettingsGeneralFormData = Pick<
  CompanySettingsGeneral,
  "locale" | "supportEmail" | "timezone"
>;

export type CompanySettingsBooking = {
  allowGuestPassengers: boolean;
  bookingMinimumLeadTimeMinutes: number;
  cancellationWindowMinutes: number;
  requireCostCenter: boolean;
  requirePassengerProfile: boolean;
};

export type CompanySettingsBookingFormData = CompanySettingsBooking;

export type CompanySettingsNotifications = {
  notificationBillingAlertsEnabled: boolean;
  notificationBookingUpdatesEnabled: boolean;
};

export type CompanySettingsNotificationsFormData =
  CompanySettingsNotifications;

export type CompanySettingsPayload = {
  allowedActions: CompanySettingsAction[];
  booking: CompanySettingsBooking;
  general: CompanySettingsGeneral;
  notifications: CompanySettingsNotifications;
  organizationId: string;
  organizationName: string;
  settingsId: string | null;
  updatedAt: number | null;
};

export type CompanySettingsCopy = {
  bookingSectionDescription: string;
  bookingSectionTitle: string;
  cancelLabel: string;
  dataSectionDescription: string;
  dataSectionTitle: string;
  editLabel: string;
  generalSectionDescription: string;
  generalSectionTitle: string;
  integrationsSectionDescription: string;
  integrationsSectionTitle: string;
  notificationsSectionDescription: string;
  notificationsSectionTitle: string;
  readOnlyLabel: string;
  saveLabel: string;
  savedLabel: string;
  securitySectionDescription: string;
  securitySectionTitle: string;
  subtitle: string;
  title: string;
};
