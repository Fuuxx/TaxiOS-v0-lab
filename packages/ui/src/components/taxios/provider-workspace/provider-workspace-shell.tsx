import "../workspace/workspace.css";
import "../provider-inbox/provider-inbox.css";

import type React from "react";
import {
  BarChart3,
  Building2,
  CarFront,
  Route,
  Settings,
  SquareCheckBig,
  UserRoundCog,
  type LucideIcon,
} from "lucide-react";

import { WorkspaceSurface } from "../workspace/workspace-primitives";

export type ProviderWorkspaceNavItemId =
  | "order_pool"
  | "driver_pool"
  | "vehicles"
  | "drivers"
  | "reports"
  | "settings";

type ProviderWorkspaceNavItem = {
  href?: string;
  icon: LucideIcon;
  id: ProviderWorkspaceNavItemId;
  label: string;
};

export type ProviderWorkspaceShellProps = {
  activeItem: ProviderWorkspaceNavItemId;
  children: React.ReactNode;
  orderPoolBadgeCount?: number;
  organizationName: string;
  sessionAction?: React.ReactNode;
};

const providerWorkspaceNavItems: readonly ProviderWorkspaceNavItem[] = [
  {
    href: "/provider-inbox",
    icon: Route,
    id: "order_pool",
    label: "Order Pool",
  },
  {
    icon: SquareCheckBig,
    id: "driver_pool",
    label: "Driver Pool",
  },
  {
    href: "/provider-fleet",
    icon: CarFront,
    id: "vehicles",
    label: "Vehicles",
  },
  {
    href: "/provider-drivers",
    icon: UserRoundCog,
    id: "drivers",
    label: "Drivers",
  },
  {
    icon: BarChart3,
    id: "reports",
    label: "Reports",
  },
  {
    icon: Settings,
    id: "settings",
    label: "Settings",
  },
];

function ProviderWorkspaceLogo() {
  return (
    <div
      className="flex items-baseline font-extrabold text-3xl tracking-tighter"
      style={{ transform: "scaleY(1.03)" }}
    >
      <span className="text-zinc-900">Taxi</span>
      <span className="text-[var(--taxis-workspace-accent)]">OS</span>
    </div>
  );
}

function ProviderWorkspaceSidebarItem({
  active = false,
  badge,
  href,
  icon: Icon,
  label,
}: {
  active?: boolean;
  badge?: string;
  href?: string;
  icon: LucideIcon;
  label: string;
}) {
  const className = `taxis-workspace-nav-row group relative mb-1.5 flex w-full items-center justify-between rounded-[15px] px-3.5 py-2 outline-none ${
    active ? "taxis-workspace-nav-row-active" : ""
  }`;
  const content = (
    <>
      {active ? <span className="taxis-workspace-nav-active" /> : null}
      <span className="relative z-10 flex items-center gap-3">
        <span className="taxis-workspace-nav-icon" aria-hidden="true">
          <Icon size={15} strokeWidth={1.9} />
        </span>
        <span
          className={`text-[13.5px] tracking-tight transition-colors duration-200 ${
            active
              ? "font-semibold text-zinc-900"
              : "font-medium text-zinc-600 group-hover:text-zinc-900"
          }`}
        >
          {label}
        </span>
      </span>
      {badge ? (
        <span className="relative z-10 inline-flex h-[20px] min-w-[20px] items-center justify-center rounded-md bg-zinc-900/90 px-1.5 font-semibold text-[10px] text-white tabular-nums shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          {badge}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a
        aria-current={active ? "page" : undefined}
        className={className}
        href={href}
      >
        {content}
      </a>
    );
  }

  return (
    <span
      aria-current={active ? "page" : undefined}
      aria-disabled="true"
      className={`${className} cursor-default`}
    >
      {content}
    </span>
  );
}

function ProviderWorkspaceSidebar({
  activeItem,
  orderPoolBadgeCount = 0,
  organizationName,
  sessionAction,
}: {
  activeItem: ProviderWorkspaceNavItemId;
  orderPoolBadgeCount?: number;
  organizationName: string;
  sessionAction?: React.ReactNode;
}) {
  return (
    <aside className="relative z-20 hidden w-[280px] shrink-0 flex-col p-6 pr-0 xl:flex">
      <WorkspaceSurface className="taxis-workspace-sidebar-shell flex h-full flex-col overflow-hidden">
        <div className="flex h-28 shrink-0 items-center px-7">
          <ProviderWorkspaceLogo />
        </div>

        <div className="mb-7 px-4">
          <div className="taxios-provider-sidebar-context flex items-center gap-3 rounded-[16px] px-3.5 py-3">
            <span className="taxios-provider-sidebar-context-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
              <Building2 aria-hidden="true" size={16} strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-[13px] text-zinc-900">
                {organizationName}
              </p>
              <p className="truncate font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
                Provider workspace
              </p>
            </div>
          </div>
        </div>

        <nav
          aria-label="Provider navigation"
          className="flex-1 overflow-y-auto px-4"
        >
          <p className="taxis-workspace-sidebar-section-label">Provider</p>
          <div className="space-y-0.5">
            {providerWorkspaceNavItems.map((item) => (
              <ProviderWorkspaceSidebarItem
                active={item.id === activeItem}
                badge={
                  item.id === "order_pool" && orderPoolBadgeCount > 0
                    ? String(orderPoolBadgeCount)
                    : undefined
                }
                href={item.href}
                icon={item.icon}
                key={item.id}
                label={item.label}
              />
            ))}
          </div>
        </nav>
        {sessionAction ? (
          <div className="border-t border-[var(--taxis-workspace-border)] px-4 pb-4 pt-4">
            {sessionAction}
          </div>
        ) : null}
      </WorkspaceSurface>
    </aside>
  );
}

export function ProviderWorkspaceShell({
  activeItem,
  children,
  orderPoolBadgeCount,
  organizationName,
  sessionAction,
}: ProviderWorkspaceShellProps) {
  return (
    <div className="taxis-workspace-ambient taxios-provider-inbox-ambient relative min-h-dvh overflow-hidden text-[var(--taxis-workspace-text-primary)]">
      <div className="taxis-workspace-ambient-bg" />
      <div className="relative z-10 flex h-dvh overflow-hidden">
        <ProviderWorkspaceSidebar
          activeItem={activeItem}
          orderPoolBadgeCount={orderPoolBadgeCount}
          organizationName={organizationName}
          sessionAction={sessionAction}
        />
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
