"use client";

import "../workspace/workspace.css";

import {
  Bell,
  Building2,
  CalendarClock,
  Check,
  Database,
  LockKeyhole,
  type LucideIcon,
  Plug,
  Save,
  Settings2,
  ShieldCheck,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import type {
  CompanySettingsAction,
  CompanySettingsActionId,
  CompanySettingsBookingFormData,
  CompanySettingsCopy,
  CompanySettingsGeneralFormData,
  CompanySettingsNotificationsFormData,
  CompanySettingsPayload,
  CompanySettingsSectionId,
} from "../../../contracts/company-settings";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { WorkspaceSurface } from "../workspace/workspace-primitives";

export type CompanySettingsWorkspaceContentProps = {
  activeSection: CompanySettingsSectionId;
  copy: CompanySettingsCopy;
  errorMessage?: string | null;
  onSectionChange?: (section: CompanySettingsSectionId) => void;
  onUpdateBooking?: (data: CompanySettingsBookingFormData) => Promise<void>;
  onUpdateGeneral?: (data: CompanySettingsGeneralFormData) => Promise<void>;
  onUpdateNotifications?: (
    data: CompanySettingsNotificationsFormData,
  ) => Promise<void>;
  payload: CompanySettingsPayload;
  savingSection?: CompanySettingsSectionId | null;
  successMessage?: string | null;
};

type EditableSection = "bookings" | "general" | "notifications";

const sectionItems: readonly {
  description: keyof CompanySettingsCopy;
  icon: LucideIcon;
  id: CompanySettingsSectionId;
  title: keyof CompanySettingsCopy;
}[] = [
  {
    description: "generalSectionDescription",
    icon: Building2,
    id: "general",
    title: "generalSectionTitle",
  },
  {
    description: "bookingSectionDescription",
    icon: CalendarClock,
    id: "bookings",
    title: "bookingSectionTitle",
  },
  {
    description: "notificationsSectionDescription",
    icon: Bell,
    id: "notifications",
    title: "notificationsSectionTitle",
  },
  {
    description: "securitySectionDescription",
    icon: LockKeyhole,
    id: "security",
    title: "securitySectionTitle",
  },
  {
    description: "dataSectionDescription",
    icon: Database,
    id: "data",
    title: "dataSectionTitle",
  },
  {
    description: "integrationsSectionDescription",
    icon: Plug,
    id: "integrations",
    title: "integrationsSectionTitle",
  },
];

function getAction(
  payload: CompanySettingsPayload,
  id: CompanySettingsActionId,
) {
  return payload.allowedActions.find((action) => action.id === id);
}

function useEditableDrafts(payload: CompanySettingsPayload) {
  const [generalDraft, setGeneralDraft] =
    useState<CompanySettingsGeneralFormData>({
      locale: payload.general.locale,
      supportEmail: payload.general.supportEmail,
      timezone: payload.general.timezone,
    });
  const [bookingDraft, setBookingDraft] =
    useState<CompanySettingsBookingFormData>(payload.booking);
  const [notificationDraft, setNotificationDraft] =
    useState<CompanySettingsNotificationsFormData>(payload.notifications);

  useEffect(() => {
    setGeneralDraft({
      locale: payload.general.locale,
      supportEmail: payload.general.supportEmail,
      timezone: payload.general.timezone,
    });
    setBookingDraft(payload.booking);
    setNotificationDraft(payload.notifications);
  }, [payload]);

  return {
    bookingDraft,
    generalDraft,
    notificationDraft,
    resetBooking: () => setBookingDraft(payload.booking),
    resetGeneral: () =>
      setGeneralDraft({
        locale: payload.general.locale,
        supportEmail: payload.general.supportEmail,
        timezone: payload.general.timezone,
      }),
    resetNotifications: () => setNotificationDraft(payload.notifications),
    setBookingDraft,
    setGeneralDraft,
    setNotificationDraft,
  };
}

function SectionButton({
  active,
  description,
  icon: Icon,
  onClick,
  title,
}: {
  active: boolean;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      aria-current={active ? "page" : undefined}
      className={cn(
        "group grid min-h-16 w-full grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3 rounded-[18px] border px-3 py-3 text-left transition-all duration-200",
        active
          ? "border-[var(--taxis-workspace-surface-rim-strong)] bg-[var(--taxis-workspace-surface)] shadow-[0_18px_50px_-38px_rgba(15,23,42,0.55)]"
          : "border-transparent bg-transparent hover:border-[var(--taxis-workspace-surface-rim)] hover:bg-[var(--taxis-workspace-surface-soft)]",
      )}
      onClick={onClick}
      type="button"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] text-[var(--taxis-workspace-text-secondary)]">
        <Icon aria-hidden="true" size={17} strokeWidth={1.9} />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
          {title}
        </span>
        <span className="mt-0.5 block truncate text-[11.5px] text-[var(--taxis-workspace-text-muted)]">
          {description}
        </span>
      </span>
    </button>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[16px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface-soft)] px-4 py-3">
      <span className="block font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
        {label}
      </span>
      <span className="mt-1 block truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
        {value}
      </span>
    </div>
  );
}

