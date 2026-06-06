import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  Car,
  ChevronRight,
  Grid2X2,
  Plus,
  Search,
  Settings,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";

import {
  dashboardCopy,
  fastRoutes,
  feedItems,
  rides,
  type StatusTone,
} from "../data/company-dashboard-data";

const navItems = [
  { label: "Dashboard", icon: Grid2X2, active: true },
  { label: "Buchungen", icon: BriefcaseBusiness },
  { label: "Organisation", icon: Building2 },
  { label: "Berichte", icon: BarChart3 },
  { label: "Finanzen", icon: WalletCards },
];

function Avatar({ value, extra = false }: { value: string; extra?: boolean }) {
  return (
    <span className={extra ? "mirror-avatar mirror-avatar-extra" : "mirror-avatar"}>
      {value}
    </span>
  );
}

function AvatarStack({ values }: { values: readonly string[] }) {
  return (
    <div className="mirror-avatar-stack">
      {values.map((value) =>
        value.startsWith("+") ? (
          <Avatar extra key={value} value={value} />
        ) : (
          <Avatar key={value} value={value} />
        ),
      )}
    </div>
  );
}

function StatusChip({ label, tone }: { label: string; tone: StatusTone }) {
  return <span className={`mirror-status mirror-status-${tone}`}>{label}</span>;
}

