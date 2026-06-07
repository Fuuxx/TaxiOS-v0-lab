import type { NewBookingVehicleTypeOption } from "../../../contracts/new-booking";

export const TEMPORARY_STANDARD_VEHICLE_CAPACITY = 3;

/**
 * UI fallback until vehicle type/capacity comes from a dedicated backend read model.
 * IDs and capacities must stay aligned with the Convex booking contract.
 */
export const temporaryNewBookingVehicleTypes = [
  {
    capacity: TEMPORARY_STANDARD_VEHICLE_CAPACITY,
    description: "Alltag, Business, kurze Wege",
    id: "standard",
    isTemporaryFallback: true,
    label: "Taxi (E-Klasse)",
    luggageHint: "Standard-Gepäck",
    shortLabel: "Taxi",
  },
  {
    capacity: 4,
    description: "Mehr Platz für Taschen und Gepäck",
    id: "estate",
    isTemporaryFallback: true,
    label: "Kombi / Touran",
    luggageHint: "Mehr Gepäck",
    shortLabel: "Kombi",
  },
  {
    capacity: 3,
    description: "Ruhige Premiumfahrt für VIP-Gäste",
    id: "vip_shuttle",
    isTemporaryFallback: true,
    label: "VIP Shuttle (S-Klasse/A8 Lang)",
    luggageHint: "Premium",
    shortLabel: "VIP",
  },
  {
    capacity: 8,
    description: "Grossgruppe oder Airport-Transfer",
    id: "vito",
    isTemporaryFallback: true,
    label: "Vito Grossraumtaxi",
    luggageHint: "Bis 8 Gäste",
    shortLabel: "Vito",
  },
] satisfies readonly NewBookingVehicleTypeOption[];