function ToggleRow({
  checked,
  description,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  disabled: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex min-h-16 items-center justify-between gap-4 rounded-[18px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-4 py-3",
        disabled ? "opacity-75" : "cursor-pointer",
      )}
    >
      <span className="min-w-0">
        <span className="block font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
          {label}
        </span>
        <span className="mt-0.5 block text-[12px] text-[var(--taxis-workspace-text-muted)] leading-relaxed">
          {description}
        </span>
      </span>
      <input
        checked={checked}
        className="h-5 w-5 accent-[var(--taxis-workspace-accent)]"
        disabled={disabled}
        onChange={(event) => onChange(event.currentTarget.checked)}
        type="checkbox"
      />
    </label>
  );
}

function SectionHeader({
  action,
  copy,
  editing,
  editable,
  onCancel,
  onEdit,
  section,
  saving,
}: {
  action?: CompanySettingsAction;
  copy: CompanySettingsCopy;
  editable?: boolean;
  editing: boolean;
  onCancel: () => void;
  onEdit: () => void;
  saving: boolean;
  section: CompanySettingsSectionId;
}) {
  const item = sectionItems.find((candidate) => candidate.id === section);
  const actionDisabled = action?.disabled === true || !editable;

  return (
    <div className="flex flex-col gap-4 border-[var(--taxis-workspace-surface-rim)] border-b pb-5 md:flex-row md:items-start md:justify-between">
      <div>
        <span className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
          Einstellungen
        </span>
        <h2 className="mt-1 font-semibold text-[24px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
          {item ? copy[item.title] : copy.title}
        </h2>
        {item ? (
          <p className="mt-1 max-w-2xl text-[13px] text-[var(--taxis-workspace-text-muted)] leading-relaxed">
            {copy[item.description]}
          </p>
        ) : null}
      </div>
      {editable ? (
        <div className="flex flex-wrap gap-2">
          {editing ? (
            <>
              <Button
                className="h-10 rounded-[13px]"
                disabled={saving}
                onClick={onCancel}
                type="button"
                variant="outline"
              >
                <X aria-hidden="true" size={15} />
                {copy.cancelLabel}
              </Button>
              <Button
                className="h-10 rounded-[13px]"
                disabled={saving}
                form={`company-settings-${section}`}
                type="submit"
              >
                <Save aria-hidden="true" size={15} />
                {saving ? "Speichert..." : copy.saveLabel}
              </Button>
            </>
          ) : (
            <Button
              className="h-10 rounded-[13px]"
              disabled={actionDisabled}
              onClick={onEdit}
              title={actionDisabled ? action?.reason : undefined}
              type="button"
              variant="outline"
            >
              <Settings2 aria-hidden="true" size={15} />
              {copy.editLabel}
            </Button>
          )}
        </div>
      ) : (
        <span className="inline-flex min-h-9 items-center rounded-[12px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface-soft)] px-3 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
          {copy.readOnlyLabel}
        </span>
      )}
      {actionDisabled && action?.reason ? (
        <p className="md:hidden text-[12px] text-[var(--taxis-workspace-text-muted)]">
          {action.reason}
        </p>
      ) : null}
    </div>
  );
}

