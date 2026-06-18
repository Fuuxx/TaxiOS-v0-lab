import { z } from "zod/v4";

import type {
  NewBookingOverlayCopy,
  NewBookingOverlayFormValues,
  NewBookingOverlaySubmitData,
  NewBookingPassengerOption,
  NewBookingSubmittedPassenger,
  NewBookingVehicleRequest,
  NewBookingVehicleTypeOption,
} from "../../../contracts/new-booking";
import { temporaryNewBookingVehicleTypes } from "./new-booking-vehicle-types";

const tripTypeSchema = z.enum(["one_way_outbound", "round_trip"]);
const passengerInputModeSchema = z.enum(["assign_seats", "guest_count"]);

export const emptyNewBookingFormValues: NewBookingOverlayFormValues = {
  contactPersonId: "",
  customPassengerName: "",
  destinationAddress: "",
  flightNumber: "",
  guestCount: 1,
  internalNote: "",
  passengerInputMode: "assign_seats",
  passengerIds: [],
  passengersPerVehicle: 3,
  pickupAddress: "",
  pickupDate: "",
  pickupTime: "",
  returnDate: "",
  returnTime: "",
  tripType: "one_way_outbound",
  vehicleTypeId: "standard",
};

export function formatNewBookingCapacityMessage(
  template: string,
  capacity: number,
) {
  return template.replace("{capacity}", String(capacity));
}

function selectedVehicleType(
  vehicleTypeId: string,
  vehicleTypes: readonly NewBookingVehicleTypeOption[],
) {
  return (
    vehicleTypes.find((vehicleType) => vehicleType.id === vehicleTypeId) ??
    vehicleTypes[0] ??
    temporaryNewBookingVehicleTypes[0]
  );
}

export function createNewBookingFormSchema(
  validation: NewBookingOverlayCopy["validation"],
  vehicleTypes: readonly NewBookingVehicleTypeOption[] = temporaryNewBookingVehicleTypes,
) {
  return z
    .object({
      contactPersonId: z.string(),
      customPassengerName: z.string(),
      destinationAddress: z
        .string()
        .trim()
        .min(1, validation.destinationRequired),
      flightNumber: z.string(),
      guestCount: z.coerce
        .number<number>()
        .int()
        .min(1, validation.passengerRequired),
      internalNote: z.string(),
      passengerInputMode: passengerInputModeSchema,
      passengerIds: z.array(z.string()),
      passengersPerVehicle: z.coerce.number<number>().int().min(1),
      pickupAddress: z.string().trim().min(1, validation.pickupRequired),
      pickupDate: z.string().trim().min(1, validation.pickupDateRequired),
      pickupTime: z.string().trim().min(1, validation.pickupTimeRequired),
      returnDate: z.string(),
      returnTime: z.string(),
      tripType: tripTypeSchema,
      vehicleTypeId: z.string().trim().min(1),
    })
    .superRefine((values, ctx) => {
      if (values.tripType === "round_trip") {
        if (values.returnDate.trim().length === 0) {
          ctx.addIssue({
            code: "custom",
            message: validation.returnDateRequired,
            path: ["returnDate"],
          });
        }

        if (values.returnTime.trim().length === 0) {
          ctx.addIssue({
            code: "custom",
            message: validation.returnTimeRequired,
            path: ["returnTime"],
          });
        }
      }

      if (
        values.passengerInputMode === "assign_seats" &&
        values.passengerIds.length === 0
      ) {
        ctx.addIssue({
          code: "custom",
          message: validation.passengerRequired,
          path: ["passengerIds"],
        });
      }

      const vehicleType = selectedVehicleType(
        values.vehicleTypeId,
        vehicleTypes,
      );

      if (values.passengersPerVehicle > vehicleType.capacity) {
        ctx.addIssue({
          code: "custom",
          message: formatNewBookingCapacityMessage(
            validation.overCapacity,
            vehicleType.capacity,
          ),
          path: ["passengersPerVehicle"],
        });
      }
    });
}

function combineLocalDateTime(date: string, time: string) {
  const timestamp = new Date(`${date.trim()}T${time.trim()}`).getTime();

  if (Number.isNaN(timestamp)) {
    throw new Error("Date/time is invalid.");
  }

  return timestamp;
}

function optionalTrimmed(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

export function deriveNewBookingSubmitPayload(
  values: NewBookingOverlayFormValues,
  passengerOptions: readonly NewBookingPassengerOption[] = [],
  vehicleRequests: readonly NewBookingVehicleRequest[] = [],
): NewBookingOverlaySubmitData {
  const passengerNameById = new Map(
    passengerOptions.map((passenger) => [passenger.id, passenger.name]),
  );

  function submittedPassengerFromId(
    passengerId: string,
  ): NewBookingSubmittedPassenger {
    const name = passengerNameById.get(passengerId) ?? passengerId;

    return passengerId.startsWith("custom-slot:")
      ? {
          kind: "guest" as const,
          name,
        }
      : {
          kind: "member" as const,
          memberId: passengerId,
          name,
        };
  }

  const passengers =
    values.passengerInputMode === "guest_count"
      ? Array.from({ length: values.guestCount }, (_, guestIndex) => ({
          kind: "guest" as const,
          name: `Gast ${guestIndex + 1}`,
        }))
      : values.passengerIds.map(submittedPassengerFromId);
  const passengerIds =
    values.passengerInputMode === "guest_count" ? [] : [...values.passengerIds];
  const passengerNames = passengers.map((passenger) => passenger.name);
  const returnRequestedPickupAt =
    values.tripType === "round_trip" &&
    values.returnDate.trim().length > 0 &&
    values.returnTime.trim().length > 0
      ? combineLocalDateTime(values.returnDate, values.returnTime)
      : undefined;

  return {
    contactPersonId: optionalTrimmed(values.contactPersonId),
    destinationAddress: values.destinationAddress.trim(),
    flightNumber: optionalTrimmed(values.flightNumber),
    internalNote: optionalTrimmed(values.internalNote),
    passengerInputMode: values.passengerInputMode,
    passengers,
    passengerIds,
    passengerNames,
    pickupAddress: values.pickupAddress.trim(),
    requestedPickupAt: combineLocalDateTime(
      values.pickupDate,
      values.pickupTime,
    ),
    returnRequestedPickupAt,
    tripType: values.tripType,
    vehicleTypeId: vehicleRequests[0]?.vehicleTypeId ?? values.vehicleTypeId,
    vehicleRequests: [...vehicleRequests],
  };
}

export function capacityForVehicleType(
  vehicleTypeId: string,
  vehicleTypes: readonly NewBookingVehicleTypeOption[] = temporaryNewBookingVehicleTypes,
) {
  return selectedVehicleType(vehicleTypeId, vehicleTypes).capacity;
}
