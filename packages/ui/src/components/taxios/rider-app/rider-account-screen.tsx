import { useMemo } from "react";
import {
  Bell,
  Building2,
  ChevronRight,
  LifeBuoy,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import type {
  RiderAccountLink,
  RiderAccountPayload,
  RiderAccountTab,
  RiderAction,
  RiderAppCopy,
} from "../../../contracts/rider-app";
import { RiderActionButton, RiderSection } from "./rider-primitives";

/* =====================================================================
 * Rider — Konto
 *
 * Profile overview with personal and company tabs, settings links,
 * workspace switch and sign-out. The tab is controlled by the parent
 * (`activeTab` + `onTabChange`); all actions come from
 * `payload.allowedActions` / `payload.links`.
 *
 * How to wire with tRPC:
 *   const { data, isLoading, error } = trpc.rider.account.useQuery()
 *   <RiderAccountScreen payload={data} copy={copy}
 *     activeTab={tab} onTabChange={setTab} onAction={...} />
 * ===================================================================== */

const linkIcon: Record<RiderAccountLink["id"], React.ReactNode> = {
  contact_support: <LifeBuoy size={18} strokeWidth={2} />,
  open_notifications_settings: <Bell size={18} strokeWidth={2} />,
  open_privacy: <ShieldCheck size={18} strokeWidth={2} />,
};

export function RiderAccountScreen({
  activeTab,
  onAction,
  onTabChange,
  payload,
}: {
  activeTab: RiderAccountTab;
  copy?: RiderAppCopy;
  onAction?: (action: RiderAction) => void;
  onTabChange?: (tab: RiderAccountTab) => void;
  payload: RiderAccountPayload;
}) {
  const switchAction = useMemo(
    () => payload.allowedActions.find((action) => action.id === "switch_workspace"),
    [payload.allowedActions],
  );
  const signOutAction = useMemo(
    () => payload.allowedActions.find((action) => action.id === "sign_out"),
    [payload.allowedActions],
  );

  const fields = activeTab === "personal" ? payload.personalFields : payload.companyFields;

  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-center gap-3 pt-2">
        <span className="taxis-rider-avatar taxis-rider-avatar-lg" aria-hidden="true">
          {payload.profileInitials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-[18px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
            {payload.profileName}
          </p>
          <p className="truncate text-[13px] text-[var(--taxis-workspace-text-muted)]">
            {payload.profileRoleLabel}
          </p>
        </div>
      </div>

      <div className="taxis-rider-segmented" role="tablist" aria-label="Kontobereich">
        <button
          aria-selected={activeTab === "personal"}
          className="taxis-rider-segmented-item"
          data-active={activeTab === "personal"}
          onClick={() => onTabChange?.("personal")}
          role="tab"
          type="button"
        >
          Persönlich
        </button>
        <button
          aria-selected={activeTab === "company"}
          className="taxis-rider-segmented-item"
          data-active={activeTab === "company"}
          onClick={() => onTabChange?.("company")}
          role="tab"
          type="button"
        >
          Firma
        </button>
      </div>

      {activeTab === "company" ? (
        <div className="taxis-rider-callout flex items-center gap-2" data-tone="info">
          <Building2 aria-hidden="true" size={15} strokeWidth={2} />
          <span>
            {payload.companyMemberLabel} · {payload.companyWorkspaceLabel}
          </span>
        </div>
      ) : null}

      <RiderSection title={activeTab === "personal" ? "Profildaten" : "Firmendaten"}>
        <dl className="taxis-rider-card divide-y divide-[var(--taxis-workspace-divider)] px-4">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center justify-between gap-4 py-3">
              <dt className="font-medium text-[13px] text-[var(--taxis-workspace-text-muted)]">
                {field.label}
              </dt>
              <dd className="truncate text-right font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </RiderSection>

      <RiderSection title="Einstellungen">
        <ul className="taxis-rider-card divide-y divide-[var(--taxis-workspace-divider)]">
          {payload.links.map((link) => (
            <li key={link.id}>
              <button
                className="taxis-rider-link-row"
                onClick={() => {
                  const action = payload.allowedActions.find((item) => item.id === link.id);
                  if (action) onAction?.(action);
                }}
                type="button"
              >
                <span className="text-[var(--taxis-workspace-text-subtle)]">
                  {linkIcon[link.id]}
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)]">
                    {link.label}
                  </span>
                  <span className="block text-[12px] text-[var(--taxis-workspace-text-muted)]">
                    {link.description}
                  </span>
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="shrink-0 text-[var(--taxis-workspace-text-subtle)]"
                  size={18}
                />
              </button>
            </li>
          ))}
        </ul>
      </RiderSection>

      <RiderSection title="Arbeitsbereich">
        <div className="taxis-rider-card flex items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="truncate font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)]">
              {payload.currentWorkspaceLabel}
            </p>
            <p className="text-[12px] text-[var(--taxis-workspace-text-muted)]">
              Aktiver Arbeitsbereich
            </p>
          </div>
          {switchAction ? (
            <RiderActionButton
              action={switchAction}
              icon={<RefreshCw size={15} strokeWidth={2} />}
              onAction={onAction}
              variant="secondary"
            />
          ) : null}
        </div>
      </RiderSection>

      {signOutAction ? (
        <RiderActionButton
          action={signOutAction}
          fullWidth
          onAction={onAction}
          variant="ghost"
        />
      ) : null}
    </div>
  );
}