function Feedback({
  errorMessage,
  successMessage,
}: {
  errorMessage?: string | null;
  successMessage?: string | null;
}) {
  if (!errorMessage && !successMessage) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-[16px] border px-4 py-3 font-semibold text-[13px]",
        errorMessage
          ? "border-[var(--taxis-status-danger-ring)] bg-[var(--taxis-status-danger-bg)] text-[var(--taxis-status-danger-text)]"
          : "border-[var(--taxis-status-success-ring)] bg-[var(--taxis-status-success-bg)] text-[var(--taxis-status-success-text)]",
      )}
      role="status"
    >
      {errorMessage ?? successMessage}
    </div>
  );
}

function GeneralSection({
  action,
  copy,
  draft,
  editing,
  errorMessage,
  onCancel,
  onDraftChange,
  onEdit,
  onSubmit,
  payload,
  saving,
  successMessage,
}: {
  action?: CompanySettingsAction;
  copy: CompanySettingsCopy;
  draft: CompanySettingsGeneralFormData;
  editing: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onDraftChange: (draft: CompanySettingsGeneralFormData) => void;
  onEdit: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  payload: CompanySettingsPayload;
  saving: boolean;
  successMessage?: string | null;
}) {
  return (
    <form
      className="grid gap-5"
      id="company-settings-general"
      onSubmit={onSubmit}
    >
      <SectionHeader
        action={action}
        copy={copy}
        editable
        editing={editing}
        onCancel={onCancel}
        onEdit={onEdit}
        saving={saving}
        section="general"
      />
      <Feedback errorMessage={errorMessage} successMessage={successMessage} />
      <div className="grid gap-3 md:grid-cols-2">
        <ReadOnlyField
          label="Company"
          value={payload.general.organizationName}
        />
        <ReadOnlyField
          label="Public ID"
          value={payload.general.organizationPublicId ?? "-"}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="grid gap-2 md:col-span-1">
          <Label htmlFor="company-settings-support-email">Support-Mail</Label>
          <Input
            disabled={!editing || saving}
            id="company-settings-support-email"
            onChange={(event) =>
              onDraftChange({
                ...draft,
                supportEmail: event.currentTarget.value,
              })
            }
            placeholder="support@example.com"
            type="email"
            value={draft.supportEmail ?? ""}
          />
        </div>
        <div className="grid gap-2">
          <Label
            htmlFor="company-settings-locale"
            id="company-settings-locale-label"
          >
            Sprache
          </Label>
          <Select
            disabled={!editing || saving}
            onValueChange={(value) =>
              onDraftChange({
                ...draft,
                locale: value as "de-DE" | "en-US",
              })
            }
            value={draft.locale}
          >
            <SelectTrigger
              aria-labelledby="company-settings-locale-label"
              id="company-settings-locale"
            >
              <SelectValue>
                {(value) => (value === "en-US" ? "English" : "Deutsch")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de-DE">Deutsch</SelectItem>
              <SelectItem value="en-US">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label
            htmlFor="company-settings-timezone"
            id="company-settings-timezone-label"
          >
            Zeitzone
          </Label>
          <Select
            disabled={!editing || saving}
            onValueChange={(value) =>
              onDraftChange({
                ...draft,
                timezone: value as "Europe/Berlin" | "UTC",
              })
            }
            value={draft.timezone}
          >
            <SelectTrigger
              aria-labelledby="company-settings-timezone-label"
              id="company-settings-timezone"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Europe/Berlin">Europe/Berlin</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  );
}

function BookingSection({
  action,
  copy,
  draft,
  editing,
  errorMessage,
  onCancel,
  onDraftChange,
  onEdit,
  onSubmit,
  saving,
  successMessage,
}: {
  action?: CompanySettingsAction;
  copy: CompanySettingsCopy;
  draft: CompanySettingsBookingFormData;
  editing: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onDraftChange: (draft: CompanySettingsBookingFormData) => void;
  onEdit: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  saving: boolean;
  successMessage?: string | null;
}) {
  return (
    <form
      className="grid gap-5"
      id="company-settings-bookings"
      onSubmit={onSubmit}
    >
      <SectionHeader
        action={action}
        copy={copy}
        editable
        editing={editing}
        onCancel={onCancel}
        onEdit={onEdit}
        saving={saving}
        section="bookings"
      />
      <Feedback errorMessage={errorMessage} successMessage={successMessage} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="booking-lead-time">Vorlaufzeit in Minuten</Label>
          <Input
            disabled={!editing || saving}
            id="booking-lead-time"
            min={0}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                bookingMinimumLeadTimeMinutes:
                  event.currentTarget.valueAsNumber,
              })
            }
            type="number"
            value={
              Number.isNaN(draft.bookingMinimumLeadTimeMinutes)
                ? ""
                : draft.bookingMinimumLeadTimeMinutes
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="booking-cancellation-window">
            Storno-Fenster in Minuten
          </Label>
          <Input
            disabled={!editing || saving}
            id="booking-cancellation-window"
            min={0}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                cancellationWindowMinutes: event.currentTarget.valueAsNumber,
              })
            }
            type="number"
            value={
              Number.isNaN(draft.cancellationWindowMinutes)
                ? ""
                : draft.cancellationWindowMinutes
            }
          />
        </div>
      </div>
      <div className="grid gap-3">
        <ToggleRow
          checked={draft.allowGuestPassengers}
          description="Buchende dürfen Passagiere als freie Namen erfassen."
          disabled={!editing || saving}
          label="Gäste erlauben"
          onChange={(checked) =>
            onDraftChange({ ...draft, allowGuestPassengers: checked })
          }
        />
        <ToggleRow
          checked={draft.requirePassengerProfile}
          description="Passagiere müssen aus bekannten Company-Profilen gewählt werden."
          disabled={!editing || saving}
          label="Passagierprofil erforderlich"
          onChange={(checked) =>
            onDraftChange({ ...draft, requirePassengerProfile: checked })
          }
        />
        <ToggleRow
          checked={draft.requireCostCenter}
          description="Kostenstellen werden vorbereitet und später fachlich erzwungen."
          disabled={!editing || saving}
          label="Kostenstelle vorbereiten"
          onChange={(checked) =>
            onDraftChange({ ...draft, requireCostCenter: checked })
          }
        />
      </div>
    </form>
  );
}