function FastRouteCard({ route }: { route: (typeof fastRoutes)[number] }) {
  return (
    <article className="mirror-fast-card">
      <div className="mirror-fast-card-aura" />
      <div className="mirror-fast-card-inner">
        <div className="mirror-fast-card-body">
          <div className="mirror-fast-card-top">
            <div className="mirror-fast-card-copy">
              <p className="mirror-card-eyebrow">Schnellbuchung</p>
              <h3>{route.title}</h3>
            </div>
            <span className="mirror-passenger-count">
              <Users size={14} aria-hidden="true" />
              {route.passengerCount}
            </span>
          </div>

          <div className="mirror-route-line">
            <div className="mirror-route-entry">
              <span className="mirror-route-label">Von</span>
              <span className="mirror-route-dot" aria-hidden="true" />
              <span className="mirror-route-place">{route.from}</span>
            </div>
            <div className="mirror-route-entry mirror-route-entry-end">
              <span className="mirror-route-label">Nach</span>
              <span className="mirror-route-dot mirror-route-dot-end" aria-hidden="true" />
              <span className="mirror-route-place">{route.to}</span>
            </div>
          </div>
        </div>

        <div className="mirror-fast-card-footer">
          <div className="mirror-fast-footer-avatars">
            <AvatarStack values={route.passengerInitials} />
            <span className="mirror-avatar-add">
              <UserPlus size={17} aria-hidden="true" />
            </span>
          </div>
          <button className="mirror-card-action" type="button" aria-label="Mitarbeiterauswahl öffnen">
            <Plus size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

function NewRoutePane() {
  return (
    <aside className="mirror-new-route">
      <p className="mirror-card-eyebrow">Fastbooking</p>
      <h3>Neue Route</h3>
      <div className="mirror-form">
        <label>
          <span>Titel der Route</span>
          <input placeholder="z. B. Kundentermin Mitte" readOnly />
        </label>
        <label>
          <span>Abholort (Von)</span>
          <input placeholder="Adresse eingeben" readOnly />
        </label>
        <label>
          <span>Zielort (Nach)</span>
          <input placeholder="Adresse eingeben" readOnly />
        </label>
        <button className="mirror-neutral-button" type="button">
          Route speichern
        </button>
      </div>
    </aside>
  );
}

function RideTable() {
  return (
    <div className="mirror-table-wrap">
      <table className="mirror-rides-table">
        <colgroup>
          <col className="mirror-col-time" />
          <col className="mirror-col-passengers" />
          <col className="mirror-col-route" />
          <col className="mirror-col-id" />
          <col className="mirror-col-status" />
        </colgroup>
        <thead>
          <tr>
            <th>Zeit</th>
            <th>Passagiere</th>
            <th>Route</th>
            <th>ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rides.map((ride) => (
            <tr key={ride.id}>
              <td>
                <span className="mirror-data mirror-ride-time">{ride.time}</span>
                <span className="mirror-day">{ride.day}</span>
              </td>
              <td>
                <AvatarStack
                  values={[
                    ...ride.passengers,
                    ...(ride.extraPassengers ? [`+${ride.extraPassengers}`] : []),
                  ]}
                />
              </td>
              <td>
                <div className="mirror-ride-route">
                  <span className="mirror-ride-from">{ride.from}</span>
                  <span className="mirror-ride-to">{ride.to}</span>
                </div>
              </td>
              <td>
                <span className="mirror-data mirror-public-id">{ride.publicId}</span>
              </td>
              <td className="mirror-status-cell">
                <StatusChip label={ride.status.label} tone={ride.status.tone} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LiveFeed() {
  const toneClass: Record<(typeof feedItems)[number]["tone"], string> = {
    accent: "mirror-feed-accent",
    attention: "mirror-feed-attention",
    danger: "mirror-feed-danger",
    info: "mirror-feed-info",
    neutral: "mirror-feed-neutral",
    strong: "mirror-feed-strong",
    success: "mirror-feed-success",
  };

  return (
    <section className="mirror-surface mirror-live-card" aria-label="Live-Feed der Tagesereignisse">
      <div className="mirror-section-head mirror-live-head">
        <h2>Live Feed</h2>
        <span className="mirror-live-badge">
          <span />
          Live
        </span>
      </div>
      <div className="mirror-live-meta">
        <span>
          <span className="mirror-data">{feedItems.length}</span> Ereignisse
        </span>
        <span className="mirror-live-now">
          <span />
          Aktualisiert gerade
        </span>
      </div>
      <ul className="mirror-feed-list">
        {feedItems.map((item) => (
          <li className="mirror-feed-item" key={item.id}>
            <span className={`mirror-feed-marker ${toneClass[item.tone]}`}>
              {item.title === "Fahrer unterwegs" ? <Car size={16} aria-hidden="true" /> : null}
            </span>
            <div className="mirror-feed-copy">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
            <time className="mirror-data">{item.time}</time>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function StorybookDashboardMirror() {
  return (
    <main className="mirror-workspace">
      <aside className="mirror-sidebar" aria-label="TaxiOS Arbeitsbereich">
        <div className="mirror-logo">
          Taxi<span>OS</span>
        </div>
        <nav className="mirror-nav" aria-label="Hauptnavigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                className={item.active ? "mirror-nav-item mirror-nav-item-active" : "mirror-nav-item"}
                href="#"
                key={item.label}
              >
                <span className="mirror-nav-icon">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
        <div className="mirror-sidebar-footer">
          <a className="mirror-nav-item" href="#">
            <span className="mirror-nav-icon">
              <Settings size={16} aria-hidden="true" />
            </span>
            <span>Einstellungen</span>
          </a>
          <div className="mirror-account">
            <Avatar value="YC" />
            <div>
              <strong>Your Company...</strong>
              <span>{dashboardCopy.accountType}</span>
            </div>
            <ChevronRight size={15} aria-hidden="true" />
          </div>
        </div>
      </aside>

      <section className="mirror-main">
        <header className="mirror-topbar">
          <div className="mirror-breadcrumb">
            <span>{dashboardCopy.companyName}</span>
            <ChevronRight size={14} aria-hidden="true" />
            <strong>Dashboard</strong>
          </div>
          <label className="mirror-search">
            <Search size={18} aria-hidden="true" />
            <input aria-label="Suchen" placeholder="Suchen..." readOnly />
          </label>
          <button className="mirror-notification" type="button" aria-label="Benachrichtigungen öffnen">
            <Bell size={20} aria-hidden="true" />
            <span />
          </button>
        </header>

        <div className="mirror-content">
          <section className="mirror-page-header">
            <p>Heute - Samstag, 02. Mai</p>
            <h1>
              Guten Morgen, <span>{dashboardCopy.userName}</span>.
            </h1>
            <div>Hier ist der Überblick deiner heutigen Mobilität.</div>
          </section>

          <section className="mirror-surface mirror-fastbooking-shell">
            <div className="mirror-section-head mirror-fastbooking-head">
              <h2>Fastbooking</h2>
              <button className="mirror-section-plus" type="button" aria-label="Neue Fastbooking-Route öffnen">
                <Plus size={34} aria-hidden="true" />
              </button>
            </div>
            <div className="mirror-fast-grid">
              {fastRoutes.map((route) => (
                <FastRouteCard key={route.id} route={route} />
              ))}
              <NewRoutePane />
            </div>
          </section>

          <div className="mirror-command-grid">
            <section className="mirror-surface mirror-rides-card">
              <div className="mirror-section-head">
                <div>
                  <h2>Nächste Fahrten</h2>
                  <p>Heutige Buchungen deines Unternehmens</p>
                </div>
                <button className="mirror-section-link" type="button">
                  Alles ansehen
                </button>
              </div>
              <RideTable />
            </section>
            <LiveFeed />
          </div>
        </div>
      </section>
    </main>
  );
}
