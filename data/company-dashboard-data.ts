export type StatusTone = "neutral" | "info" | "success" | "attention" | "danger" | "strong";

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
  status: {
    label: string;
    tone: StatusTone;
  };
};

export type FeedItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  tone: StatusTone | "accent";
};

export const dashboardCopy = {
  companyName: "Your Companyname",
  userName: "Katerina",
  dateLabel: "Heute · Samstag, 02. Mai",
  greeting: "Guten Morgen",
  overview: "Hier ist der Überblick deiner heutigen Mobilität.",
  accountType: "Geschäftskonto"
};

export const fastRoutes: FastRoute[] = [
  {
    id: "ber",
    title: "Flughafen BER",
    from: "Hauptstr. 10, Berlin",
    to: "BER Terminal 1–2",
    passengerInitials: ["PL", "BS"],
    passengerCount: 2
  },
  {
    id: "office",
    title: "Büro Friedrichstr.",
    from: "Berlin Hbf",
    to: "Friedrichstr. 110",
    passengerInitials: ["MK"],
    passengerCount: 1
  },
  {
    id: "messe",
    title: "Messe Berlin",
    from: "Büro Mitte",
    to: "Messedamm 22",
    passengerInitials: ["TL", "VB"],
    passengerCount: 2
  }
];

export const rides: Ride[] = [
  {
    id: "ride-1",
    time: "09:30",
    day: "Heute",
    passengers: ["PL"],
    from: "Hauptstr. 10, 10117 Berlin",
    to: "Flughafen BER – Terminal 1",
    publicId: "BKG-7K4Q2M",
    status: { label: "Bestellt", tone: "neutral" }
  },
  {
    id: "ride-2",
    time: "14:00",
    day: "Heute",
    passengers: ["JW", "NK", "AB"],
    extraPassengers: 1,
    from: "Flughafen BER – Terminal 1",
    to: "Friedrichstr. 110, Berlin",
    publicId: "BKG-8FD3QA",
    status: { label: "Zugewiesen", tone: "info" }
  },
  {
    id: "ride-3",
    time: "16:45",
    day: "Heute",
    passengers: ["TL", "MB", "KS"],
    from: "Messedamm 22, 14055 Berlin",
    to: "Hauptstr. 10, 10117 Berlin",
    publicId: "BKG-P7N4JC",
    status: { label: "Angekommen", tone: "success" }
  },
  {
    id: "ride-4",
    time: "07:20",
    day: "Heute",
    passengers: ["MK"],
    from: "Friedrichstr. 110, Berlin",
    to: "Berlin Hbf, Europaplatz",
    publicId: "BKG-WK6H9D",
    status: { label: "In Fahrt", tone: "info" }
  },
  {
    id: "ride-5",
    time: "08:45",
    day: "Heute",
    passengers: ["AS", "MR"],
    from: "Kudamm 12, Berlin",
    to: "Messe Nord",
    publicId: "BKG-H2C8VX",
    status: { label: "Problem gemeldet", tone: "attention" }
  }
];

export const feedItems: FeedItem[] = [
  {
    id: "feed-1",
    title: "Fahrer unterwegs",
    body: "BER Abholung erfolgt.",
    time: "vor 2 Min",
    tone: "info"
  },
  {
    id: "feed-2",
    title: "Buchung erstellt",
    body: "P. Lehmann · 14:00 Uhr.",
    time: "vor 8 Min",
    tone: "neutral"
  },
  {
    id: "feed-3",
    title: "Kostenstelle OK",
    body: "Zuweisung abgeschlossen.",
    time: "vor 25 Min",
    tone: "success"
  }
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
  "new-booking-overlay-mobile.png"
];