function NotificationsSection({
  action,
  copy,
  draft,
  editing,
  errorMessage,
  onCancel,
  onDraftChange,
  onEdit,
  onSubmit,
  saving,
  successMessage,
}: {
  action?: CompanySettingsAction;
  copy: CompanySettingsCopy;
  draft: CompanySettingsNotificationsFormData;
  editing: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onDraftChange: (draft: CompanySettingsNotificationsFormData) => void;
  onEdit: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  saving: boolean;
  successMessage?: string | null;
}) {
  return (
    <form
      className="grid gap-5"
      id="company-settings-notifications"
      onSubmit={onSubmit}
    >
      <SectionHeader
        action={action}
        copy={copy}
        editable
        editing={editing}
        onCancel={onCancel}
        onEdit={onEdit}
        saving={saving}
        section="notifications"
      />
      <Feedback errorMessage={errorMessage} successMessage={successMessage} />
      <div className="grid gap-3">
        <ToggleRow
          checked={draft.notificationBookingUpdatesEnabled}
          description="Admins erhalten relevante Buchungsupdates im Workspace."
          disabled={!editing || saving}
          label="Buchungsupdates"
          onChange={(checked) =>
            onDraftChange({
              ...draft,
              notificationBookingUpdatesEnabled: checked,
            })
          }
        />
        <ToggleRow
          checked={draft.notificationBillingAlertsEnabled}
          description="Billing-Warnungen bleiben für berechtigte Rollen sichtbar."
          disabled={!editing || saving}
          label="Billing-Warnungen"
          onChange={(checked) =>
            onDraftChange({
              ...draft,
              notificationBillingAlertsEnabled: checked,
            })
          }
        />
      </div>
    </form>
  );
}

