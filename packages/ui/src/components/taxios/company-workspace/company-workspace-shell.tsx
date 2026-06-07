import "../workspace/workspace.css";
import "./company-workspace.css";

import {
  BarChart3,
  Bell,
  Building2,
  Car,
  ChevronRight,
  KeyRound,
  LayoutDashboard,
  Mail,
  Plus,
  Search,
  Settings,
  Upload,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type React from "react";

import { CompanyWorkspaceSurface } from "./company-workspace-primitives";
import {
  WorkspaceAccountCard,
  WorkspaceAvatar,
} from "../workspace/workspace-avatar";

export type CompanyWorkspaceNavItemId =
  | "dashboard"
  | "finance"
  | "organization"
  | "reports"
  | "rides"
  | "settings";

export type CompanyWorkspaceLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  href: string;
};

export type CompanyWorkspaceLinkComponent =
  React.ComponentType<CompanyWorkspaceLinkProps>;

type CompanyWorkspaceNavItem = {
  badge?: string;
  href?: string;
  icon: LucideIcon;
  id: CompanyWorkspaceNavItemId;
  label: string;
};

export type CompanyWorkspaceShellProps = {
  activeItem: CompanyWorkspaceNavItemId;
  activeContextSwitcher?: React.ReactNode;
  children: React.ReactNode;
  linkComponent?: CompanyWorkspaceLinkComponent;
  newBookingLabel?: string;
  notificationsComponent?: React.ReactNode;
  notificationsLabel?: string;
  onNewBookingClick?: () => void;
  organizationName: string;
  currentRouteLabel?: string;
  routeLabels?: Partial<Record<CompanyWorkspaceNavItemId, string>>;
  searchComponent?: React.ReactNode | false;
  searchPlaceholder?: string;
  sessionAction?: React.ReactNode;
  topbarExtra?: React.ReactNode;
  userEmail?: string;
  userFirstName?: string;
  userImageUrl?: string;
  userInitials?: string;
  userLabel?: string;
  userLastName?: string;
  userPublicId?: string | null;
  userRoleLabel?: string;
  visibleNavigation?: readonly CompanyWorkspaceNavItemId[];
};

const defaultRouteLabels: Record<CompanyWorkspaceNavItemId, string> = {
  dashboard: "Dashboard",
  finance: "Finanzen",
  organization: "Organisation",
  reports: "Berichte",
  rides: "Buchungen",
  settings: "Einstellungen",
};

const companyWorkspaceNavItems: readonly CompanyWorkspaceNavItem[] = [
  {
    href: "/company-dashboard",
    icon: LayoutDashboard,
    id: "dashboard",
    label: "Dashboard",
  },
  {
    href: "/company-rides",
    icon: Car,
    id: "rides",
    label: "Buchungen",
  },
];

const companyWorkspaceOrganizationItems: readonly CompanyWorkspaceNavItem[] = [
  {
    href: "/company-organization",
    icon: Building2,
    id: "organization",
    label: "Organisation",
  },
  {
    href: "/company-reports",
    icon: BarChart3,
    id: "reports",
    label: "Berichte",
  },
  {
    href: "/company-finance",
    icon: Wallet,
    id: "finance",
    label: "Finanzen",
  },
];

const companyWorkspaceSidebarItems: readonly CompanyWorkspaceNavItem[] = [
  ...companyWorkspaceNavItems,
  ...companyWorkspaceOrganizationItems,
];

function CompanyWorkspaceLogo() {
  return (
    <div
      className="flex items-baseline font-extrabold text-[34px] tracking-tighter"
      style={{ transform: "scaleY(1.03)" }}
    >
      <span className="text-zinc-900">Taxi</span>
      <span className="text-[var(--taxis-workspace-accent)]">OS</span>
    </div>
  );
}

