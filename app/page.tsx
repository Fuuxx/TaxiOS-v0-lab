import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  Grid2X2,
  Plus,
  Search,
  Settings,
  WalletCards,
  Zap
} from "lucide-react";

import { FastbookingCard } from "../components/fastbooking-card";
import { LiveFeed } from "../components/live-feed";
import { RideTable } from "../components/ride-table";
import { Surface } from "../components/surface";
import { dashboardCopy, fastRoutes, feedItems, rides } from "../data/company-dashboard-data";

const navItems = [
  { label: "Dashboard", icon: Grid2X2, active: true },
  { label: "Buchungen", icon: BriefcaseBusiness },
  { label: "Organisation", icon: Building2 },
  { label: "Berichte", icon: BarChart3 },
  { label: "Finanzen", icon: WalletCards }
];

export default function CompanyDashboardPage() {
  return (
    <main className="dashboard-shell">
      <aside className="sidebar" aria-label="TaxiOS Arbeitsbereich">
        <div className="brand">
          <span className="brand-mark">T</span>
          <span>
            Taxi<span className="brand-accent">OS</span>
          </span>
        </div>

        <div className="sidebar-label">Arbeitsbereich</div>
        <nav className="nav-list" aria-label="Hauptnavigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a className={`nav-item ${item.active ? "active" : ""}`} href="#" key={item.label}>
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <a className="nav-item" href="#">
            <Settings size={17} aria-hidden="true" />
            Einstellungen
          </a>
          <div className="account-card">
            <span className="avatar">YC</span>
            <div className="account-copy">
              <div className="account-title">Your Company...</div>
              <div className="section-subtitle">{dashboardCopy.accountType}</div>
            </div>
            <ChevronRight size={16} aria-hidden="true" />
          </div>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumb">
            {dashboardCopy.companyName} <ChevronRight size={13} aria-hidden="true" /> <strong>Dashboard</strong>
          </div>
          <div className="topbar-actions">
            <div className="search">
              <Search size={16} aria-hidden="true" />
              Buchung, Person oder Ort suchen...
            </div>
            <button className="button icon" type="button" aria-label="Benachrichtigungen">
              <Bell size={16} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="page">
          <p className="eyebrow">{dashboardCopy.dateLabel}</p>
          <h1 className="hero-title">
            {dashboardCopy.greeting}, <span>{dashboardCopy.userName}.</span>
          </h1>
          <p className="hero-copy">{dashboardCopy.overview}</p>

          <Surface>
            <div className="surface-header">
              <div className="surface-title">
                <span className="surface-icon">
                  <Zap size={17} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="section-title">Fastbooking</h2>
                  <p className="section-subtitle">Gespeicherte Routen mit einem Tipp buchen.</p>
                </div>
              </div>
              <button className="button" type="button">
                <Plus size={14} aria-hidden="true" />
                Neue Schnellbuchung
              </button>
            </div>

            <div className="fastbooking-body">
              {fastRoutes.map((route) => (
                <FastbookingCard key={route.id} route={route} />
              ))}
              <aside className="new-route">
                <div className="route-type">Fastbooking</div>
                <h3>Neue Route</h3>
                <div className="form-grid">
                  <div>
                    <div className="field-label">Titel der Route</div>
                    <div className="fake-input">z. B. Kundentermin Mitte</div>
                  </div>
                  <div>
                    <div className="field-label">Abholort (Von)</div>
                    <div className="fake-input">Adresse eingeben</div>
                  </div>
                  <div>
                    <div className="field-label">Zielort (Nach)</div>
                    <div className="fake-input">Adresse eingeben</div>
                  </div>
                  <button className="button" type="button">
                    Route speichern
                  </button>
                </div>
              </aside>
            </div>
          </Surface>

          <div className="content-grid">
            <Surface>
              <div className="surface-header">
                <div>
                  <h2 className="section-title">Nächste Fahrten</h2>
                  <p className="section-subtitle">Heutige Buchungen deines Unternehmens</p>
                </div>
                <a className="button" href="#">
                  Alles ansehen
                  <ChevronRight size={14} aria-hidden="true" />
                </a>
              </div>
              <RideTable rides={rides} />
            </Surface>

            <Surface>
              <LiveFeed items={feedItems} />
            </Surface>
          </div>
        </div>
      </div>
    </main>
  );
}