function ActionList({
  actions,
}: {
  actions: readonly (CompanySettingsAction | undefined)[];
}) {
  return (
    <div className="grid gap-3">
      {actions.map((action) => {
        if (!action) {
          return null;
        }

        const content = (
          <>
            <span className="min-w-0">
              <span className="block font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
                {action.label}
              </span>
              {action.reason ? (
                <span className="mt-0.5 block text-[12px] text-[var(--taxis-workspace-text-muted)]">
                  {action.reason}
                </span>
              ) : null}
            </span>
            {action.disabled ? (
              <span className="rounded-[10px] bg-[var(--taxis-workspace-surface-soft)] px-2.5 py-1 font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
                Gesperrt
              </span>
            ) : (
              <Check
                aria-hidden="true"
                className="text-[var(--taxis-status-success-text)]"
                size={18}
                strokeWidth={2}
              />
            )}
          </>
        );

        const className =
          "flex min-h-16 items-center justify-between gap-4 rounded-[18px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-4 py-3 text-left";
        const key = `${action.id}-${action.label}`;

        if (!action.disabled && action.href) {
          return (
            <a className={className} href={action.href} key={key}>
              {content}
            </a>
          );
        }

        return (
          <div className={cn(className, "opacity-80")} key={key}>
            {content}
          </div>
        );
      })}
    </div>
  );
}

function StaticSection({
  actions,
  copy,
  section,
}: {
  actions: readonly (CompanySettingsAction | undefined)[];
  copy: CompanySettingsCopy;
  section: CompanySettingsSectionId;
}) {
  return (
    <div className="grid gap-5">
      <SectionHeader
        copy={copy}
        editing={false}
        onCancel={() => undefined}
        onEdit={() => undefined}
        saving={false}
        section={section}
      />
      <ActionList actions={actions} />
    </div>
  );
}

