import "../workspace/workspace.css";
import "../provider-inbox/provider-inbox.css";

import type React from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Inbox,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { cn } from "../../../lib/utils";
import { workspaceChipClassForTone } from "../workspace/workspace-status";

export type DriverWorkspaceNavItemId = "jobs" | "pool";

export type DriverWorkspaceShellProps = {
  activeContextSwitcher?: React.ReactNode;
  activeItem: DriverWorkspaceNavItemId;
  children: React.ReactNode;
  organizationName: string;
  sessionAction?: React.ReactNode;
  title: string;
  vehicleSessionControl?: React.ReactNode;
};

const driverWorkspaceNavItems: readonly {
  href: string;
  icon: LucideIcon;
  id: DriverWorkspaceNavItemId;
  label: string;
}[] = [
  {
    href: "/driver-jobs",
    icon: BriefcaseBusiness,
    id: "jobs",
    label: "Meine Jobs",
  },
  {
    href: "/driver-pool",
    icon: Inbox,
    id: "pool",
    label: "Driver Pool",
  },
];

function DriverWorkspaceNav({ activeItem }: { activeItem: DriverWorkspaceNavItemId }) {
  return (
    <nav
      aria-label="Driver navigation"
      className="flex min-w-0 flex-wrap items-center gap-2"
    >
      {driverWorkspaceNavItems.map((item) => {
        const Icon = item.icon;
        const active = item.id === activeItem;

        return (
          <a
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 font-semibold text-[12px] tracking-normal transition-colors",
              active
                ? "border-zinc-900 bg-zinc-950 text-white"
                : "border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] text-[var(--taxis-workspace-text-secondary)] hover:text-zinc-950",
            )}
            href={item.href}
            key={item.id}
          >
            <Icon aria-hidden="true" size={14} strokeWidth={1.9} />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

export function DriverWorkspaceShell({
  activeContextSwitcher,
  activeItem,
  children,
  organizationName,
  sessionAction,
  title,
  vehicleSessionControl,
}: DriverWorkspaceShellProps) {
  return (
    <div className="taxis-workspace-ambient taxios-provider-inbox-ambient relative min-h-dvh overflow-hidden text-[var(--taxis-workspace-text-primary)]">
      <div className="taxis-workspace-ambient-bg" />
      <div className="relative z-10 flex h-dvh overflow-hidden">
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="taxis-workspace-topbar taxios-provider-topbar z-30 flex min-h-20 shrink-0 flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between xl:h-20 xl:px-8 xl:py-0">
            <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex min-w-0 items-center gap-2 font-semibold text-[13.5px] text-zinc-600 tracking-normal">
                <span className="text-[var(--taxis-workspace-text-muted)]">
                  TaxiOS
                </span>
                <ArrowRight aria-hidden="true" className="opacity-40" size={14} />
                <span className="min-w-0 truncate text-[var(--taxis-workspace-text-muted)]">
                  {organizationName}
                </span>
                <ArrowRight aria-hidden="true" className="opacity-40" size={14} />
                <span className="font-semibold text-[15px] text-zinc-900">
                  {title}
                </span>
              </div>
              <DriverWorkspaceNav activeItem={activeItem} />
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end lg:gap-4">
              {vehicleSessionControl ? (
                <div className="w-full min-w-0 sm:w-auto">
                  {vehicleSessionControl}
                </div>
              ) : null}
              {activeContextSwitcher ? (
                <div className="w-full min-w-0 sm:w-auto">
                  {activeContextSwitcher}
                </div>
              ) : null}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    workspaceChipClassForTone("success", "md"),
                    "taxis-system-chip h-10 gap-2 px-4 uppercase tracking-normal",
                  )}
                >
                  <ShieldCheck aria-hidden="true" size={14} strokeWidth={1.9} />
                  Driver context
                </span>
                {sessionAction ? (
                  <div className="shrink-0">{sessionAction}</div>
                ) : null}
              </div>
            </div>
          </header>

          <div className="taxis-workspace-scrollbar relative flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
