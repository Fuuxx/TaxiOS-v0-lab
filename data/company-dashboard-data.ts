export type StatusTone = "neutral" | "info" | "success" | "attention";

export type FastRoute = {
  id: string;
  title: string;
  from: string;
  to: string;
  passengerInitials: string[];
  passengerCount: number;
};

export type Ride = {
  id: string;
  time: string;
  day: string;
  passengers: string[];
  extraPassengers?: number;
  from: string;
  to: string;
  publicId: string;
  vehicleTone: StatusTone;
  status: {
    label: string;
    tone: StatusTone;
  };
};

export type FeedItem = {
  id: string;
  title: string;
  body: string;
  meta: string;
  time: string;
  tone: StatusTone | "accent";
};

export const dashboardCopy = {
  companyName: "Smoke Company HQ",
  userName: "Team",
  dateLabel: "Heute - Sonntag, 07. Juni",
  greeting: "Guten Morgen",
  overview: "Hier ist der Überblick über eure heutige Mobilität.",
  accountType: "Geschäftskonto",
  accountInitials: "SC",
};

export const fastRoutes: FastRoute[] = [
  {
    id: "test-2",
    title: "test 2",
    from: "test 1",
    to: "test 2",
    passengerInitials: ["A", "SC", "AA", "SC", "AB"],
    passengerCount: 1,
  },
  {
    id: "linkstrasse-5",
    title: "Linkstraße 5",
    from: "Werrastraße 36",
    to: "Linkstraße 5",
    passengerInitials: ["X"],
    passengerCount: 1,
  },
  {
    id: "berlin-central-office",
    title: "Berlin Central Office",
    from: "Leipziger Platz 1",
    to: "Berlin Central Office",
    passengerInitials: ["GG"],
    passengerCount: 1,
  },
];

export const rides: Ride[] = [
  {
    id: "ride-1",
    time: "20:05",
    day: "Heute",
    passengers: ["AY"],
    from: "test 1",
    to: "test 2",
    publicId: "BKG-8HTXCR",
    vehicleTone: "info",
    status: { label: "In Fahrt", tone: "info" },
  },
  {
    id: "ride-2",
    time: "08:40",
    day: "Heute",
    passengers: ["XY"],
    from: "Werrastraße 36",
    to: "Linkstraße 5",
    publicId: "BKG-2VU66A",
    vehicleTone: "neutral",
    status: { label: "Bestellt", tone: "neutral" },
  },
  {
    id: "ride-3",
    time: "13:00",
    day: "Heute",
    passengers: ["GG"],
    from: "Leipziger Platz 1",
    to: "Berlin Central Office",
    publicId: "BKG-WBYD39",
    vehicleTone: "info",
    status: { label: "In Fahrt", tone: "info" },
  },
  {
    id: "ride-4",
    time: "TBD",
    day: "Heute",
    passengers: ["SP"],
    from: "Slice 137 Company Pickup",
    to: "Slice 137 Provider Destination",
    publicId: "BKG-D2UAKC",
    vehicleTone: "info",
    status: { label: "In Fahrt", tone: "info" },
  },
  {
    id: "ride-5",
    time: "10:00",
    day: "Heute",
    passengers: ["CC"],
    from: "Potsdamer Platz 1",
    to: "Berlin Hauptbahnhof",
    publicId: "BKG-SR83JR",
    vehicleTone: "info",
    status: { label: "In Fahrt", tone: "info" },
  },
  {
    id: "ride-6",
    time: "TBD",
    day: "Heute",
    passengers: ["CS"],
    from: "Company Smoke Office",
    to: "Provider Global Pool Destination",
    publicId: "BKG-3D4XGN",
    vehicleTone: "info",
    status: { label: "In Fahrt", tone: "info" },
  },
];

export const feedItems: FeedItem[] = [
  {
    id: "feed-1",
    title: "Company rides loaded",
    body: "6 active bookings",
    meta: "Read model",
    time: "Read model",
    tone: "neutral",
  },
];

export const referenceScreenshots = [
  "company-dashboard-screen.png",
  "company-dashboard-screen-mobile.png",
  "company-dashboard-fastbooking-card.png",
  "company-dashboard-fastbooking-card-mobile.png",
  "company-dashboard-rides-table.png",
  "company-dashboard-rides-table-mobile.png",
  "company-dashboard-live-feed.png",
  "company-dashboard-live-feed-mobile.png",
  "workspace-status-chips.png",
  "workspace-status-chips-mobile.png",
  "workspace-wizard.png",
  "workspace-wizard-mobile.png",
  "new-booking-overlay.png",
  "new-booking-overlay-mobile.png",
];