export function CompanySettingsWorkspaceContent({
  activeSection,
  copy,
  errorMessage,
  onSectionChange,
  onUpdateBooking,
  onUpdateGeneral,
  onUpdateNotifications,
  payload,
  savingSection,
  successMessage,
}: CompanySettingsWorkspaceContentProps) {
  const [editingSection, setEditingSection] = useState<EditableSection | null>(
    null,
  );
  const drafts = useEditableDrafts(payload);
  const scopedError =
    savingSection === activeSection || savingSection === null
      ? errorMessage
      : null;
  const scopedSuccess =
    savingSection === activeSection || savingSection === null
      ? successMessage
      : null;
  const isSaving = savingSection === activeSection;

  function openSection(section: CompanySettingsSectionId) {
    setEditingSection(null);
    onSectionChange?.(section);
  }

  async function submitEditableSection(
    event: React.FormEvent<HTMLFormElement>,
    section: EditableSection,
  ) {
    event.preventDefault();

    if (section === "general") {
      try {
        await onUpdateGeneral?.(drafts.generalDraft);
        setEditingSection(null);
      } catch {
        return;
      }
      return;
    }

    if (section === "bookings") {
      try {
        await onUpdateBooking?.(drafts.bookingDraft);
        setEditingSection(null);
      } catch {
        return;
      }
      return;
    }

    try {
      await onUpdateNotifications?.(drafts.notificationDraft);
      setEditingSection(null);
    } catch {
      return;
    }
  }

  function cancelEditing(section: EditableSection) {
    if (section === "general") {
      drafts.resetGeneral();
    } else if (section === "bookings") {
      drafts.resetBooking();
    } else {
      drafts.resetNotifications();
    }

    setEditingSection(null);
  }

  return (
    <div className="taxis-company-workspace-content taxis-workspace-content-area">
      <div className="taxis-company-workspace-frame taxis-company-workspace-stack">
        <section className="taxis-company-page-header">
          <span className="taxis-company-page-eyebrow">
            <ShieldCheck aria-hidden="true" size={14} strokeWidth={1.9} />
            {payload.organizationName}
          </span>
          <h1 className="taxis-company-page-title">{copy.title}</h1>
          <p className="taxis-company-page-description">{copy.subtitle}</p>
        </section>

        <div className="taxis-company-settings-layout grid xl:grid-cols-[20rem_minmax(0,1fr)]">
          <WorkspaceSurface className="taxis-company-surface-primary taxis-company-settings-nav grid content-start p-3">
            {sectionItems.map((item) => (
              <SectionButton
                active={item.id === activeSection}
                description={copy[item.description]}
                icon={item.icon}
                key={item.id}
                onClick={() => openSection(item.id)}
                title={copy[item.title]}
              />
            ))}
          </WorkspaceSurface>

          <WorkspaceSurface className="taxis-company-surface-primary taxis-company-settings-panel p-5">
            {activeSection === "general" ? (
              <GeneralSection
                action={getAction(payload, "update_company_general_settings")}
                copy={copy}
                draft={drafts.generalDraft}
                editing={editingSection === "general"}
                errorMessage={scopedError}
                onCancel={() => cancelEditing("general")}
                onDraftChange={drafts.setGeneralDraft}
                onEdit={() => setEditingSection("general")}
                onSubmit={(event) => submitEditableSection(event, "general")}
                payload={payload}
                saving={isSaving}
                successMessage={scopedSuccess}
              />
            ) : null}
            {activeSection === "bookings" ? (
              <BookingSection
                action={getAction(payload, "update_company_booking_settings")}
                copy={copy}
                draft={drafts.bookingDraft}
                editing={editingSection === "bookings"}
                errorMessage={scopedError}
                onCancel={() => cancelEditing("bookings")}
                onDraftChange={drafts.setBookingDraft}
                onEdit={() => setEditingSection("bookings")}
                onSubmit={(event) => submitEditableSection(event, "bookings")}
                saving={isSaving}
                successMessage={scopedSuccess}
              />
            ) : null}
            {activeSection === "notifications" ? (
              <NotificationsSection
                action={getAction(
                  payload,
                  "update_company_notification_settings",
                )}
                copy={copy}
                draft={drafts.notificationDraft}
                editing={editingSection === "notifications"}
                errorMessage={scopedError}
                onCancel={() => cancelEditing("notifications")}
                onDraftChange={drafts.setNotificationDraft}
                onEdit={() => setEditingSection("notifications")}
                onSubmit={(event) =>
                  submitEditableSection(event, "notifications")
                }
                saving={isSaving}
                successMessage={scopedSuccess}
              />
            ) : null}
            {activeSection === "security" ? (
              <StaticSection
                actions={[
                  getAction(payload, "open_password_settings"),
                  getAction(payload, "open_roles_settings"),
                ]}
                copy={copy}
                section="security"
              />
            ) : null}
            {activeSection === "data" ? (
              <StaticSection
                actions={[
                  {
                    href: "/company-rides",
                    id: "open_audit_export",
                    label: "Buchungen öffnen",
                  },
                  getAction(payload, "open_billing"),
                  getAction(payload, "open_audit_export"),
                ]}
                copy={copy}
                section="data"
              />
            ) : null}
            {activeSection === "integrations" ? (
              <StaticSection
                actions={[
                  getAction(payload, "open_integrations"),
                  {
                    disabled: true,
                    id: "open_integrations",
                    label: "Kalender-Sync",
                    reason: "Kalender-Sync wird nach dem Settings-MVP geplant.",
                  },
                  {
                    disabled: true,
                    id: "open_integrations",
                    label: "Accounting Export",
                    reason: "Accounting-Anbindung kommt mit dem Billing-Slice.",
                  },
                ]}
                copy={copy}
                section="integrations"
              />
            ) : null}
          </WorkspaceSurface>
        </div>
      </div>
    </div>
  );
}