function CompanyWorkspaceSidebarItem({
  active = false,
  badge,
  href,
  icon: Icon,
  label,
  linkComponent: LinkComponent,
}: {
  active?: boolean;
  badge?: string;
  href?: string;
  icon: LucideIcon;
  label: string;
  linkComponent?: CompanyWorkspaceLinkComponent;
}) {
  const className = `taxis-workspace-nav-row group relative mb-1.5 flex w-full items-center justify-between rounded-[16px] px-3.5 py-2.5 outline-none 2xl:px-4 2xl:py-3 ${
    active ? "taxis-workspace-nav-row-active" : ""
  }`;
  const content = (
    <>
      {active ? <span className="taxis-workspace-nav-active" /> : null}
      <span className="relative z-10 flex items-center gap-3">
        <span className="taxis-workspace-nav-icon" aria-hidden="true">
          <Icon size={16} strokeWidth={1.9} />
        </span>
        <span
          className={`text-[14.5px] tracking-tight transition-colors duration-200 ${
            active
              ? "font-semibold text-zinc-900"
              : "font-medium text-zinc-600 group-hover:text-zinc-900"
          }`}
        >
          {label}
        </span>
      </span>
      {badge ? (
        <span className="relative z-10 inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-md bg-zinc-900/90 px-1.5 font-semibold text-[11px] text-white tabular-nums shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          {badge}
        </span>
      ) : null}
    </>
  );

  if (href) {
    if (LinkComponent) {
      return (
        <LinkComponent
          aria-current={active ? "page" : undefined}
          className={className}
          href={href}
        >
          {content}
        </LinkComponent>
      );
    }

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

function CompanyWorkspaceSidebar({
  activeItem,
  linkComponent,
  newBookingLabel = "Neue Buchung",
  onNewBookingClick,
  organizationName,
  visibleNavigation,
}: {
  activeItem: CompanyWorkspaceNavItemId;
  linkComponent?: CompanyWorkspaceLinkComponent;
  newBookingLabel?: string;
  onNewBookingClick?: () => void;
  organizationName: string;
  visibleNavigation: readonly CompanyWorkspaceNavItemId[];
}) {
  const visibleItems = companyWorkspaceSidebarItems.filter((item) =>
    visibleNavigation.includes(item.id),
  );
  const canViewSettings = visibleNavigation.includes("settings");

  return (
    <aside className="relative z-20 hidden w-[clamp(292px,16vw,344px)] shrink-0 flex-col p-[clamp(1.5rem,1.25vw,1.75rem)] pr-0 xl:flex">
      <CompanyWorkspaceSurface className="taxis-workspace-sidebar-shell flex h-full flex-col overflow-hidden">
        <div className="flex h-28 shrink-0 items-center px-7 2xl:h-32 2xl:px-8">
          <CompanyWorkspaceLogo />
        </div>

        {onNewBookingClick ? (
          <div className="mb-7 px-4 2xl:mb-8 2xl:px-5">
            <button
              className="taxios-new-booking group relative flex w-full items-center rounded-[14px] py-3 pl-4 pr-5 text-left text-white 2xl:py-3.5"
              onClick={onNewBookingClick}
              type="button"
            >
              <span
                aria-hidden="true"
                className="taxios-new-booking-iconwrap relative z-10"
              >
                <Plus
                  className="taxios-new-booking-icon"
                  size={16}
                  strokeWidth={2.3}
                />
              </span>
              <span className="relative z-10 ml-3 font-semibold text-[14px] tracking-tight">
                {newBookingLabel}
              </span>
            </button>
          </div>
        ) : null}

        <nav
          aria-label="Company navigation"
          className="flex-1 overflow-y-auto px-4 2xl:px-5"
        >
          <div className="space-y-0.5">
            {visibleItems.map((item) => (
              <CompanyWorkspaceSidebarItem
                active={item.id === activeItem}
                badge={item.badge}
                href={item.href}
                icon={item.icon}
                key={item.id}
                label={item.label}
                linkComponent={linkComponent}
              />
            ))}
          </div>
        </nav>

        <div className="taxis-workspace-sidebar-footer mt-auto">
          {canViewSettings ? (
            <CompanyWorkspaceSidebarItem
              active={activeItem === "settings"}
              href="/company-settings"
              icon={Settings}
              label="Einstellungen"
              linkComponent={linkComponent}
            />
          ) : null}
          <WorkspaceAccountCard
            className="mt-3 cursor-pointer"
            subtitle="Geschäftskonto"
            title={organizationName}
          />
        </div>
      </CompanyWorkspaceSurface>
    </aside>
  );
}

function CompanyWorkspaceUserMenu({
  activeContextSwitcher,
  canViewCompanySettings,
  linkComponent: LinkComponent,
  sessionAction,
  userEmail,
  userFirstName,
  userImageUrl,
  userInitials,
  userLabel,
  userLastName,
  userPublicId,
  userRoleLabel,
  workspaceName,
}: {
  activeContextSwitcher?: React.ReactNode;
  canViewCompanySettings: boolean;
  linkComponent?: CompanyWorkspaceLinkComponent;
  sessionAction?: React.ReactNode;
  userEmail?: string;
  userFirstName?: string;
  userImageUrl?: string;
  userInitials: string;
  userLabel?: string;
  userLastName?: string;
  userPublicId?: string | null;
  userRoleLabel?: string;
  workspaceName: string;
}) {
  const avatarLabel = userLabel
    ? `Angemeldeter Benutzer: ${userLabel}`
    : "Angemeldeter Benutzer";
  const profileName =
    [userFirstName, userLastName].filter(Boolean).join(" ").trim() ||
    userLabel ||
    userInitials;
  const profileEmail =
    userEmail ?? (userLabel?.includes("@") ? userLabel : undefined);
  const profileFallback = "Nicht hinterlegt";
  const companySettings = (
    <span className="flex items-center gap-2">
      <Settings aria-hidden="true" size={15} strokeWidth={1.9} />
      <span>Company Einstellungen</span>
    </span>
  );
  const passwordSettings = (
    <span className="flex items-center gap-2">
      <KeyRound aria-hidden="true" size={15} strokeWidth={1.9} />
      <span>Passwort ändern</span>
    </span>
  );

  const menuId = "company-workspace-user-menu";

  return (
    <details className="group relative shrink-0">
      <summary
        aria-controls={menuId}
        aria-haspopup="menu"
        aria-label={avatarLabel}
        className="taxis-workspace-topbar-avatar list-none cursor-pointer"
        id="company-workspace-user-trigger"
        title={userLabel}
      >
        {userInitials}
      </summary>
      <div
        className="absolute top-[calc(100%+0.75rem)] right-0 z-50 w-[24rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[22px] border border-[var(--taxis-workspace-border)] bg-white/96 p-2 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.58)] backdrop-blur-xl"
        id={menuId}
      >
        <div className="border-[var(--taxis-workspace-border)] border-b px-3 py-3">
          <p className="truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
            {userLabel ?? userInitials}
          </p>
          <p className="mt-0.5 font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
            Benutzerkonto
          </p>
        </div>
        {activeContextSwitcher ? (
          <div className="taxis-user-menu-context border-[var(--taxis-workspace-border)] border-b px-1 py-2">
            {activeContextSwitcher}
          </div>
        ) : null}
        <div className="grid gap-1 py-2">
          <details className="taxis-user-profile-details">
            <summary
              aria-controls="company-workspace-profile-panel"
              aria-haspopup="menu"
              className="taxis-user-profile-summary flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-[13px] px-3 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)] transition-colors hover:bg-[var(--taxis-workspace-surface-soft)] hover:text-[var(--taxis-workspace-text-primary)]"
              id="company-workspace-profile-trigger"
            >
              <UserRound aria-hidden="true" size={15} strokeWidth={1.9} />
              <span>Mein Profil</span>
              <ChevronRight
                aria-hidden="true"
                className="taxis-user-profile-chevron ml-auto"
                size={14}
                strokeWidth={1.9}
              />
            </summary>
            <div
              className="taxis-user-profile-panel mt-1 rounded-[18px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-3"
              id="company-workspace-profile-panel"
            >
              <div className="flex items-center gap-3">
                {userImageUrl ? (
                  <img
                    alt={profileName}
                    className="taxis-user-profile-image h-14 w-14 shrink-0 rounded-full object-cover"
                    src={userImageUrl}
                  />
                ) : (
                  <WorkspaceAvatar
                    className="h-14 w-14 shrink-0"
                    initials={userInitials}
                    name={profileName}
                  />
                )}
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)]">
                    {profileName}
                  </p>
                  <p className="mt-0.5 flex min-w-0 items-center gap-1.5 truncate font-medium text-[11.5px] text-[var(--taxis-workspace-text-muted)]">
                    <Mail aria-hidden="true" size={13} strokeWidth={1.9} />
                    <span className="truncate">
                      {profileEmail ?? profileFallback}
                    </span>
                  </p>
                  {userPublicId ? (
                    <p className="mt-1 font-mono font-semibold text-[10.5px] text-[var(--taxis-workspace-text-muted)] tracking-[0.12em]">
                      {userPublicId}
                    </p>
                  ) : null}
                </div>
              </div>

              <dl className="mt-3 grid gap-2 rounded-[14px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface-soft)] p-3">
                <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-2">
                  <dt className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.12em]">
                    Vorname
                  </dt>
                  <dd className="truncate font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)]">
                    {userFirstName ?? profileFallback}
                  </dd>
                </div>
                <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-2">
                  <dt className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.12em]">
                    Nachname
                  </dt>
                  <dd className="truncate font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)]">
                    {userLastName ?? profileFallback}
                  </dd>
                </div>
                <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-2">
                  <dt className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.12em]">
                    Workspace
                  </dt>
                  <dd className="truncate font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)]">
                    {workspaceName}
                  </dd>
                </div>
                <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-2">
                  <dt className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.12em]">
                    Rolle
                  </dt>
                  <dd className="truncate font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)]">
                    {userRoleLabel ?? profileFallback}
                  </dd>
                </div>
              </dl>

              <div className="mt-3 grid gap-2">
                <label className="taxis-user-profile-action flex min-h-10 cursor-pointer items-center gap-2 rounded-[13px] px-3 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)] transition-colors hover:bg-[var(--taxis-workspace-surface-soft)] hover:text-[var(--taxis-workspace-text-primary)]">
                  <Upload aria-hidden="true" size={15} strokeWidth={1.9} />
                  <span>Profilbild hochladen oder bearbeiten</span>
                  <input
                    accept="image/*"
                    aria-label="Profilbild hochladen oder bearbeiten"
                    className="sr-only"
                    type="file"
                  />
                </label>
                {LinkComponent ? (
                  <LinkComponent
                    className="taxis-user-profile-action flex min-h-10 items-center rounded-[13px] px-3 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)] transition-colors hover:bg-[var(--taxis-workspace-surface-soft)] hover:text-[var(--taxis-workspace-text-primary)]"
                    href="/company-settings?section=security"
                  >
                    {passwordSettings}
                  </LinkComponent>
                ) : (
                  <a
                    className="taxis-user-profile-action flex min-h-10 items-center rounded-[13px] px-3 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)] transition-colors hover:bg-[var(--taxis-workspace-surface-soft)] hover:text-[var(--taxis-workspace-text-primary)]"
                    href="/company-settings?section=security"
                  >
                    {passwordSettings}
                  </a>
                )}
              </div>
            </div>
          </details>
          {canViewCompanySettings ? (
            LinkComponent ? (
              <LinkComponent
                className="flex min-h-10 items-center rounded-[13px] px-3 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)] transition-colors hover:bg-[var(--taxis-workspace-surface-soft)] hover:text-[var(--taxis-workspace-text-primary)]"
                href="/company-settings"
              >
                {companySettings}
              </LinkComponent>
            ) : (
              <a
                className="flex min-h-10 items-center rounded-[13px] px-3 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)] transition-colors hover:bg-[var(--taxis-workspace-surface-soft)] hover:text-[var(--taxis-workspace-text-primary)]"
                href="/company-settings"
              >
                {companySettings}
              </a>
            )
          ) : null}
        </div>
        {sessionAction ? (
          <div className="border-[var(--taxis-workspace-border)] border-t p-2">
            {sessionAction}
          </div>
        ) : null}
      </div>
    </details>
  );
}

export function CompanyWorkspaceShell({
  activeItem,
  activeContextSwitcher,
  children,
  linkComponent,
  newBookingLabel = "Neue Buchung",
  notificationsComponent,
  notificationsLabel = "Benachrichtigungen",
  onNewBookingClick,
  organizationName,
  currentRouteLabel,
  routeLabels,
  searchComponent,
  searchPlaceholder = "Suchen...",
  sessionAction,
  topbarExtra,
  userEmail,
  userFirstName,
  userImageUrl,
  userInitials,
  userLabel,
  userLastName,
  userPublicId,
  userRoleLabel,
  visibleNavigation = [
    "dashboard",
    "rides",
    "organization",
    "reports",
    "finance",
    "settings",
  ],
}: CompanyWorkspaceShellProps) {
  const activeRouteLabel =
    currentRouteLabel ??
    routeLabels?.[activeItem] ??
    defaultRouteLabels[activeItem];

  return (
    <div className="taxis-workspace-ambient taxios-company-workspace-ambient relative min-h-dvh overflow-hidden text-[var(--taxis-workspace-text-primary)]">
      <div className="taxis-workspace-ambient-bg" />
      <div className="relative z-10 flex h-dvh overflow-hidden">
        <CompanyWorkspaceSidebar
          activeItem={activeItem}
          linkComponent={linkComponent}
          newBookingLabel={newBookingLabel}
          onNewBookingClick={onNewBookingClick}
          organizationName={organizationName}
          visibleNavigation={visibleNavigation}
        />
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-0"
          >
            <div className="taxis-workspace-blob-orange" />
            <div className="taxis-workspace-blob-blue" />
          </div>

          <div className="taxis-workspace-scrollbar relative flex-1 overflow-y-auto overflow-x-hidden">
            <header className="taxis-workspace-topbar z-30 flex min-h-20 shrink-0 flex-col gap-4 px-6 py-5 xl:grid xl:min-h-[88px] xl:items-center xl:px-10 2xl:px-11">
              <div className="taxis-workspace-topbar-breadcrumb flex min-w-0 items-center gap-2 font-semibold text-[14px] text-zinc-600 tracking-tight">
                <span className="text-[var(--taxis-workspace-text-muted)]">
                  {organizationName}
                </span>
                <ChevronRight className="opacity-40" size={14} />
                <span className="font-semibold text-[16px] text-zinc-900">
                  {activeRouteLabel}
                </span>
              </div>
              {searchComponent !== false ? (
                <div className="taxis-workspace-topbar-search-slot group relative min-w-0 w-full">
                  {searchComponent ?? (
                    <>
                      <Search
                        className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-4 text-[var(--taxis-workspace-text-muted)] transition-colors duration-200 group-focus-within:text-[var(--taxis-workspace-accent-strong)]"
                        size={18}
                        strokeWidth={2}
                      />
                      <input
                        aria-label={searchPlaceholder}
                        className="taxis-workspace-topbar-search w-full rounded-2xl py-3.5 pr-6 pl-11 font-medium text-[14px] text-zinc-800 outline-none"
                        placeholder={searchPlaceholder}
                        type="text"
                      />
                    </>
                  )}
                </div>
              ) : (
                <div
                  aria-hidden="true"
                  className="taxis-workspace-topbar-search-slot hidden xl:block"
                />
              )}
              <div className="taxis-workspace-topbar-actions flex w-full flex-wrap items-center gap-3 xl:w-auto xl:justify-end xl:gap-4 2xl:gap-5">
                {onNewBookingClick ? (
                  <button
                    className="taxios-new-booking group relative flex items-center rounded-[14px] py-3 pr-5 pl-4 text-left text-white xl:hidden"
                    onClick={onNewBookingClick}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      className="taxios-new-booking-iconwrap relative z-10"
                    >
                      <Plus
                        className="taxios-new-booking-icon"
                        size={16}
                        strokeWidth={2.3}
                      />
                    </span>
                    <span className="relative z-10 ml-3 font-semibold text-[14px] tracking-tight">
                      {newBookingLabel}
                    </span>
                  </button>
                ) : null}
                {topbarExtra ? (
                  <div className="shrink-0">{topbarExtra}</div>
                ) : null}
                {notificationsComponent ?? (
                  <button
                    aria-label={notificationsLabel}
                    className="taxis-workspace-topbar-pill group taxis-workspace-ease-standard relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300"
                    type="button"
                  >
                    <Bell
                      className="text-zinc-700 transition-colors group-hover:text-zinc-900"
                      size={19}
                      strokeWidth={1.9}
                    />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border-2 border-white bg-[var(--taxis-workspace-accent-strong)] shadow-sm" />
                  </button>
                )}
                {userInitials ? (
                  <CompanyWorkspaceUserMenu
                    activeContextSwitcher={activeContextSwitcher}
                    canViewCompanySettings={visibleNavigation.includes(
                      "settings",
                    )}
                    linkComponent={linkComponent}
                    sessionAction={sessionAction}
                    userEmail={userEmail}
                    userFirstName={userFirstName}
                    userImageUrl={userImageUrl}
                    userInitials={userInitials}
                    userLabel={userLabel}
                    userLastName={userLastName}
                    userPublicId={userPublicId}
                    userRoleLabel={userRoleLabel}
                    workspaceName={organizationName}
                  />
                ) : null}
              </div>
            </header>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
