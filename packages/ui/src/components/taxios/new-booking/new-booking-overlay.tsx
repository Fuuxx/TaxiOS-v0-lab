"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarClock,
  Car,
  ChevronDown,
  Clock,
  MapPin,
  Users,
  X,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import type { z } from "zod/v4";

import type {
  NewBookingAddressAutocompleteController,
  NewBookingAddressField,
  NewBookingAddressSelection,
  NewBookingAddressSuggestion,
  NewBookingFavoriteRoute,
  NewBookingOverlayCopy,
  NewBookingOverlayDraft,
  NewBookingOverlayFormValues,
  NewBookingOverlaySubmitData,
  NewBookingPassengerInputMode,
  NewBookingPassengerOption,
  NewBookingTripType,
  NewBookingVehicleRequest,
  NewBookingVehicleTypeOption,
} from "../../../contracts/new-booking";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import {
  TaxiDateField,
  TaxiTimeField,
} from "../../ui/date-time-field";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import "../workspace/workspace.css";
import {
  WorkspaceWizardBackdrop,
  WorkspaceWizardBody,
  WorkspaceWizardFooter,
  WorkspaceWizardForm,
  WorkspaceWizardHeader,
  WorkspaceWizardLayout,
  WorkspaceWizardMainPanel,
  WorkspaceWizardOverlay,
  WorkspaceWizardPanel,
  WorkspaceWizardRail,
  WorkspaceWizardScroll,
  WorkspaceWizardSection,
  WorkspaceWizardStatusGrid,
  WorkspaceWizardStatusItem,
} from "../workspace/workspace-wizard";
import { WorkspaceCloseButton } from "../workspace/workspace-controls";
import {
  capacityForVehicleType,
  createNewBookingFormSchema,
  deriveNewBookingSubmitPayload,
  emptyNewBookingFormValues,
  formatNewBookingCapacityMessage,
} from "./new-booking-validation";
import { temporaryNewBookingVehicleTypes } from "./new-booking-vehicle-types";

type NewBookingOverlayFormSchema = ReturnType<
  typeof createNewBookingFormSchema
>;
type NewBookingOverlayValidatedFormValues =
  z.output<NewBookingOverlayFormSchema>;

export type NewBookingOverlayProps = {
  addressAutocomplete?: NewBookingAddressAutocompleteController;
  availablePassengers: readonly NewBookingPassengerOption[];
  className?: string;
  copy: NewBookingOverlayCopy;
  disabled?: boolean;
  disabledReason?: string;
  errorMessage?: string | null;
  favoriteRoutes?: readonly NewBookingFavoriteRoute[];
  initialDraft?: NewBookingOverlayDraft | null;
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: NewBookingOverlaySubmitData) => Promise<void> | void;
  requireVerifiedAddresses?: boolean;
  successMessage?: string | null;
  vehicleTypes?: readonly NewBookingVehicleTypeOption[];
};

const FOOTER_CTA_CLASS =
  "min-h-[var(--taxis-control-h-md)] rounded-[var(--taxis-radius-control)] px-4";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function tabOrderInsidePanel(panel: HTMLElement): HTMLElement[] {
  return Array.from(
    panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => {
    const style = window.getComputedStyle(element);

    return style.visibility !== "hidden" && style.display !== "none";
  });
}

function sectionTitleId(title: string) {
  return `new-booking-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function resolveVehicleTypes(
  copy: NewBookingOverlayCopy,
  vehicleTypes?: readonly NewBookingVehicleTypeOption[],
) {
  if (vehicleTypes && vehicleTypes.length > 0) {
    return vehicleTypes;
  }

  return temporaryNewBookingVehicleTypes.map((vehicleType) => ({
    ...vehicleType,
    label:
      vehicleType.id === "standard"
        ? copy.vehicle.standardLabel
        : vehicleType.label,
  }));
}

function formatRemainingLabel(template: string, remaining: number) {
  return template.replace("{remaining}", String(remaining));
}

function formatVehicleCardLabel(template: string, index: number) {
  return template.includes("{index}")
    ? template.replace("{index}", String(index))
    : `${template.replace(/\s+\d+$/, "")} ${index}`;
}

function formatVehiclesCalculatedLabel(template: string, count: number) {
  return template.replace("{count}", String(count));
}

function formatSlotLabel(template: string, index: number) {
  return template.replace("{index}", String(index));
}

function addressSelectionHasStreetNumber(
  selection: NewBookingAddressSelection | null,
) {
  return Boolean(
    selection?.addressComponents.some(
      (component) =>
        component.types.includes("street_number") &&
        (component.longText.trim().length > 0 ||
          (component.shortText?.trim().length ?? 0) > 0),
    ),
  );
}

function addressSelectionMatchesText(
  selection: NewBookingAddressSelection | null,
  address: string,
) {
  return selection?.formattedAddress.trim() === address.trim();
}

function addressSelectionIsVerified(
  selection: NewBookingAddressSelection | null,
  address: string,
) {
  return (
    addressSelectionMatchesText(selection, address) &&
    addressSelectionHasStreetNumber(selection)
  );
}

function addressVerificationState({
  address,
  lookupUnavailable,
  requireVerifiedAddresses,
  selection,
  showMissingGoogleSelection,
}: {
  address: string;
  lookupUnavailable: boolean;
  requireVerifiedAddresses: boolean;
  selection: NewBookingAddressSelection | null;
  showMissingGoogleSelection: boolean;
}): NewBookingAddressVerificationState | null {
  if (!requireVerifiedAddresses) {
    return null;
  }

  if (address.trim().length === 0) {
    return null;
  }

  if (lookupUnavailable) {
    return "unavailable";
  }

  if (!addressSelectionMatchesText(selection, address)) {
    return showMissingGoogleSelection ? "missing_google_selection" : null;
  }

  if (!addressSelectionHasStreetNumber(selection)) {
    return "missing_house_number";
  }

  return "verified";
}

function vehicleCountForPassengerCount(
  passengerCount: number,
  capacity: number,
) {
  return Math.max(
    1,
    Math.ceil(Math.max(passengerCount, 1) / Math.max(capacity, 1)),
  );
}

function clampInteger(value: number | undefined, min: number, max: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return min;
  }

  return Math.min(Math.max(Math.trunc(value), min), max);
}

type NewBookingOverlayStep = "details" | "review";
type NewBookingAddressVerificationState =
  | "missing_google_selection"
  | "missing_house_number"
  | "unavailable"
  | "verified";
type NewBookingQuickTimeAction =
  | "now"
  | "plus_30"
  | "plus_60"
  | "tomorrow_0800";
type NewBookingReviewSection =
  | "contact"
  | "dateTime"
  | "notes"
  | "passengerVehicle"
  | "route";

function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTimeInputValue(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function quickPickupDate(action: NewBookingQuickTimeAction) {
  const date = new Date();

  if (action === "plus_30") {
    date.setMinutes(date.getMinutes() + 30);
    return date;
  }

  if (action === "plus_60") {
    date.setHours(date.getHours() + 1);
    return date;
  }

  if (action === "tomorrow_0800") {
    date.setDate(date.getDate() + 1);
    date.setHours(8, 0, 0, 0);
    return date;
  }

  return date;
}

function formatPassengerCountLabel(
  copy: NewBookingOverlayCopy,
  passengerCount: number,
) {
  if (passengerCount === 0) {
    return copy.command.passengersEmptyLabel;
  }

  return `${passengerCount} ${copy.summary.totalPassengersLabel}`;
}

function formatVehicleCountLabel(
  copy: NewBookingOverlayCopy,
  vehicleCount: number,
) {
  return `${vehicleCount} ${
    vehicleCount === 1
      ? copy.command.vehicleSingularLabel
      : copy.command.vehiclePluralLabel
  }`;
}

function LeadingDataLabel({ label }: { label: string }) {
  const [dataValue, ...labelParts] = label.split(" ");
  const humanLabel = labelParts.join(" ");

  return (
    <span className="min-w-0 truncate">
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="inline-flex min-w-0 items-baseline gap-1 truncate"
      >
        <span className="taxis-data-inline shrink-0">{dataValue}</span>
        {humanLabel ? (
          <span className="min-w-0 truncate">{humanLabel}</span>
        ) : null}
      </span>
    </span>
  );
}

type PassengerSlotKind = "guest" | "member";

type PassengerSlotDraft = {
  kind?: PassengerSlotKind;
  memberId?: string;
  name: string;
  slotId: string;
};

type ResolvedPassengerSlot = PassengerSlotDraft & {
  passenger: NewBookingPassengerOption | null;
};

type VehicleCardDraft = {
  vehicleTypeId: string;
};

type VehicleSlotPlan = {
  capacity: number;
  startSlotIndex: number;
  vehicleIndex: number;
  vehicleType: NewBookingVehicleTypeOption;
  vehicleTypeId: string;
};

function emptyPassengerSlot(slotIndex: number): PassengerSlotDraft {
  return { name: "", slotId: `passenger-slot-${slotIndex + 1}` };
}

function emptyPassengerSlots(capacity: number): PassengerSlotDraft[] {
  return Array.from({ length: Math.max(capacity, 0) }, (_, slotIndex) =>
    emptyPassengerSlot(slotIndex),
  );
}

function normalizePassengerSlots(
  slots: readonly PassengerSlotDraft[],
  capacity: number,
) {
  const nextSlots = slots.slice(0, Math.max(capacity, 0));

  while (nextSlots.length < capacity) {
    nextSlots.push(emptyPassengerSlot(nextSlots.length));
  }

  return nextSlots;
}

function reindexPassengerSlots(
  slots: readonly PassengerSlotDraft[],
): PassengerSlotDraft[] {
  return slots.map((slot, slotIndex) => ({
    ...slot,
    slotId: `passenger-slot-${slotIndex + 1}`,
  }));
}

function vehicleTypeForId(
  vehicleTypeId: string,
  vehicleTypes: readonly NewBookingVehicleTypeOption[],
) {
  return (
    vehicleTypes.find((vehicleType) => vehicleType.id === vehicleTypeId) ??
    vehicleTypes[0] ??
    temporaryNewBookingVehicleTypes[0]
  );
}

function vehicleCardsForCount(
  count: number,
  vehicleTypeId: string,
): VehicleCardDraft[] {
  return Array.from(
    { length: Math.max(1, count) },
    (): VehicleCardDraft => ({ vehicleTypeId }),
  );
}

function vehicleSlotPlans(
  vehicleCards: readonly VehicleCardDraft[],
  vehicleTypes: readonly NewBookingVehicleTypeOption[],
): VehicleSlotPlan[] {
  let startSlotIndex = 0;

  return vehicleCards.map((vehicleCard, vehicleIndex) => {
    const vehicleType = vehicleTypeForId(
      vehicleCard.vehicleTypeId,
      vehicleTypes,
    );
    const plan = {
      capacity: vehicleType.capacity,
      startSlotIndex,
      vehicleIndex,
      vehicleType,
      vehicleTypeId: vehicleType.id,
    };

    startSlotIndex += vehicleType.capacity;

    return plan;
  });
}

function totalVehicleCapacityFromPlans(plans: readonly VehicleSlotPlan[]) {
  return plans.reduce((total, plan) => total + plan.capacity, 0);
}

function slotPassengerId(slotId: string, name: string) {
  const normalized =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "guest";

  return `custom-slot:${slotId}:${normalized}`;
}

function resolvePassengerSlot(
  slot: PassengerSlotDraft,
  availablePassengers: readonly NewBookingPassengerOption[],
): NewBookingPassengerOption | null {
  const name = slot.name.trim();

  if (name.length === 0) {
    return null;
  }

  if (slot.kind === "member" && slot.memberId) {
    const member = availablePassengers.find(
      (passenger) => passenger.id === slot.memberId,
    );

    if (member) {
      return member;
    }
  }

  if (slot.kind === "guest") {
    return {
      id: slotPassengerId(slot.slotId, name),
      name,
    };
  }

  return null;
}

function resolvePassengerSlots(
  slots: readonly PassengerSlotDraft[],
  availablePassengers: readonly NewBookingPassengerOption[],
): ResolvedPassengerSlot[] {
  return slots.map((slot) => ({
    ...slot,
    passenger: resolvePassengerSlot(slot, availablePassengers),
  }));
}

function passengerSlotsFromDraft(
  draft: NewBookingOverlayDraft | null | undefined,
  capacity: number,
  availablePassengers: readonly NewBookingPassengerOption[],
) {
  const passengerById = new Map(
    availablePassengers.map((passenger) => [passenger.id, passenger]),
  );
  const seenPassengerIds = new Set<string>();
  const draftSlots: PassengerSlotDraft[] = [];

  for (const passengerId of draft?.passengerIds ?? []) {
    if (seenPassengerIds.has(passengerId)) {
      continue;
    }

    const passenger = passengerById.get(passengerId);
    if (!passenger) {
      continue;
    }

    seenPassengerIds.add(passengerId);
    draftSlots.push({
      kind: "member",
      memberId: passenger.id,
      name: passenger.name,
      slotId: `passenger-slot-${draftSlots.length + 1}`,
    });

    if (draftSlots.length >= capacity) {
      break;
    }
  }

  return normalizePassengerSlots(draftSlots, capacity);
}

function draftKey(draft: NewBookingOverlayDraft | null | undefined) {
  return JSON.stringify({
    destinationAddress: draft?.destinationAddress ?? "",
    passengerIds: [...(draft?.passengerIds ?? [])],
    pickupAddress: draft?.pickupAddress ?? "",
  });
}

function isCustomSlotPassenger(passenger: NewBookingPassengerOption) {
  return passenger.id.startsWith("custom-slot:");
}

function uniquePassengers(
  passengers: readonly NewBookingPassengerOption[],
): NewBookingPassengerOption[] {
  const seen = new Set<string>();
  const unique: NewBookingPassengerOption[] = [];

  for (const passenger of passengers) {
    if (seen.has(passenger.id)) continue;
    seen.add(passenger.id);
    unique.push(passenger);
  }

  return unique;
}

function submittedPassengerFromOption(passenger: NewBookingPassengerOption) {
  return passenger.id.startsWith("custom-slot:")
    ? {
        kind: "guest" as const,
        name: passenger.name,
      }
    : {
        kind: "member" as const,
        memberId: passenger.id,
        name: passenger.name,
      };
}

function vehicleRequestsFromSeatSlots({
  passengerSlots,
  vehiclePlans,
}: {
  passengerSlots: readonly ResolvedPassengerSlot[];
  vehiclePlans: readonly VehicleSlotPlan[];
}): NewBookingVehicleRequest[] {
  const requests: NewBookingVehicleRequest[] = [];

  for (const plan of vehiclePlans) {
    const passengers = passengerSlots
      .slice(plan.startSlotIndex, plan.startSlotIndex + plan.capacity)
      .map((slot) => slot.passenger)
      .filter((passenger): passenger is NewBookingPassengerOption =>
        Boolean(passenger),
      )
      .map(submittedPassengerFromOption);

    if (passengers.length === 0) {
      continue;
    }

    requests.push({
      capacity: plan.capacity,
      ordinal: requests.length + 1,
      passengers,
      vehicleTypeId: plan.vehicleTypeId,
    });
  }

  return requests;
}

function guestCountVehicleRequests({
  capacity,
  guestCount,
  passengersPerVehicle,
  vehicleTypeId,
}: {
  capacity: number;
  guestCount: number;
  passengersPerVehicle: number;
  vehicleTypeId: string;
}): NewBookingVehicleRequest[] {
  const passengers = Array.from({ length: guestCount }, (_, guestIndex) => ({
    kind: "guest" as const,
    name: `Gast ${guestIndex + 1}`,
  }));
  const groupSize = clampInteger(passengersPerVehicle, 1, capacity);
  const requests: NewBookingVehicleRequest[] = [];

  for (let start = 0; start < passengers.length; start += groupSize) {
    requests.push({
      capacity,
      ordinal: requests.length + 1,
      passengers: passengers.slice(start, start + groupSize),
      vehicleTypeId,
    });
  }

  return requests;
}

function passengersFromVehicleRequests(
  vehicleRequests: readonly NewBookingVehicleRequest[],
): NewBookingPassengerOption[] {
  return vehicleRequests.flatMap((request) =>
    request.passengers.map((passenger, passengerIndex) => ({
      id:
        passenger.kind === "member"
          ? passenger.memberId
          : `guest-count:${request.ordinal}:${passengerIndex}`,
      name: passenger.name,
    })),
  );
}

export function NewBookingOverlay({
  addressAutocomplete,
  availablePassengers,
  className,
  copy,
  disabled = false,
  disabledReason,
  errorMessage,
  favoriteRoutes = [],
  initialDraft,
  isOpen,
  isSubmitting = false,
  onClose,
  onSubmit,
  requireVerifiedAddresses,
  successMessage,
  vehicleTypes,
}: NewBookingOverlayProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const appliedDraftKeyRef = useRef<string | null>(
    isOpen ? draftKey(initialDraft) : null,
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const dateTimeSectionRef = useRef<HTMLDivElement>(null);
  const notesSectionRef = useRef<HTMLDivElement>(null);
  const passengerVehicleSectionRef = useRef<HTMLDivElement>(null);
  const routeSectionRef = useRef<HTMLDivElement>(null);
  const resolvedVehicleTypes = useMemo(
    () => resolveVehicleTypes(copy, vehicleTypes),
    [copy, vehicleTypes],
  );
  const defaultVehicleCapacity = capacityForVehicleType(
    emptyNewBookingFormValues.vehicleTypeId,
    resolvedVehicleTypes,
  );
  const initialDraftVehicleCount = useMemo(
    () =>
      vehicleCountForPassengerCount(
        initialDraft?.passengerIds?.length ?? 0,
        defaultVehicleCapacity,
      ),
    [defaultVehicleCapacity, initialDraft],
  );
  const initialDraftPassengerSlots = useMemo(
    () =>
      passengerSlotsFromDraft(
        initialDraft,
        initialDraftVehicleCount * defaultVehicleCapacity,
        availablePassengers,
      ),
    [
      availablePassengers,
      defaultVehicleCapacity,
      initialDraft,
      initialDraftVehicleCount,
    ],
  );
  const initialDraftPassengerIds = useMemo(
    () =>
      initialDraftPassengerSlots
        .map((slot) => slot.memberId)
        .filter((memberId): memberId is string => Boolean(memberId)),
    [initialDraftPassengerSlots],
  );
  const initialDraftVehicleCards = useMemo(
    () =>
      vehicleCardsForCount(
        initialDraftVehicleCount,
        emptyNewBookingFormValues.vehicleTypeId,
      ),
    [initialDraftVehicleCount],
  );
  const [passengerSlots, setPassengerSlots] = useState<PassengerSlotDraft[]>(
    () => initialDraftPassengerSlots,
  );
  const [vehicleCards, setVehicleCards] = useState<VehicleCardDraft[]>(
    () => initialDraftVehicleCards,
  );
  const [activePassengerSlotIndex, setActivePassengerSlotIndex] = useState<
    number | null
  >(null);
  const [step, setStep] = useState<NewBookingOverlayStep>("details");
  const [pickupPlace, setPickupPlace] =
    useState<NewBookingAddressSelection | null>(null);
  const [destinationPlace, setDestinationPlace] =
    useState<NewBookingAddressSelection | null>(null);
  const [addressLookupUnavailable, setAddressLookupUnavailable] = useState<
    Record<NewBookingAddressField, boolean>
  >({ destination: false, pickup: false });
  const resolvedPassengerSlots = useMemo(
    () => resolvePassengerSlots(passengerSlots, availablePassengers),
    [availablePassengers, passengerSlots],
  );
  const selectedPassengers = useMemo(
    () =>
      resolvedPassengerSlots
        .map((slot) => slot.passenger)
        .filter((passenger): passenger is NewBookingPassengerOption =>
          Boolean(passenger),
        ),
    [resolvedPassengerSlots],
  );
  const customSlotPassengers = useMemo(
    () => selectedPassengers.filter(isCustomSlotPassenger),
    [selectedPassengers],
  );
  const passengerOptions = useMemo(
    () => [...availablePassengers, ...uniquePassengers(customSlotPassengers)],
    [availablePassengers, customSlotPassengers],
  );
  const selectedPassengerIds = useMemo(
    () => selectedPassengers.map((passenger) => passenger.id),
    [selectedPassengers],
  );
  const formSchema = useMemo(
    () => createNewBookingFormSchema(copy.validation, resolvedVehicleTypes),
    [copy.validation, resolvedVehicleTypes],
  );
  const {
    formState: { errors, submitCount },
    clearErrors,
    control,
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch,
  } = useForm<
    NewBookingOverlayFormValues,
    unknown,
    NewBookingOverlayValidatedFormValues
  >({
    defaultValues: {
      ...emptyNewBookingFormValues,
      destinationAddress: initialDraft?.destinationAddress ?? "",
      passengerIds: initialDraftPassengerIds,
      pickupAddress: initialDraft?.pickupAddress ?? "",
    },
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
  });
  const values = watch();
  const shouldRequireVerifiedAddresses =
    requireVerifiedAddresses ?? Boolean(addressAutocomplete);
  const pickupLookupUnavailable =
    addressLookupUnavailable.pickup ||
    (shouldRequireVerifiedAddresses && !addressAutocomplete);
  const destinationLookupUnavailable =
    addressLookupUnavailable.destination ||
    (shouldRequireVerifiedAddresses && !addressAutocomplete);
  const pickupAddressVerificationState = addressVerificationState({
    address: values.pickupAddress,
    lookupUnavailable: pickupLookupUnavailable,
    requireVerifiedAddresses: shouldRequireVerifiedAddresses,
    selection: pickupPlace,
    showMissingGoogleSelection:
      errors.pickupAddress?.message === copy.validation.googleAddressRequired,
  });
  const destinationAddressVerificationState = addressVerificationState({
    address: values.destinationAddress,
    lookupUnavailable: destinationLookupUnavailable,
    requireVerifiedAddresses: shouldRequireVerifiedAddresses,
    selection: destinationPlace,
    showMissingGoogleSelection:
      errors.destinationAddress?.message ===
      copy.validation.googleAddressRequired,
  });
  const passengerInputMode = values.passengerInputMode;
  const selectedCapacity = capacityForVehicleType(
    values.vehicleTypeId,
    resolvedVehicleTypes,
  );
  const vehiclePlans = useMemo(
    () => vehicleSlotPlans(vehicleCards, resolvedVehicleTypes),
    [resolvedVehicleTypes, vehicleCards],
  );
  const totalVehicleCapacity = totalVehicleCapacityFromPlans(vehiclePlans);
  const guestCount = clampInteger(values.guestCount, 1, 80);
  const passengersPerVehicle = clampInteger(
    values.passengersPerVehicle,
    1,
    selectedCapacity,
  );
  const assignVehicleRequests = useMemo(
    () =>
      vehicleRequestsFromSeatSlots({
        passengerSlots: resolvedPassengerSlots,
        vehiclePlans,
      }),
    [resolvedPassengerSlots, vehiclePlans],
  );
  const countVehicleRequests = useMemo(
    () =>
      guestCountVehicleRequests({
        capacity: selectedCapacity,
        guestCount,
        passengersPerVehicle,
        vehicleTypeId: values.vehicleTypeId,
      }),
    [guestCount, passengersPerVehicle, selectedCapacity, values.vehicleTypeId],
  );
  const vehicleRequests =
    passengerInputMode === "guest_count"
      ? countVehicleRequests
      : assignVehicleRequests;
  const reviewPassengers =
    passengerInputMode === "guest_count"
      ? passengersFromVehicleRequests(vehicleRequests)
      : selectedPassengers;
  const passengerCount =
    passengerInputMode === "guest_count"
      ? guestCount
      : selectedPassengerIds.length;
  const hasCapacityOverflow =
    passengerInputMode === "assign_seats" &&
    selectedPassengerIds.length > totalVehicleCapacity;
  const capacityError = hasCapacityOverflow
    ? formatNewBookingCapacityMessage(
        copy.validation.overCapacity,
        totalVehicleCapacity,
      )
    : null;
  const statusMessage =
    errorMessage ?? successMessage ?? disabledReason ?? capacityError;

  useEffect(() => {
    if (!isOpen) return;

    let previousFocused: HTMLElement | null = null;
    if (document.activeElement instanceof HTMLElement) {
      previousFocused = document.activeElement;
    }

    const frame = window.requestAnimationFrame(() => {
      const panel = panelRef.current;
      const activeElement = document.activeElement;

      if (panel && activeElement instanceof HTMLElement) {
        if (panel.contains(activeElement) && activeElement !== panel) {
          return;
        }
      }

      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      previousFocused?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    setPassengerSlots((currentSlots) =>
      normalizePassengerSlots(currentSlots, totalVehicleCapacity),
    );
    setActivePassengerSlotIndex((currentIndex) =>
      currentIndex !== null && currentIndex >= totalVehicleCapacity
        ? null
        : currentIndex,
    );
  }, [totalVehicleCapacity]);

  useEffect(() => {
    if (!isOpen) return;

    setValue(
      "passengerIds",
      passengerInputMode === "guest_count" ? [] : selectedPassengerIds,
      {
        shouldDirty: true,
        shouldValidate: submitCount > 0,
      },
    );
  }, [isOpen, passengerInputMode, selectedPassengerIds, setValue, submitCount]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusables = tabOrderInsidePanel(panel);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const currentIndex =
        active instanceof HTMLElement ? focusables.indexOf(active) : -1;
      const tabForward = !event.shiftKey;

      if (tabForward) {
        if (currentIndex === -1 || currentIndex >= focusables.length - 1) {
          event.preventDefault();
          first.focus();
        }
      } else if (currentIndex <= 0) {
        event.preventDefault();
        last.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const nextDraftKey = draftKey(initialDraft);
    if (appliedDraftKeyRef.current === nextDraftKey) {
      return;
    }

    const nextVehicleCount = vehicleCountForPassengerCount(
      initialDraft?.passengerIds?.length ?? 0,
      defaultVehicleCapacity,
    );
    const initialPassengerSlots = passengerSlotsFromDraft(
      initialDraft,
      nextVehicleCount * defaultVehicleCapacity,
      availablePassengers,
    );
    const initialPassengerIds = initialPassengerSlots
      .map((slot) => slot.memberId)
      .filter((memberId): memberId is string => Boolean(memberId));

    reset({
      ...emptyNewBookingFormValues,
      destinationAddress: initialDraft?.destinationAddress ?? "",
      passengerIds: initialPassengerIds,
      pickupAddress: initialDraft?.pickupAddress ?? "",
    });
    setVehicleCards(
      vehicleCardsForCount(
        nextVehicleCount,
        emptyNewBookingFormValues.vehicleTypeId,
      ),
    );
    setPassengerSlots(initialPassengerSlots);
    setActivePassengerSlotIndex(null);
    setPickupPlace(null);
    setDestinationPlace(null);
    setStep("details");
    appliedDraftKeyRef.current = nextDraftKey;
  }, [
    availablePassengers,
    defaultVehicleCapacity,
    initialDraft,
    isOpen,
    reset,
  ]);

  useEffect(() => {
    if (isOpen) return;

    reset(emptyNewBookingFormValues);
    setPassengerSlots(emptyPassengerSlots(defaultVehicleCapacity));
    setVehicleCards(
      vehicleCardsForCount(1, emptyNewBookingFormValues.vehicleTypeId),
    );
    setActivePassengerSlotIndex(null);
    setPickupPlace(null);
    setDestinationPlace(null);
    setStep("details");
    appliedDraftKeyRef.current = null;
  }, [defaultVehicleCapacity, isOpen, reset]);

  const updateAddressLookupUnavailable = useCallback((
    field: NewBookingAddressField,
    unavailable: boolean,
  ) => {
    setAddressLookupUnavailable((currentState) =>
      currentState[field] === unavailable
        ? currentState
        : { ...currentState, [field]: unavailable },
    );
  }, []);

  if (!isOpen) {
    return null;
  }

  function updatePassengerSlotName(slotIndex: number, name: string) {
    setPassengerSlots((currentSlots) =>
      currentSlots.map((slot, currentIndex) =>
        currentIndex === slotIndex
          ? { ...slot, kind: undefined, memberId: undefined, name }
          : slot,
      ),
    );
    setActivePassengerSlotIndex(slotIndex);
  }

  function selectPassengerForSlot(
    slotIndex: number,
    passenger: NewBookingPassengerOption,
  ) {
    setPassengerSlots((currentSlots) =>
      currentSlots.map((slot, currentIndex) =>
        currentIndex === slotIndex
          ? {
              ...slot,
              kind: "member",
              memberId: passenger.id,
              name: passenger.name,
            }
          : slot,
      ),
    );
    setActivePassengerSlotIndex(null);
  }

  function addGuestPassengerForSlot(slotIndex: number) {
    setPassengerSlots((currentSlots) =>
      currentSlots.map((slot, currentIndex) => {
        if (currentIndex !== slotIndex) return slot;

        const name = slot.name.trim();

        return name.length > 0
          ? { ...slot, kind: "guest", memberId: undefined, name }
          : slot;
      }),
    );
    setActivePassengerSlotIndex(null);
  }

  function clearPassengerSlot(slotIndex: number) {
    setPassengerSlots((currentSlots) =>
      currentSlots.map((slot, currentIndex) =>
        currentIndex === slotIndex
          ? { kind: undefined, name: "", slotId: slot.slotId }
          : slot,
      ),
    );
    setActivePassengerSlotIndex(null);
  }

  function addVehicle() {
    setVehicleCards((currentCards) => {
      const previousVehicleTypeId =
        currentCards[currentCards.length - 1]?.vehicleTypeId ??
        emptyNewBookingFormValues.vehicleTypeId;

      return [...currentCards, { vehicleTypeId: previousVehicleTypeId }];
    });
    setActivePassengerSlotIndex(null);
  }

  function removeVehicle(vehicleIndex: number) {
    const plan = vehiclePlans[vehicleIndex];

    if (vehicleCards.length <= 1 || !plan) {
      return;
    }

    setVehicleCards((currentCards) =>
      currentCards.length <= 1
        ? currentCards
        : currentCards.filter(
            (_, currentIndex) => currentIndex !== vehicleIndex,
          ),
    );
    setPassengerSlots((currentSlots) =>
      reindexPassengerSlots([
        ...currentSlots.slice(0, plan.startSlotIndex),
        ...currentSlots.slice(plan.startSlotIndex + plan.capacity),
      ]),
    );
    setActivePassengerSlotIndex(null);
  }

  function updateVehicleType(vehicleIndex: number, vehicleTypeId: string) {
    const plan = vehiclePlans[vehicleIndex];

    if (!plan) {
      return;
    }

    const nextVehicleType = vehicleTypeForId(
      vehicleTypeId,
      resolvedVehicleTypes,
    );

    setVehicleCards((currentCards) =>
      currentCards.map((vehicleCard, currentIndex) =>
        currentIndex === vehicleIndex
          ? { ...vehicleCard, vehicleTypeId: nextVehicleType.id }
          : vehicleCard,
      ),
    );
    setPassengerSlots((currentSlots) => {
      const currentVehicleSlots = currentSlots.slice(
        plan.startSlotIndex,
        plan.startSlotIndex + plan.capacity,
      );
      const nextVehicleSlots = normalizePassengerSlots(
        currentVehicleSlots,
        nextVehicleType.capacity,
      );

      return reindexPassengerSlots([
        ...currentSlots.slice(0, plan.startSlotIndex),
        ...nextVehicleSlots,
        ...currentSlots.slice(plan.startSlotIndex + plan.capacity),
      ]);
    });
    setActivePassengerSlotIndex(null);
  }

  function applyFavoriteRoute(route: NewBookingFavoriteRoute) {
    setPickupPlace(null);
    setDestinationPlace(null);
    setAddressLookupUnavailable({ destination: false, pickup: false });
    setValue("pickupAddress", route.pickupAddress, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("destinationAddress", route.destinationAddress, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function updateAddressField(field: NewBookingAddressField, value: string) {
    updateAddressLookupUnavailable(field, false);

    if (field === "pickup") {
      setPickupPlace(null);
      setValue("pickupAddress", value, {
        shouldDirty: true,
        shouldValidate: submitCount > 0,
      });
      return;
    }

    setDestinationPlace(null);
    setValue("destinationAddress", value, {
      shouldDirty: true,
      shouldValidate: submitCount > 0,
    });
  }

  function selectAddressField(
    field: NewBookingAddressField,
    selection: NewBookingAddressSelection,
  ) {
    updateAddressLookupUnavailable(field, false);

    if (field === "pickup") {
      setPickupPlace(selection);
      setValue("pickupAddress", selection.formattedAddress, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    setDestinationPlace(selection);
    setValue("destinationAddress", selection.formattedAddress, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function validateAddressSelection(
    field: NewBookingAddressField,
    selection: NewBookingAddressSelection | null,
    address: string,
  ) {
    const formField = field === "pickup" ? "pickupAddress" : "destinationAddress";

    if (!addressSelectionMatchesText(selection, address)) {
      setError(formField, {
        message: copy.validation.googleAddressRequired,
        type: "validate",
      });
      return false;
    }

    if (!addressSelectionHasStreetNumber(selection)) {
      setError(formField, {
        message: copy.validation.houseNumberRequired,
        type: "validate",
      });
      return false;
    }

    clearErrors(formField);
    return true;
  }

  function validateRouteAddressSelections() {
    if (!shouldRequireVerifiedAddresses) {
      return true;
    }

    const pickupIsValid = validateAddressSelection(
      "pickup",
      pickupPlace,
      values.pickupAddress,
    );
    const destinationIsValid = validateAddressSelection(
      "destination",
      destinationPlace,
      values.destinationAddress,
    );

    return pickupIsValid && destinationIsValid;
  }

  function applyQuickPickupTime(action: NewBookingQuickTimeAction) {
    const nextPickup = quickPickupDate(action);

    setValue("pickupDate", formatDateInputValue(nextPickup), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("pickupTime", formatTimeInputValue(nextPickup), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function setCountVehicleType(vehicleTypeId: string) {
    setValue("vehicleTypeId", vehicleTypeId, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function setPassengersPerVehicleCount(count: number) {
    setValue("passengersPerVehicle", count, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function returnToDetails(section: NewBookingReviewSection) {
    const sectionRefs = {
      contact: contactSectionRef,
      dateTime: dateTimeSectionRef,
      notes: notesSectionRef,
      passengerVehicle: passengerVehicleSectionRef,
      route: routeSectionRef,
    } satisfies Record<
      NewBookingReviewSection,
      React.RefObject<HTMLDivElement | null>
    >;

    setStep("details");
    window.requestAnimationFrame(() => {
      const element = sectionRefs[section].current;
      element?.scrollIntoView?.({ block: "start", behavior: "smooth" });
      element
        ?.querySelector<HTMLElement>(
          "input:not([type='hidden']), textarea, select, button",
        )
        ?.focus();
    });
  }

  async function submit(valuesToSubmit: NewBookingOverlayValidatedFormValues) {
    if (disabled || isSubmitting || hasCapacityOverflow) {
      return;
    }

    if (!validateRouteAddressSelections()) {
      setStep("details");
      return;
    }

    const payload = deriveNewBookingSubmitPayload(
      valuesToSubmit,
      passengerOptions,
      vehicleRequests,
    );

    await onSubmit({
      ...payload,
      destinationPlace: destinationPlace ?? undefined,
      pickupPlace: pickupPlace ?? undefined,
    });
  }

  function showReview() {
    if (disabled || isSubmitting || hasCapacityOverflow) {
      return;
    }

    if (!validateRouteAddressSelections()) {
      return;
    }

    setStep("review");
  }
  const activeSubmitHandler: SubmitHandler<NewBookingOverlayValidatedFormValues> =
    step === "review" ? submit : () => showReview();
  const hasRoute =
    values.pickupAddress.trim().length > 0 &&
    values.destinationAddress.trim().length > 0;
  const hasVerifiedRoute = shouldRequireVerifiedAddresses
    ? addressSelectionIsVerified(pickupPlace, values.pickupAddress) &&
      addressSelectionIsVerified(destinationPlace, values.destinationAddress)
    : hasRoute;
  const hasPickupTime =
    values.pickupDate.trim().length > 0 && values.pickupTime.trim().length > 0;

  return (
    <WorkspaceWizardOverlay data-testid="new-booking-overlay">
      <WorkspaceWizardBackdrop
        aria-label={copy.closeLabel}
        onClick={onClose}
        tabIndex={-1}
      />
      <WorkspaceWizardPanel
        ref={panelRef}
        aria-labelledby="new-booking-overlay-title"
        aria-modal="true"
        className={className}
        role="dialog"
      >
        <WorkspaceWizardForm
          onSubmit={handleSubmit(activeSubmitHandler)}
        >
          <WorkspaceWizardHeader>
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <p className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
                  {copy.command.statusLabel}
                </p>
                <h2
                  className="mt-1 font-semibold text-[24px] text-[var(--taxis-workspace-text-strong)] leading-tight tracking-tight"
                  id="new-booking-overlay-title"
                >
                  {copy.title}
                </h2>
                <p className="mt-1 font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
                  {step === "review"
                    ? copy.review.summary
                    : copy.command.livePlanSummary}
                </p>
              </div>
              <WorkspaceCloseButton
                label={copy.closeLabel}
                onClick={onClose}
                ref={closeButtonRef}
              />
            </div>
            <BookingCommandStatusBar
              copy={copy}
              hasPickupTime={hasPickupTime}
              hasRoute={hasVerifiedRoute}
              passengerCount={passengerCount}
              vehicleCount={Math.max(
                vehicleRequests.length,
                vehiclePlans.length,
              )}
            />
          </WorkspaceWizardHeader>

          <WorkspaceWizardBody>
            {step === "details" ? (
              <WorkspaceWizardScroll>
                <WorkspaceWizardLayout>
                  <WorkspaceWizardMainPanel>
                    <WorkspaceWizardSection>
                      <TripTypeSelector
                        copy={copy}
                        register={register}
                        tripType={values.tripType}
                      />
                    </WorkspaceWizardSection>
                    <WorkspaceWizardSection ref={routeSectionRef}>
                      <RouteFields
                        addressAutocomplete={addressAutocomplete}
                        copy={copy}
                        destinationAddress={values.destinationAddress}
                        destinationAddressVerificationState={
                          destinationAddressVerificationState
                        }
                        errors={errors}
                        favoriteRoutes={favoriteRoutes}
                        onAddressChange={updateAddressField}
                        onAddressLookupUnavailable={
                          updateAddressLookupUnavailable
                        }
                        onAddressSelect={selectAddressField}
                        onSelectFavorite={applyFavoriteRoute}
                        pickupAddress={values.pickupAddress}
                        pickupAddressVerificationState={
                          pickupAddressVerificationState
                        }
                        register={register}
                        tripType={values.tripType}
                      />
                    </WorkspaceWizardSection>
                    <WorkspaceWizardSection ref={dateTimeSectionRef}>
                      <DateTimeFields
                        control={control}
                        copy={copy}
                        errors={errors}
                        onQuickPickupTime={applyQuickPickupTime}
                        register={register}
                        tripType={values.tripType}
                      />
                    </WorkspaceWizardSection>
                    <WorkspaceWizardSection ref={passengerVehicleSectionRef}>
                      <VehicleAssignmentSection
                        activeSlotIndex={activePassengerSlotIndex}
                        availablePassengers={availablePassengers}
                        capacityError={capacityError}
                        copy={copy}
                        errors={errors}
                        guestCount={guestCount}
                        inputMode={passengerInputMode}
                        onAddVehicle={addVehicle}
                        onActiveSlotIndexChange={setActivePassengerSlotIndex}
                        onAddGuestPassengerForSlot={addGuestPassengerForSlot}
                        onClearPassengerSlot={clearPassengerSlot}
                        onCountVehicleTypeChange={setCountVehicleType}
                        onPassengersPerVehicleChange={
                          setPassengersPerVehicleCount
                        }
                        onRemoveVehicle={removeVehicle}
                        onSelectPassengerForSlot={selectPassengerForSlot}
                        onVehicleTypeChange={updateVehicleType}
                        onUpdatePassengerSlotName={updatePassengerSlotName}
                        passengerSlots={resolvedPassengerSlots}
                        passengersPerVehicle={passengersPerVehicle}
                        register={register}
                        vehicleCapacity={selectedCapacity}
                        vehiclePlans={vehiclePlans}
                        vehicleRequests={vehicleRequests}
                        vehicleTypes={resolvedVehicleTypes}
                        vehicleTypeId={values.vehicleTypeId}
                      />
                    </WorkspaceWizardSection>
                    <AdvancedDetails copy={copy}>
                      <div className="grid gap-5 md:grid-cols-2">
                        <div ref={contactSectionRef}>
                          <ContactPersonSection
                            copy={copy}
                            passengerOptions={passengerOptions}
                            register={register}
                          />
                        </div>
                        <FlightInformationSection
                          copy={copy}
                          register={register}
                        />
                        <div className="md:col-span-2" ref={notesSectionRef}>
                          <NotesSection copy={copy} register={register} />
                        </div>
                        <div className="md:col-span-2">
                          <RecurringRideSection copy={copy} />
                        </div>
                      </div>
                    </AdvancedDetails>
                  </WorkspaceWizardMainPanel>
                  <BookingLivePlan
                    copy={copy}
                    destinationAddress={values.destinationAddress}
                    passengerCount={passengerCount}
                    pickupAddress={values.pickupAddress}
                    pickupDate={values.pickupDate}
                    pickupTime={values.pickupTime}
                    tripType={values.tripType}
                    vehicleRequests={vehicleRequests}
                    vehicleCount={Math.max(
                      vehicleRequests.length,
                      vehiclePlans.length,
                    )}
                    vehicleTypes={resolvedVehicleTypes}
                  />
                </WorkspaceWizardLayout>
              </WorkspaceWizardScroll>
            ) : (
              <WorkspaceWizardScroll>
                <BookingReviewStep
                  contactPersonId={values.contactPersonId}
                  copy={copy}
                  destinationAddress={values.destinationAddress}
                  flightNumber={values.flightNumber}
                  internalNote={values.internalNote}
                  onChangeSection={returnToDetails}
                  passengerCount={passengerCount}
                  passengerOptions={passengerOptions}
                  pickupAddress={values.pickupAddress}
                  pickupDate={values.pickupDate}
                  pickupTime={values.pickupTime}
                  returnDate={values.returnDate}
                  returnTime={values.returnTime}
                  selectedPassengers={reviewPassengers}
                  tripType={values.tripType}
                  vehicleRequests={vehicleRequests}
                  vehicleTypes={resolvedVehicleTypes}
                />
              </WorkspaceWizardScroll>
            )}
          </WorkspaceWizardBody>

          <WorkspaceWizardFooter role="contentinfo">
            <div className="min-h-5">
              {statusMessage ? (
                <p
                  aria-live={
                    errorMessage || capacityError ? "assertive" : "polite"
                  }
                  className={cn(
                    "font-medium text-[12px]",
                    errorMessage || capacityError
                      ? "text-[var(--taxis-status-danger-text)]"
                      : "text-[var(--taxis-workspace-text-muted)]",
                  )}
                  role={errorMessage || capacityError ? "alert" : "status"}
                >
                  {statusMessage}
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                className={FOOTER_CTA_CLASS}
                disabled={isSubmitting}
                onClick={onClose}
                type="button"
                variant="outline"
              >
                {copy.cancelLabel}
              </Button>
              {step === "review" ? (
                <Button
                  className={FOOTER_CTA_CLASS}
                  disabled={isSubmitting}
                  onClick={() => setStep("details")}
                  type="button"
                  variant="outline"
                >
                  {copy.review.backLabel}
                </Button>
              ) : null}
              <Button
                aria-busy={isSubmitting}
                className={FOOTER_CTA_CLASS}
                disabled={disabled || isSubmitting || hasCapacityOverflow}
                type="submit"
                variant="brand"
              >
                {isSubmitting
                  ? copy.submittingLabel
                  : step === "review"
                    ? copy.submitLabel
                    : copy.review.nextLabel}
              </Button>
            </div>
          </WorkspaceWizardFooter>
        </WorkspaceWizardForm>
      </WorkspaceWizardPanel>
    </WorkspaceWizardOverlay>
  );
}

type RegisteredForm = ReturnType<
  typeof useForm<
    NewBookingOverlayFormValues,
    unknown,
    NewBookingOverlayValidatedFormValues
  >
>;

function SectionHeader({
  action,
  title,
}: {
  action?: React.ReactNode;
  title: string;
}) {
  const titleId = sectionTitleId(title);

  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h3
        className="font-semibold text-taxis-section-sm text-[var(--taxis-workspace-text-strong)] tracking-tight"
        id={titleId}
      >
        {title}
      </h3>
      {action}
    </div>
  );
}

function BookingCommandStatusBar({
  copy,
  hasPickupTime,
  hasRoute,
  passengerCount,
  vehicleCount,
}: {
  copy: NewBookingOverlayCopy;
  hasPickupTime: boolean;
  hasRoute: boolean;
  passengerCount: number;
  vehicleCount: number;
}) {
  const items = [
    {
      data: false,
      icon: MapPin,
      label: hasRoute
        ? copy.command.routeReadyLabel
        : copy.command.routeOpenLabel,
      ready: hasRoute,
    },
    {
      data: false,
      icon: Clock,
      label: hasPickupTime
        ? copy.command.timeReadyLabel
        : copy.command.timeOpenLabel,
      ready: hasPickupTime,
    },
    {
      data: true,
      icon: Users,
      label: formatPassengerCountLabel(copy, passengerCount),
      ready: passengerCount > 0,
    },
    {
      data: true,
      icon: Car,
      label: formatVehicleCountLabel(copy, vehicleCount),
      ready: vehicleCount > 0,
    },
  ];

  return (
    <WorkspaceWizardStatusGrid>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <WorkspaceWizardStatusItem key={item.label} ready={item.ready}>
            <Icon aria-hidden="true" className="shrink-0" size={16} />
            <span
              className="min-w-0 truncate font-semibold text-[12px]"
            >
              {item.data ? <LeadingDataLabel label={item.label} /> : item.label}
            </span>
          </WorkspaceWizardStatusItem>
        );
      })}
    </WorkspaceWizardStatusGrid>
  );
}

function VehicleTypeCardPicker({
  ariaLabel,
  compact = false,
  copy,
  onChange,
  selectedVehicleTypeId,
  vehicleTypes,
}: {
  ariaLabel: string;
  compact?: boolean;
  copy: NewBookingOverlayCopy;
  onChange: (vehicleTypeId: string) => void;
  selectedVehicleTypeId: string;
  vehicleTypes: readonly NewBookingVehicleTypeOption[];
}) {
  return (
    <fieldset aria-label={ariaLabel}>
      <div
        className={cn(
          "grid gap-2",
          compact ? "sm:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-4",
        )}
      >
        {vehicleTypes.map((vehicleType) => {
          const selected = vehicleType.id === selectedVehicleTypeId;
          const description =
            vehicleType.description ?? copy.vehicle.cardDescriptionFallback;
          const luggageHint =
            vehicleType.luggageHint ?? copy.vehicle.cardDescriptionFallback;
          const radioLabel = `${ariaLabel} ${vehicleType.label} ${vehicleType.capacity} ${copy.vehicle.typeSeatsLabel} ${luggageHint}`;

          return (
            <label
              className={cn(
                "group flex min-h-[104px] cursor-pointer flex-col justify-between rounded-[18px] border bg-[var(--taxis-workspace-surface)] p-3.5 text-left shadow-[var(--taxis-workspace-shadow-overlay)] transition-all focus-within:border-[var(--taxis-workspace-accent-ring)] focus-within:ring-3 focus-within:ring-[var(--taxis-workspace-focus-ring)]",
                selected
                  ? "border-[var(--taxis-workspace-accent-ring)] bg-[var(--taxis-workspace-accent-soft)] shadow-[inset_0_0_0_1px_var(--taxis-workspace-accent-ring)]"
                  : "border-[var(--taxis-workspace-surface-rim)] hover:border-[var(--taxis-workspace-surface-rim-strong)] hover:bg-[var(--taxis-workspace-surface-soft)]",
              )}
              key={vehicleType.id}
            >
              <input
                aria-label={radioLabel}
                checked={selected}
                className="sr-only"
                name={`${ariaLabel}-vehicle-type`}
                onChange={() => onChange(vehicleType.id)}
                type="radio"
              />
              <span className="flex items-start justify-between gap-2">
                <span>
                  <span className="block font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
                    {vehicleType.label}
                  </span>
                  <span className="mt-1 block font-medium text-[11px] text-[var(--taxis-workspace-text-muted)] leading-snug">
                    {description}
                  </span>
                </span>
                <span className="rounded-full bg-[var(--taxis-workspace-surface-deep)] px-2 py-1 font-semibold text-[10px] text-[var(--taxis-workspace-text-secondary)] ring-1 ring-[var(--taxis-workspace-border)]">
                  <span className="taxis-data-inline">
                    {vehicleType.capacity}
                  </span>{" "}
                  {copy.vehicle.typeSeatsLabel}
                </span>
              </span>
              <span className="mt-3 inline-flex w-fit rounded-md bg-[var(--taxis-workspace-surface-deep)] px-2.5 py-1 font-semibold text-[10px] text-[var(--taxis-workspace-text-secondary)] ring-1 ring-[var(--taxis-workspace-border)]">
                {luggageHint}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function VehicleRequestPreview({
  copy,
  request,
  vehicleTypes,
}: {
  copy: NewBookingOverlayCopy;
  request: NewBookingVehicleRequest;
  vehicleTypes: readonly NewBookingVehicleTypeOption[];
}) {
  const vehicleType = vehicleTypeForId(request.vehicleTypeId, vehicleTypes);
  const passengerNames = request.passengers
    .map((passenger) => passenger.name)
    .join(", ");

  return (
    <div className="rounded-[16px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-3.5 py-3 shadow-[var(--taxis-workspace-shadow-overlay)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-[12px] text-[var(--taxis-workspace-text-strong)]">
            {formatVehicleCardLabel(
              copy.vehicle.vehicleCardLabel,
              request.ordinal,
            )}
          </p>
          <p className="mt-1 font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
            {vehicleType.label} / {copy.vehicle.capacityLabel}:{" "}
            <span className="taxis-data-inline">{request.capacity}</span>
          </p>
        </div>
        <span className="taxis-data-inline shrink-0 rounded-full bg-[var(--taxis-workspace-surface-deep)] px-2.5 py-1 font-semibold text-[10px] text-[var(--taxis-workspace-text-secondary)] ring-1 ring-[var(--taxis-workspace-border)]">
          {request.passengers.length}
        </span>
      </div>
      <p className="mt-2 font-medium text-[11px] text-[var(--taxis-workspace-text-muted)] leading-relaxed">
        {passengerNames || copy.passenger.emptyLabel}
      </p>
    </div>
  );
}

function BookingLivePlan({
  copy,
  destinationAddress,
  passengerCount,
  pickupAddress,
  pickupDate,
  pickupTime,
  tripType,
  vehicleCount,
  vehicleRequests,
  vehicleTypes,
}: {
  copy: NewBookingOverlayCopy;
  destinationAddress: string;
  passengerCount: number;
  pickupAddress: string;
  pickupDate: string;
  pickupTime: string;
  tripType: NewBookingTripType;
  vehicleCount: number;
  vehicleRequests: readonly NewBookingVehicleRequest[];
  vehicleTypes: readonly NewBookingVehicleTypeOption[];
}) {
  const tripTypeLabel = {
    one_way_outbound: copy.tripType.outbound,
    round_trip: copy.tripType.roundTrip,
  } satisfies Record<NewBookingTripType, string>;
  const dateTime =
    pickupDate.trim().length > 0 || pickupTime.trim().length > 0
      ? `${pickupDate || "-"} ${pickupTime || "-"}`
      : copy.command.timeOpenLabel;

  return (
    <WorkspaceWizardRail>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
            {copy.command.statusLabel}
          </p>
          <h3 className="mt-1 font-semibold text-taxis-section-md text-[var(--taxis-workspace-text-strong)] tracking-tight">
            {copy.command.livePlanTitle}
          </h3>
        </div>
        <span className="rounded-full bg-[var(--taxis-workspace-surface-deep)] px-3 py-1.5 font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)] ring-1 ring-[var(--taxis-workspace-border)]">
          <LeadingDataLabel label={formatVehicleCountLabel(copy, vehicleCount)} />
        </span>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-[20px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface-soft)]/70 p-4">
          <SummaryStop
            label={copy.route.pickupLabel}
            value={pickupAddress.trim() || copy.summary.pickupFallback}
          />
          <div className="mt-3">
            <SummaryStop
              label={copy.route.destinationLabel}
              tone="destination"
              value={
                destinationAddress.trim() || copy.summary.destinationFallback
              }
            />
          </div>
        </div>

        <div className="grid gap-2">
          <LivePlanMetric
            dataValue
            icon={<CalendarClock aria-hidden="true" size={16} />}
            label={copy.summary.dateTimeLabel}
            value={dateTime}
          />
          <LivePlanMetric
            dataValue
            icon={<Users aria-hidden="true" size={16} />}
            label={copy.summary.totalPassengersLabel}
            valueScope="leading"
            value={formatPassengerCountLabel(copy, passengerCount)}
          />
          <LivePlanMetric
            icon={<Car aria-hidden="true" size={16} />}
            label={copy.summary.tripTypeLabel}
            value={tripTypeLabel[tripType]}
          />
        </div>

        <div className="space-y-2 border-[var(--taxis-workspace-border)] border-t pt-4">
          {vehicleRequests.map((request) => (
            <VehicleRequestPreview
              copy={copy}
              key={request.ordinal}
              request={request}
              vehicleTypes={vehicleTypes}
            />
          ))}
        </div>
      </div>
    </WorkspaceWizardRail>
  );
}

function LivePlanMetric({
  dataValue = false,
  icon,
  label,
  value,
  valueScope = "full",
}: {
  dataValue?: boolean;
  icon: React.ReactNode;
  label: string;
  value: string;
  valueScope?: "full" | "leading";
}) {
  return (
    <div className="flex items-center gap-3 rounded-[16px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-3.5 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--taxis-workspace-surface-deep)] text-[var(--taxis-workspace-text-secondary)]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
          {label}
        </p>
        <p className="truncate font-semibold text-[12px] text-[var(--taxis-workspace-text-strong)]">
          {dataValue && valueScope === "leading" ? (
            <LeadingDataLabel label={value} />
          ) : (
            <span className={cn(dataValue && "taxis-data-inline")}>
              {value}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

function ChangeSectionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex min-h-[var(--taxis-control-h-sm)] items-center justify-center rounded-[var(--taxis-radius-control)] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-3 font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)] transition-all hover:border-[var(--taxis-workspace-accent-ring)] hover:bg-[var(--taxis-workspace-accent-soft)] hover:text-[var(--taxis-workspace-accent-strong)] focus-visible:outline-2 focus-visible:outline-[var(--taxis-workspace-accent)] focus-visible:outline-offset-2"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function AdvancedDetails({
  children,
  copy,
}: {
  children: React.ReactNode;
  copy: NewBookingOverlayCopy;
}) {
  return (
    <details className="group border-[var(--taxis-workspace-border)] border-t">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 md:px-6">
        <div>
          <p className="font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)]">
            {copy.advanced.title}
          </p>
          <p className="mt-1 font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
            {copy.advanced.summary}
          </p>
        </div>
        <ChevronDown
          aria-hidden="true"
          className="shrink-0 text-[var(--taxis-workspace-text-muted)] transition-transform group-open:rotate-180"
          size={18}
        />
      </summary>
      <div className="border-[var(--taxis-workspace-border)] border-t px-5 py-5 md:px-6">
        {children}
      </div>
    </details>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p
      className="font-medium text-[11px] text-[var(--taxis-status-danger-text)]"
      role="alert"
    >
      {message}
    </p>
  );
}

function AddressVerificationStatus({
  copy,
  state,
}: {
  copy: NewBookingOverlayCopy;
  state: NewBookingAddressVerificationState | null;
}) {
  if (state === null) {
    return null;
  }

  const labels =
    state === "verified"
      ? [
          copy.addressVerification.googleSelectedLabel,
          copy.addressVerification.houseNumberDetectedLabel,
        ]
      : [
          state === "missing_google_selection"
            ? copy.addressVerification.missingGoogleSelectionLabel
            : state === "missing_house_number"
              ? copy.addressVerification.missingHouseNumberLabel
              : copy.addressVerification.unavailableLabel,
        ];
  const isVerified = state === "verified";

  return (
    <div className="flex flex-wrap gap-1.5" role="status">
      {labels.map((label) => (
        <span
          className={cn(
            "inline-flex min-h-7 items-center rounded-[999px] border px-2.5 py-1 font-semibold text-[11px]",
            isVerified
              ? "border-[var(--taxis-workspace-control-dark)] bg-[var(--taxis-workspace-surface-deep)] text-[var(--taxis-workspace-text-strong)]"
              : "border-[var(--taxis-workspace-accent-ring)] bg-[var(--taxis-workspace-accent-soft)] text-[var(--taxis-workspace-accent-strong)]",
          )}
          key={label}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function FormField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Label className="grid gap-2 text-[var(--taxis-workspace-text-secondary)]">
      <span className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
        {label}
      </span>
      {children}
    </Label>
  );
}

type AddressFieldRegistration = ReturnType<RegisteredForm["register"]>;

function AddressAutocompleteInput({
  autocomplete,
  copy,
  field,
  onChange,
  onLookupUnavailable,
  onSelect,
  placeholder,
  registration,
  value,
}: {
  autocomplete?: NewBookingAddressAutocompleteController;
  copy: NewBookingOverlayCopy;
  field: NewBookingAddressField;
  onChange: (field: NewBookingAddressField, value: string) => void;
  onLookupUnavailable: (
    field: NewBookingAddressField,
    unavailable: boolean,
  ) => void;
  onSelect: (
    field: NewBookingAddressField,
    selection: NewBookingAddressSelection,
  ) => void;
  placeholder: string;
  registration: AddressFieldRegistration;
  value: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [hasRequestedSuggestions, setHasRequestedSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<
    readonly NewBookingAddressSuggestion[]
  >([]);
  const requestSequenceRef = useRef(0);
  const listboxId = `new-booking-${field}-address-suggestions`;
  const showListbox =
    isOpen &&
    Boolean(autocomplete) &&
    (isLoading ||
      hasError ||
      suggestions.length > 0 ||
      hasRequestedSuggestions);

  useEffect(() => {
    if (!autocomplete || !isFocused || value.trim().length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      setHasError(false);
      setHasRequestedSuggestions(false);
      return;
    }

    const requestId = requestSequenceRef.current + 1;
    requestSequenceRef.current = requestId;
    const timeout = window.setTimeout(() => {
      setIsLoading(true);
      setHasError(false);

      autocomplete
        .getSuggestions(value, field)
        .then((nextSuggestions) => {
          if (requestSequenceRef.current !== requestId) {
            return;
          }

          setSuggestions(nextSuggestions);
          setActiveIndex(0);
          setHasRequestedSuggestions(true);
          setIsOpen(true);
          onLookupUnavailable(field, false);
        })
        .catch(() => {
          if (requestSequenceRef.current !== requestId) {
            return;
          }

          setSuggestions([]);
          setHasError(true);
          setHasRequestedSuggestions(true);
          setIsOpen(true);
          onLookupUnavailable(field, true);
        })
        .finally(() => {
          if (requestSequenceRef.current === requestId) {
            setIsLoading(false);
          }
        });
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [autocomplete, field, isFocused, onLookupUnavailable, value]);

  async function selectSuggestion(suggestion: NewBookingAddressSuggestion) {
    if (!autocomplete) {
      return;
    }

    setIsLoading(true);
    setHasError(false);
    onLookupUnavailable(field, false);

    try {
      const selection = await autocomplete.resolveSuggestion(suggestion, field);

      if (selection !== null) {
        onSelect(field, selection);
      }

      setSuggestions([]);
      setIsOpen(false);
    } catch {
      setHasError(true);
      setIsOpen(true);
      onLookupUnavailable(field, true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showListbox) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      event.stopPropagation();
      setActiveIndex((currentIndex) =>
        suggestions.length === 0 ? 0 : (currentIndex + 1) % suggestions.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();
      setActiveIndex((currentIndex) =>
        suggestions.length === 0
          ? 0
          : (currentIndex - 1 + suggestions.length) % suggestions.length,
      );
      return;
    }

    if (event.key === "Enter" && suggestions[activeIndex]) {
      event.preventDefault();
      event.stopPropagation();
      void selectSuggestion(suggestions[activeIndex]);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
    }
  }

  return (
    <div className="relative">
      <Input
        aria-activedescendant={
          showListbox && suggestions[activeIndex]
            ? `${listboxId}-${suggestions[activeIndex].id}`
            : undefined
        }
        aria-autocomplete={autocomplete ? "list" : undefined}
        aria-controls={showListbox ? listboxId : undefined}
        aria-expanded={showListbox}
        autoComplete="off"
        className="h-[var(--taxis-control-h-md)] rounded-[var(--taxis-radius-control)] bg-[var(--taxis-workspace-surface)] px-3.5"
        data-1p-ignore="true"
        data-lpignore="true"
        name={registration.name}
        onBlur={(event) => {
          registration.onBlur(event);
          window.setTimeout(() => setIsOpen(false), 120);
        }}
        onChange={(event) => {
          onChange(field, event.currentTarget.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          setIsFocused(true);
          setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        ref={registration.ref}
        role={autocomplete ? "combobox" : undefined}
        value={value}
      />
      {showListbox ? (
        <div
          aria-label={copy.addressAutocomplete.suggestionListLabel}
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-[16px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] shadow-[var(--taxis-workspace-shadow-overlay)]"
          id={listboxId}
          role="listbox"
        >
          {isLoading ? (
            <p
              className="px-3.5 py-3 font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]"
              role="status"
            >
              {copy.addressAutocomplete.loadingLabel}
            </p>
          ) : null}
          {!isLoading && hasError ? (
            <p className="px-3.5 py-3 font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
              {copy.addressAutocomplete.errorLabel}
            </p>
          ) : null}
          {!isLoading &&
          !hasError &&
          hasRequestedSuggestions &&
          suggestions.length === 0 ? (
            <p className="px-3.5 py-3 font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
              {copy.addressAutocomplete.noResultsLabel}
            </p>
          ) : null}
          {!isLoading && !hasError
            ? suggestions.map((suggestion, suggestionIndex) => (
                <button
                  aria-selected={suggestionIndex === activeIndex}
                  className={cn(
                    "grid w-full gap-0.5 px-3.5 py-3 text-left transition-colors hover:bg-[var(--taxis-workspace-surface-soft)] focus-visible:bg-[var(--taxis-workspace-surface-soft)] focus-visible:outline-none",
                    suggestionIndex === activeIndex
                      ? "bg-[var(--taxis-workspace-surface-soft)]"
                      : "bg-transparent",
                  )}
                  id={`${listboxId}-${suggestion.id}`}
                  key={suggestion.id}
                  onClick={() => void selectSuggestion(suggestion)}
                  onMouseDown={(event) => event.preventDefault()}
                  role="option"
                  type="button"
                >
                  <span className="font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
                    {suggestion.mainText}
                  </span>
                  {suggestion.secondaryText ? (
                    <span className="font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
                      {suggestion.secondaryText}
                    </span>
                  ) : null}
                </button>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
}

export function TripTypeSelector({
  copy,
  register,
  tripType,
}: {
  copy: NewBookingOverlayCopy;
  register: RegisteredForm["register"];
  tripType: NewBookingTripType;
}) {
  const options = [
    {
      label: copy.tripType.outbound,
      value: "one_way_outbound",
    },
    {
      label: copy.tripType.roundTrip,
      value: "round_trip",
    },
  ] satisfies readonly { label: string; value: NewBookingTripType }[];

  return (
    <fieldset aria-labelledby={sectionTitleId(copy.tripType.title)}>
      <SectionHeader title={copy.tripType.title} />
      <div className="taxis-segmented-track grid items-stretch gap-1 rounded-[var(--taxis-radius-control)] border p-1 md:grid-cols-2">
        {options.map((option) => (
          <label
            className={cn(
              "taxis-segmented-item flex h-full min-h-[var(--taxis-control-h-md)] cursor-pointer items-center justify-center rounded-[calc(var(--taxis-radius-control)-2px)] border px-4 py-2.5 text-center transition-all focus-within:ring-3 focus-within:ring-[var(--taxis-workspace-focus-ring)]",
              tripType === option.value
                ? "taxis-segmented-active border-[var(--taxis-workspace-control-dark)] bg-[var(--taxis-workspace-control-dark)] text-[var(--taxis-workspace-surface)]"
                : "border-transparent text-[var(--taxis-workspace-text-secondary)]",
            )}
            key={option.value}
          >
            <input
              className="sr-only"
              type="radio"
              value={option.value}
              {...register("tripType")}
            />
            <span className="pointer-events-none font-semibold text-[13px] leading-snug">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function RouteFields({
  addressAutocomplete,
  copy,
  destinationAddress,
  destinationAddressVerificationState,
  errors,
  favoriteRoutes,
  onAddressChange,
  onAddressLookupUnavailable,
  onAddressSelect,
  onSelectFavorite,
  pickupAddress,
  pickupAddressVerificationState,
  register,
  tripType,
}: {
  addressAutocomplete?: NewBookingAddressAutocompleteController;
  copy: NewBookingOverlayCopy;
  destinationAddress: string;
  destinationAddressVerificationState: NewBookingAddressVerificationState | null;
  errors: RegisteredForm["formState"]["errors"];
  favoriteRoutes: readonly NewBookingFavoriteRoute[];
  onAddressChange: (field: NewBookingAddressField, value: string) => void;
  onAddressLookupUnavailable: (
    field: NewBookingAddressField,
    unavailable: boolean,
  ) => void;
  onAddressSelect: (
    field: NewBookingAddressField,
    selection: NewBookingAddressSelection,
  ) => void;
  onSelectFavorite: (route: NewBookingFavoriteRoute) => void;
  pickupAddress: string;
  pickupAddressVerificationState: NewBookingAddressVerificationState | null;
  register: RegisteredForm["register"];
  tripType: NewBookingTripType;
}) {
  const pickupRegistration = register("pickupAddress");
  const destinationRegistration = register("destinationAddress");

  return (
    <section aria-labelledby={sectionTitleId(copy.route.title)}>
      <SectionHeader title={copy.route.title} />
      <div className="relative grid gap-3">
        <span
          aria-hidden="true"
          className="absolute top-12 bottom-12 left-[5px] w-px bg-[var(--taxis-workspace-border)]"
        />
        <RouteAddressRow tone="pickup">
          <FormField label={copy.route.pickupLabel}>
            <AddressAutocompleteInput
              autocomplete={addressAutocomplete}
              copy={copy}
              field="pickup"
              onChange={onAddressChange}
              onLookupUnavailable={onAddressLookupUnavailable}
              onSelect={onAddressSelect}
              placeholder={copy.route.pickupPlaceholder}
              registration={pickupRegistration}
              value={pickupAddress}
            />
            <FieldError message={errors.pickupAddress?.message} />
            <AddressVerificationStatus
              copy={copy}
              state={pickupAddressVerificationState}
            />
          </FormField>
        </RouteAddressRow>
        <RouteAddressRow tone="destination">
          <FormField label={copy.route.destinationLabel}>
            <AddressAutocompleteInput
              autocomplete={addressAutocomplete}
              copy={copy}
              field="destination"
              onChange={onAddressChange}
              onLookupUnavailable={onAddressLookupUnavailable}
              onSelect={onAddressSelect}
              placeholder={copy.route.destinationPlaceholder}
              registration={destinationRegistration}
              value={destinationAddress}
            />
            <FieldError message={errors.destinationAddress?.message} />
            <AddressVerificationStatus
              copy={copy}
              state={destinationAddressVerificationState}
            />
          </FormField>
        </RouteAddressRow>
      </div>
      {tripType === "round_trip" ? (
        <ReturnRoutePreview
          copy={copy}
          destinationAddress={destinationAddress}
          pickupAddress={pickupAddress}
        />
      ) : null}
      <div className="mt-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
            {copy.favorites.title}
          </p>
        </div>
        {favoriteRoutes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {favoriteRoutes.map((route) => (
              <button
                className="rounded-[12px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-3 py-2 font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)] transition-colors hover:border-[var(--taxis-workspace-surface-rim-strong)] hover:bg-[var(--taxis-workspace-surface-soft)] hover:text-[var(--taxis-workspace-text-primary)]"
                key={route.id}
                onClick={() => onSelectFavorite(route)}
                type="button"
              >
                {route.title}
              </button>
            ))}
          </div>
        ) : (
          // TODO(new-booking-favorites): Replace this placeholder with backend-backed favorite routes/locations.
          <p className="font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
            {copy.favorites.emptyLabel}
          </p>
        )}
      </div>
    </section>
  );
}

function ReturnRoutePreview({
  copy,
  destinationAddress,
  pickupAddress,
}: {
  copy: NewBookingOverlayCopy;
  destinationAddress: string;
  pickupAddress: string;
}) {
  const hasCompleteRoute =
    destinationAddress.trim().length > 0 && pickupAddress.trim().length > 0;

  if (!hasCompleteRoute) {
    return (
      <p className="mt-4 rounded-[14px] bg-[var(--taxis-workspace-surface-soft)]/70 px-3.5 py-2.5 font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
        {copy.route.returnPendingLabel}
      </p>
    );
  }

  const returnPickup = destinationAddress.trim();
  const returnDestination = pickupAddress.trim();

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-[14px] bg-[var(--taxis-workspace-surface-soft)]/70 px-3.5 py-2.5">
      <p className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
        {copy.route.returnPreviewLabel}
      </p>
      <p className="min-w-0 truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
        {returnPickup} -&gt; {returnDestination}
      </p>
    </div>
  );
}

function RouteAddressRow({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "destination" | "pickup";
}) {
  return (
    <div className="grid grid-cols-[26px_minmax(0,1fr)] gap-3">
      <span
        aria-hidden="true"
        className={cn(
          "relative z-10 mt-8 h-3 w-3 rounded-full ring-4 ring-white",
          tone === "pickup"
            ? "bg-[var(--taxis-workspace-accent)]"
            : "bg-[var(--taxis-workspace-text-strong)]",
        )}
      />
      {children}
    </div>
  );
}

export function DateTimeFields({
  control,
  copy,
  errors,
  onQuickPickupTime,
  register,
  tripType,
}: {
  control: RegisteredForm["control"];
  copy: NewBookingOverlayCopy;
  errors: RegisteredForm["formState"]["errors"];
  onQuickPickupTime: (action: NewBookingQuickTimeAction) => void;
  register: RegisteredForm["register"];
  tripType: NewBookingTripType;
}) {
  const quickActions = [
    { action: "now", label: copy.dateTime.quickNowLabel },
    { action: "plus_30", label: copy.dateTime.quickThirtyMinutesLabel },
    { action: "plus_60", label: copy.dateTime.quickOneHourLabel },
    {
      action: "tomorrow_0800",
      label: copy.dateTime.quickTomorrowMorningLabel,
    },
  ] satisfies readonly {
    action: NewBookingQuickTimeAction;
    label: string;
  }[];

  return (
    <section aria-labelledby={sectionTitleId(copy.dateTime.title)}>
      <SectionHeader title={copy.dateTime.title} />
      <div className="mb-4 flex flex-wrap gap-2">
        {quickActions.map((quickAction) => (
          <button
          className="inline-flex min-h-[var(--taxis-control-h-sm)] items-center justify-center rounded-[var(--taxis-radius-control)] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-3.5 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)] shadow-[var(--taxis-workspace-shadow-overlay)] transition-all hover:border-[var(--taxis-workspace-surface-rim-strong)] hover:bg-[var(--taxis-workspace-surface-soft)] hover:text-[var(--taxis-workspace-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--taxis-workspace-accent)] focus-visible:outline-offset-2"
            key={quickAction.action}
            onClick={() => onQuickPickupTime(quickAction.action)}
            type="button"
          >
            {quickAction.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <FormField label={copy.dateTime.pickupDateLabel}>
          <Controller
            control={control}
            name="pickupDate"
            render={({ field, fieldState }) => (
              <TaxiDateField
                aria-invalid={fieldState.invalid || undefined}
                inputRef={field.ref}
                name={field.name}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
                value={field.value ?? ""}
              />
            )}
          />
          <FieldError message={errors.pickupDate?.message} />
        </FormField>
        <FormField label={copy.dateTime.pickupTimeLabel}>
          <Controller
            control={control}
            name="pickupTime"
            render={({ field, fieldState }) => (
              <TaxiTimeField
                aria-invalid={fieldState.invalid || undefined}
                inputRef={field.ref}
                name={field.name}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
                value={field.value ?? ""}
              />
            )}
          />
          <FieldError message={errors.pickupTime?.message} />
        </FormField>
        {tripType === "round_trip" ? (
          <>
            <FormField label={copy.dateTime.returnDateLabel}>
              <Input
                className="h-[var(--taxis-control-h-md)] rounded-[var(--taxis-radius-control)] bg-[var(--taxis-workspace-surface)] px-3.5"
                type="date"
                {...register("returnDate")}
              />
              <FieldError message={errors.returnDate?.message} />
            </FormField>
            <FormField label={copy.dateTime.returnTimeLabel}>
              <Input
                className="h-[var(--taxis-control-h-md)] rounded-[var(--taxis-radius-control)] bg-[var(--taxis-workspace-surface)] px-3.5"
                type="time"
                {...register("returnTime")}
              />
              <FieldError message={errors.returnTime?.message} />
            </FormField>
          </>
        ) : null}
      </div>
    </section>
  );
}

function FlightInformationSection({
  copy,
  register,
}: {
  copy: NewBookingOverlayCopy;
  register: RegisteredForm["register"];
}) {
  return (
    <section aria-labelledby={sectionTitleId(copy.flight.title)}>
      <SectionHeader title={copy.flight.title} />
      <FormField label={copy.flight.label}>
        <Input
          className="h-[var(--taxis-control-h-md)] rounded-[var(--taxis-radius-control)] bg-[var(--taxis-workspace-surface)] px-3.5"
          placeholder={copy.flight.placeholder}
          {...register("flightNumber")}
        />
      </FormField>
    </section>
  );
}

export function VehicleAssignmentSection({
  activeSlotIndex,
  availablePassengers,
  capacityError,
  copy,
  errors,
  guestCount,
  inputMode,
  onAddVehicle,
  onActiveSlotIndexChange,
  onAddGuestPassengerForSlot,
  onClearPassengerSlot,
  onCountVehicleTypeChange,
  onPassengersPerVehicleChange,
  onRemoveVehicle,
  onSelectPassengerForSlot,
  onVehicleTypeChange,
  onUpdatePassengerSlotName,
  passengerSlots,
  passengersPerVehicle,
  register,
  vehicleCapacity,
  vehiclePlans,
  vehicleRequests,
  vehicleTypes,
  vehicleTypeId,
}: {
  activeSlotIndex: number | null;
  availablePassengers: readonly NewBookingPassengerOption[];
  capacityError: string | null;
  copy: NewBookingOverlayCopy;
  errors: RegisteredForm["formState"]["errors"];
  guestCount: number;
  inputMode: NewBookingPassengerInputMode;
  onAddVehicle: () => void;
  onActiveSlotIndexChange: (slotIndex: number | null) => void;
  onAddGuestPassengerForSlot: (slotIndex: number) => void;
  onClearPassengerSlot: (slotIndex: number) => void;
  onCountVehicleTypeChange: (vehicleTypeId: string) => void;
  onPassengersPerVehicleChange: (count: number) => void;
  onRemoveVehicle: (vehicleIndex: number) => void;
  onSelectPassengerForSlot: (
    slotIndex: number,
    passenger: NewBookingPassengerOption,
  ) => void;
  onVehicleTypeChange: (vehicleIndex: number, vehicleTypeId: string) => void;
  onUpdatePassengerSlotName: (slotIndex: number, name: string) => void;
  passengerSlots: readonly ResolvedPassengerSlot[];
  passengersPerVehicle: number;
  register: RegisteredForm["register"];
  vehicleCapacity: number;
  vehiclePlans: readonly VehicleSlotPlan[];
  vehicleRequests: readonly NewBookingVehicleRequest[];
  vehicleTypes: readonly NewBookingVehicleTypeOption[];
  vehicleTypeId: string;
}) {
  const selectedCountVehicleType = vehicleTypeForId(
    vehicleTypeId,
    vehicleTypes,
  );

  return (
    <section aria-labelledby={sectionTitleId(copy.vehicle.title)}>
      <SectionHeader title={copy.vehicle.title} />
      <fieldset aria-label={copy.vehicle.inputModeLabel}>
        <div className="grid gap-1 rounded-[var(--taxis-radius-control)] border border-[var(--taxis-workspace-control-dark)] bg-[var(--taxis-workspace-surface-deep)] p-1 shadow-[var(--taxis-workspace-shadow-overlay)] md:grid-cols-2">
          {[
            {
              label: copy.vehicle.assignSeatsModeLabel,
              value: "assign_seats" as const,
            },
            {
              label: copy.vehicle.guestCountModeLabel,
              value: "guest_count" as const,
            },
          ].map((option) => (
            <label
              className={cn(
                "flex min-h-[var(--taxis-control-h-md)] cursor-pointer items-center justify-center rounded-[calc(var(--taxis-radius-control)-2px)] border px-4 py-2.5 text-center transition-all focus-within:ring-3 focus-within:ring-[var(--taxis-workspace-focus-ring)]",
                inputMode === option.value
                  ? "border-[var(--taxis-workspace-control-dark)] bg-[var(--taxis-workspace-control-dark)] text-[var(--taxis-workspace-surface)] shadow-[var(--taxis-workspace-shadow-command)]"
                  : "border-transparent text-[var(--taxis-workspace-text-strong)] hover:border-[var(--taxis-workspace-control-dark)] hover:text-[var(--taxis-workspace-text-strong)]",
              )}
              key={option.value}
            >
              <input
                className="sr-only"
                type="radio"
                value={option.value}
                {...register("passengerInputMode")}
              />
              <span className="pointer-events-none font-semibold text-[13px] leading-snug">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {inputMode === "guest_count" ? (
        <div className="mt-4 rounded-[18px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface-soft)]/70 p-4">
          <select
            aria-label={copy.vehicle.typeLabel}
            className="sr-only"
            {...register("vehicleTypeId")}
          >
            {vehicleTypes.map((vehicleType) => (
              <option key={vehicleType.id} value={vehicleType.id}>
                {vehicleType.label}
              </option>
            ))}
          </select>
          <VehicleTypeCardPicker
            ariaLabel={`${copy.vehicle.typeLabel} Karten`}
            copy={copy}
            onChange={onCountVehicleTypeChange}
            selectedVehicleTypeId={vehicleTypeId}
            vehicleTypes={vehicleTypes}
          />
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <FormField label={copy.vehicle.guestCountLabel}>
              <Input
                className="h-[var(--taxis-control-h-md)] rounded-[var(--taxis-radius-control)] bg-[var(--taxis-workspace-surface)] px-3.5"
                min={1}
                type="number"
                {...register("guestCount", { valueAsNumber: true })}
              />
              <FieldError message={errors.guestCount?.message} />
            </FormField>
            <FormField label={copy.vehicle.passengersPerVehicleLabel}>
              <Input
                className="h-[var(--taxis-control-h-md)] rounded-[var(--taxis-radius-control)] bg-[var(--taxis-workspace-surface)] px-3.5"
                max={vehicleCapacity}
                min={1}
                type="number"
                {...register("passengersPerVehicle", { valueAsNumber: true })}
              />
              <FieldError message={errors.passengersPerVehicle?.message} />
            </FormField>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from(
              { length: selectedCountVehicleType.capacity },
              (_, index) => index + 1,
            ).map((count) => (
              <button
                className={cn(
                  "inline-flex min-h-[var(--taxis-control-h-sm)] min-w-[var(--taxis-control-h-sm)] items-center justify-center rounded-[calc(var(--taxis-radius-control)-2px)] border px-3 font-semibold text-[12px] transition-all focus-visible:outline-2 focus-visible:outline-[var(--taxis-workspace-accent)] focus-visible:outline-offset-2",
                  passengersPerVehicle === count
                    ? "border-[var(--taxis-workspace-control-dark)] bg-[var(--taxis-workspace-control-dark)] text-white"
                    : "border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] text-[var(--taxis-workspace-text-secondary)] hover:border-[var(--taxis-workspace-surface-rim-strong)] hover:bg-[var(--taxis-workspace-surface-soft)]",
                )}
                key={count}
                onClick={() => {
                  onPassengersPerVehicleChange(count);
                }}
                type="button"
              >
                {count}
              </button>
            ))}
          </div>
          <span className="mt-4 inline-flex rounded-md bg-[var(--taxis-workspace-surface-deep)] px-2.5 py-1 font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)] ring-1 ring-[var(--taxis-workspace-border)]">
            {formatVehiclesCalculatedLabel(
              copy.vehicle.vehiclesCalculatedLabel,
              vehicleRequests.length,
            )}
          </span>
          <div className="mt-3 grid gap-2">
            {vehicleRequests.map((request) => (
              <VehicleRequestPreview
                copy={copy}
                key={request.ordinal}
                request={request}
                vehicleTypes={vehicleTypes}
              />
            ))}
          </div>
          <p className="mt-2 font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
            {guestCount} {copy.summary.totalPassengersLabel.toLowerCase()} /{" "}
            {passengersPerVehicle} {copy.vehicle.passengersPerVehicleLabel}
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {vehiclePlans.map((plan) => {
            const vehicleIndex = plan.vehicleIndex;
            const vehicleLabel = formatVehicleCardLabel(
              copy.vehicle.vehicleCardLabel,
              vehicleIndex + 1,
            );
            const startSlotIndex = plan.startSlotIndex;
            const vehicleSlots = passengerSlots.slice(
              startSlotIndex,
              startSlotIndex + plan.capacity,
            );
            const assignedCount = vehicleSlots.filter((slot) =>
              Boolean(slot.passenger),
            ).length;
            const remaining = Math.max(plan.capacity - assignedCount, 0);

            return (
              <div
                className="rounded-[18px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface-soft)]/70 p-4"
                key={vehicleLabel}
              >
                <div className="mb-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                  <div className="min-w-0">
                    <p className="font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
                      {vehicleLabel}
                    </p>
                    <p className="mt-0.5 font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
                      {plan.vehicleType.label} / {copy.vehicle.capacityLabel}:{" "}
                      {plan.capacity}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2 lg:justify-end">
                    <span className="rounded-md bg-[var(--taxis-workspace-surface-deep)] px-2.5 py-1 font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)] ring-1 ring-[var(--taxis-workspace-border)]">
                      {formatRemainingLabel(
                        copy.vehicle.remainingLabel,
                        remaining,
                      )}
                    </span>
                    {vehiclePlans.length > 1 ? (
                      <button
                        aria-label={`${vehicleLabel} ${copy.vehicle.removeVehicleLabel}`}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] text-[var(--taxis-workspace-text-strong)] shadow-[var(--taxis-workspace-shadow-overlay)] transition-colors hover:border-[var(--taxis-workspace-accent-ring)] hover:bg-[var(--taxis-workspace-accent-soft)] hover:text-[var(--taxis-workspace-accent-strong)] focus-visible:outline-2 focus-visible:outline-[var(--taxis-workspace-accent)] focus-visible:outline-offset-2"
                        onClick={() => onRemoveVehicle(vehicleIndex)}
                        title={`${vehicleLabel} ${copy.vehicle.removeVehicleLabel}`}
                        type="button"
                      >
                        <X aria-hidden="true" size={15} />
                      </button>
                    ) : null}
                  </div>
                </div>
                <label className="sr-only">
                  <span>{copy.vehicle.typeLabel}</span>
                  <select
                    aria-label={`${vehicleLabel} ${copy.vehicle.typeLabel}`}
                    onChange={(event) =>
                      onVehicleTypeChange(
                        vehicleIndex,
                        event.currentTarget.value,
                      )
                    }
                    value={plan.vehicleTypeId}
                  >
                    {vehicleTypes.map((vehicleType) => (
                      <option key={vehicleType.id} value={vehicleType.id}>
                        {vehicleType.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="mb-3">
                  <VehicleTypeCardPicker
                    ariaLabel={`${vehicleLabel} Fahrzeugkarten`}
                    compact
                    copy={copy}
                    onChange={(vehicleTypeId) =>
                      onVehicleTypeChange(vehicleIndex, vehicleTypeId)
                    }
                    selectedVehicleTypeId={plan.vehicleTypeId}
                    vehicleTypes={vehicleTypes}
                  />
                </div>
                <p className="mb-2 font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
                  {copy.vehicle.assignedLabel}
                </p>
                <div className="grid gap-2 md:grid-cols-2">
                  {vehicleSlots.map((slot, localSlotIndex) => {
                    const globalSlotIndex = startSlotIndex + localSlotIndex;
                    const slotLabel = formatSlotLabel(
                      copy.vehicle.slotLabel,
                      localSlotIndex + 1,
                    );
                    const accessibleSlotLabel =
                      vehicleIndex === 0
                        ? slotLabel
                        : `${vehicleLabel} ${slotLabel}`;

                    return (
                      <PassengerSeatInput
                        active={activeSlotIndex === globalSlotIndex}
                        availablePassengers={availablePassengers}
                        copy={copy}
                        key={slot.slotId}
                        onActivate={() =>
                          onActiveSlotIndexChange(globalSlotIndex)
                        }
                        onAddGuest={() =>
                          onAddGuestPassengerForSlot(globalSlotIndex)
                        }
                        onClear={() => onClearPassengerSlot(globalSlotIndex)}
                        onDeactivate={() => onActiveSlotIndexChange(null)}
                        onNameChange={(name) =>
                          onUpdatePassengerSlotName(globalSlotIndex, name)
                        }
                        onSelectPassenger={(passenger) =>
                          onSelectPassengerForSlot(globalSlotIndex, passenger)
                        }
                        passengerSlots={passengerSlots}
                        slot={slot}
                        slotAccessibleLabel={accessibleSlotLabel}
                        slotIndex={globalSlotIndex}
                        slotLabel={slotLabel}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
          <button
            className="inline-flex min-h-[var(--taxis-control-h-md)] items-center justify-center rounded-[var(--taxis-radius-control)] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-4 font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)] transition-colors hover:border-[var(--taxis-workspace-surface-rim-strong)] hover:bg-[var(--taxis-workspace-surface-soft)] hover:text-[var(--taxis-workspace-text-primary)]"
            onClick={onAddVehicle}
            type="button"
          >
            {copy.vehicle.addVehicleLabel}
          </button>
        </div>
      )}
      <FieldError
        message={
          capacityError ??
          (inputMode === "guest_count"
            ? (errors.guestCount?.message ??
              errors.passengersPerVehicle?.message)
            : errors.passengerIds?.message)
        }
      />
      {inputMode === "guest_count" &&
      selectedCountVehicleType.isTemporaryFallback ? (
        <p className="mt-2 font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
          Standard = {vehicleCapacity}
        </p>
      ) : null}
    </section>
  );
}

function PassengerSeatInput({
  active,
  availablePassengers,
  copy,
  onActivate,
  onAddGuest,
  onClear,
  onDeactivate,
  onNameChange,
  onSelectPassenger,
  passengerSlots,
  slot,
  slotAccessibleLabel,
  slotIndex,
  slotLabel,
}: {
  active: boolean;
  availablePassengers: readonly NewBookingPassengerOption[];
  copy: NewBookingOverlayCopy;
  onActivate: () => void;
  onAddGuest: () => void;
  onClear: () => void;
  onDeactivate: () => void;
  onNameChange: (name: string) => void;
  onSelectPassenger: (passenger: NewBookingPassengerOption) => void;
  passengerSlots: readonly ResolvedPassengerSlot[];
  slot: ResolvedPassengerSlot;
  slotAccessibleLabel: string;
  slotIndex: number;
  slotLabel: string;
}) {
  const slotName = slot.name.trim();
  const slotQuery = slotName.toLowerCase();
  const assignedMemberIds = new Set(
    passengerSlots
      .filter((_, currentIndex) => currentIndex !== slotIndex)
      .map((currentSlot) => currentSlot.memberId)
      .filter((memberId): memberId is string => Boolean(memberId)),
  );
  const memberSuggestions = availablePassengers
    .filter((passenger) => {
      if (assignedMemberIds.has(passenger.id)) {
        return false;
      }

      if (slotQuery.length === 0) {
        return true;
      }

      return passenger.name.toLowerCase().includes(slotQuery);
    })
    .slice(0, 5);
  const canAddGuest = slot.kind === undefined && slotName.length > 0;
  const guestActionLabel = `+ ${copy.vehicle.externalPassengerLabel}: ${slotName}`;
  const hasPassengerMenu =
    active && (memberSuggestions.length > 0 || canAddGuest);
  const slotStatusLabel = slot.passenger
    ? slot.kind === "member"
      ? copy.vehicle.memberPassengerLabel
      : copy.vehicle.externalPassengerLabel
    : copy.vehicle.emptySlotLabel;

  return (
    <div
      className={cn(
        "relative rounded-[14px] border p-3 transition-colors",
        slot.passenger
          ? "border-[var(--taxis-workspace-accent-ring)] bg-[var(--taxis-workspace-surface)]"
          : "border-dashed border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface-soft)]",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <label
          className="font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow"
          htmlFor={`new-booking-passenger-slot-${slotIndex}`}
        >
          {slotLabel}
        </label>
        <span
          className={cn(
            "rounded-md px-2 py-0.5 font-semibold text-[10px] ring-1",
            slot.passenger
              ? "bg-[var(--taxis-workspace-accent-soft)] text-[var(--taxis-workspace-accent-strong)] ring-[var(--taxis-workspace-accent-ring)]"
              : "bg-[var(--taxis-workspace-surface-deep)] text-[var(--taxis-workspace-text-muted)] ring-[var(--taxis-workspace-border)]",
          )}
        >
          {slotStatusLabel}
        </span>
      </div>
      <div className="relative">
        <Input
          aria-autocomplete="list"
          aria-expanded={hasPassengerMenu}
          aria-label={slotAccessibleLabel}
          autoComplete="off"
          className="h-[var(--taxis-control-h-md)] rounded-[calc(var(--taxis-radius-control)-2px)] bg-[var(--taxis-workspace-surface)] pr-10"
          id={`new-booking-passenger-slot-${slotIndex}`}
          onBlur={() => {
            window.setTimeout(onDeactivate, 80);
          }}
          onChange={(event) => onNameChange(event.currentTarget.value)}
          onFocus={onActivate}
          placeholder={copy.vehicle.slotInputPlaceholder}
          value={slot.name}
        />
        {slot.name.trim().length > 0 ? (
          <button
            aria-label={`${slotAccessibleLabel} ${copy.vehicle.slotClearLabel}`}
            className="-translate-y-1/2 absolute top-1/2 right-2 flex h-7 w-7 items-center justify-center rounded-[9px] text-[var(--taxis-workspace-text-muted)] transition-colors hover:bg-[var(--taxis-workspace-surface-soft)] hover:text-[var(--taxis-workspace-text-strong)]"
            onClick={onClear}
            type="button"
          >
            <X aria-hidden="true" size={14} />
          </button>
        ) : null}
      </div>
      {hasPassengerMenu ? (
        <div className="absolute right-3 left-3 z-30 mt-2 overflow-hidden rounded-[14px] border border-[var(--taxis-workspace-overlay-border)] bg-[var(--taxis-workspace-overlay-bg)] p-1.5 shadow-[var(--taxis-workspace-overlay-shadow)]">
          {memberSuggestions.length > 0 ? (
            <p className="px-2 py-1 font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
              {copy.vehicle.slotSuggestionLabel}
            </p>
          ) : null}
          {memberSuggestions.map((passenger) => (
            <button
              className="flex w-full items-center justify-between gap-3 rounded-[10px] px-2.5 py-2 text-left font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)] transition-colors hover:bg-[var(--taxis-workspace-surface-soft)] hover:text-[var(--taxis-workspace-text-primary)]"
              key={passenger.id}
              onClick={() => onSelectPassenger(passenger)}
              onMouseDown={(event) => event.preventDefault()}
              onPointerDown={(event) => event.preventDefault()}
              type="button"
            >
              <span>{passenger.name}</span>
              <span
                aria-hidden="true"
                className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)]"
              >
                {copy.vehicle.memberPassengerLabel}
              </span>
            </button>
          ))}
          {memberSuggestions.length === 0 && canAddGuest ? (
            <p className="px-2 py-1 font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
              {copy.vehicle.slotSearchEmptyLabel}
            </p>
          ) : null}
          {canAddGuest ? (
            <button
              className="mt-1 flex w-full items-center justify-between gap-3 rounded-[10px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface-soft)] px-2.5 py-2 text-left font-semibold text-[12px] text-[var(--taxis-workspace-text-strong)] transition-colors hover:border-[var(--taxis-workspace-accent-ring)] hover:bg-[var(--taxis-workspace-accent-soft)]"
              onClick={onAddGuest}
              onMouseDown={(event) => event.preventDefault()}
              onPointerDown={(event) => event.preventDefault()}
              type="button"
            >
              <span>{guestActionLabel}</span>
              <span
                aria-hidden="true"
                className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)]"
              >
                {copy.vehicle.externalPassengerLabel}
              </span>
            </button>
          ) : null}
        </div>
      ) : null}
      {!active && canAddGuest ? (
        <button
          className="mt-2 inline-flex w-full items-center justify-between gap-3 rounded-[10px] border border-dashed border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface-soft)] px-2.5 py-2 text-left font-semibold text-[12px] text-[var(--taxis-workspace-text-strong)] transition-colors hover:border-[var(--taxis-workspace-accent-ring)] hover:bg-[var(--taxis-workspace-accent-soft)]"
          onClick={onAddGuest}
          type="button"
        >
          <span>{guestActionLabel}</span>
          <span
            aria-hidden="true"
            className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)]"
          >
            {copy.vehicle.externalPassengerLabel}
          </span>
        </button>
      ) : null}
    </div>
  );
}

function PassengerChipList({
  emptyLabel,
  label,
  passengers,
  tone = "neutral",
}: {
  emptyLabel?: string;
  label: string;
  passengers: readonly NewBookingPassengerOption[];
  tone?: "danger" | "neutral";
}) {
  return (
    <div>
      <p className="mb-2 font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
        {label}
      </p>
      {passengers.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {passengers.map((passenger) => (
            <span
              className={cn(
                "rounded-full px-3 py-1.5 font-semibold text-[11px]",
                tone === "danger"
                  ? "bg-[var(--taxis-status-danger-bg)] text-[var(--taxis-status-danger-text)] ring-1 ring-[var(--taxis-status-danger-ring)]"
                  : "bg-[var(--taxis-workspace-surface-deep)] text-[var(--taxis-workspace-text-secondary)] ring-1 ring-[var(--taxis-workspace-border)]",
              )}
              key={passenger.id}
            >
              {passenger.name}
            </span>
          ))}
        </div>
      ) : emptyLabel ? (
        <p className="font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
          {emptyLabel}
        </p>
      ) : null}
    </div>
  );
}

function ContactPersonSection({
  copy,
  passengerOptions,
  register,
}: {
  copy: NewBookingOverlayCopy;
  passengerOptions: readonly NewBookingPassengerOption[];
  register: RegisteredForm["register"];
}) {
  return (
    <section aria-labelledby={sectionTitleId(copy.contact.title)}>
      <SectionHeader title={copy.contact.title} />
      <FormField label={copy.contact.label}>
        <div className="relative">
          <select
            className="h-[var(--taxis-control-h-md)] w-full appearance-none rounded-[var(--taxis-radius-control)] border border-input bg-[var(--taxis-workspace-surface)] px-3.5 py-1 pr-8 font-medium text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register("contactPersonId")}
          >
            <option value="">{copy.contact.placeholder}</option>
            {passengerOptions.map((passenger) => (
              <option key={passenger.id} value={passenger.id}>
                {passenger.name}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-2.5 text-[var(--taxis-workspace-text-muted)]"
            size={15}
          />
        </div>
      </FormField>
    </section>
  );
}

function NotesSection({
  copy,
  register,
}: {
  copy: NewBookingOverlayCopy;
  register: RegisteredForm["register"];
}) {
  return (
    <section aria-labelledby={sectionTitleId(copy.notes.title)}>
      <SectionHeader title={copy.notes.title} />
      <FormField label={copy.notes.label}>
        <textarea
          className="min-h-24 w-full min-w-0 resize-y rounded-[14px] border border-input bg-[var(--taxis-workspace-surface)] px-3.5 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
          placeholder={copy.notes.placeholder}
          {...register("internalNote")}
        />
      </FormField>
    </section>
  );
}

export function RecurringRideSection({
  copy,
}: {
  copy: NewBookingOverlayCopy;
}) {
  return (
    <details className="group rounded-[18px] border border-dashed border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface-soft)]/70">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
        <span className="font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
          {copy.recurring.title}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="shrink-0 text-[var(--taxis-workspace-text-muted)] transition-transform group-open:rotate-180"
          size={16}
        />
      </summary>
      <div className="border-[var(--taxis-workspace-border)] border-t px-4 py-4">
        {/* TODO(new-booking-recurring): Persist recurring rides once the backend has a recurrence contract. */}
        <p className="font-medium text-[12px] text-[var(--taxis-workspace-text-muted)] leading-relaxed">
          {copy.recurring.summary}
        </p>
        <span className="mt-3 inline-flex rounded-md bg-[var(--taxis-workspace-surface-deep)] px-2.5 py-1 font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow ring-1 ring-[var(--taxis-workspace-border)]">
          {copy.recurring.disabledLabel}
        </span>
      </div>
    </details>
  );
}

function BookingReviewStep({
  contactPersonId,
  copy,
  destinationAddress,
  flightNumber,
  internalNote,
  onChangeSection,
  passengerCount,
  passengerOptions,
  pickupAddress,
  pickupDate,
  pickupTime,
  returnDate,
  returnTime,
  selectedPassengers,
  tripType,
  vehicleRequests,
  vehicleTypes,
}: {
  contactPersonId: string;
  copy: NewBookingOverlayCopy;
  destinationAddress: string;
  flightNumber: string;
  internalNote: string;
  onChangeSection: (section: NewBookingReviewSection) => void;
  passengerCount: number;
  passengerOptions: readonly NewBookingPassengerOption[];
  pickupAddress: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  selectedPassengers: readonly NewBookingPassengerOption[];
  tripType: NewBookingTripType;
  vehicleRequests: readonly NewBookingVehicleRequest[];
  vehicleTypes: readonly NewBookingVehicleTypeOption[];
}) {
  const outboundPickup = pickupAddress.trim() || copy.summary.pickupFallback;
  const outboundDestination =
    destinationAddress.trim() || copy.summary.destinationFallback;
  const tripTypeLabel = {
    one_way_outbound: copy.tripType.outbound,
    round_trip: copy.tripType.roundTrip,
  } satisfies Record<NewBookingTripType, string>;
  const pickupDateTime =
    pickupDate.trim().length > 0 || pickupTime.trim().length > 0
      ? `${pickupDate || "-"} ${pickupTime || "-"}`
      : "-";
  const returnDateTime =
    returnDate.trim().length > 0 || returnTime.trim().length > 0
      ? `${returnDate || "-"} ${returnTime || "-"}`
      : "-";
  const vehicleTypeLabelById = new Map(
    vehicleTypes.map((vehicleType) => [vehicleType.id, vehicleType.label]),
  );
  const contactPersonName =
    passengerOptions.find((passenger) => passenger.id === contactPersonId)
      ?.name ?? "";
  const hasContactDetails =
    contactPersonName.trim().length > 0 ||
    flightNumber.trim().length > 0 ||
    internalNote.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-[1040px] space-y-5">
      <div className="rounded-[26px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-5 shadow-[var(--taxis-workspace-shadow-overlay)] md:p-7">
        <div className="flex flex-col gap-2 border-[var(--taxis-workspace-divider)] border-b pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="font-semibold text-[22px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
              {copy.review.title}
            </h3>
            <p className="mt-1 font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
              {copy.review.summary}
            </p>
          </div>
          <span className="w-fit rounded-full bg-[var(--taxis-workspace-surface-deep)] px-3 py-1.5 font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)] ring-1 ring-[var(--taxis-workspace-border)]">
            {tripTypeLabel[tripType]}
          </span>
        </div>

        <div className="grid gap-5 pt-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <section className="rounded-[20px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-5">
            <SectionHeader
              action={
                <ChangeSectionButton onClick={() => onChangeSection("route")}>
                  {copy.review.changeRouteLabel}
                </ChangeSectionButton>
              }
              title={copy.route.title}
            />
            <div className="space-y-4">
              <ReviewRoutePair
                destinationLabel={copy.route.destinationLabel}
                destination={outboundDestination}
                label={copy.tripType.outbound}
                pickupLabel={copy.route.pickupLabel}
                pickup={outboundPickup}
              />
              {tripType === "round_trip" ? (
                <ReviewRoutePair
                  destinationLabel={copy.route.destinationLabel}
                  destination={outboundPickup}
                  label={copy.route.returnPreviewLabel}
                  pickupLabel={copy.route.pickupLabel}
                  pickup={outboundDestination}
                />
              ) : null}
            </div>
          </section>

          <section className="rounded-[20px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-5">
            <SectionHeader
              action={
                <ChangeSectionButton
                  onClick={() => onChangeSection("dateTime")}
                >
                  {copy.review.changeDateTimeLabel}
                </ChangeSectionButton>
              }
              title={copy.dateTime.title}
            />
            <div className="space-y-3">
              <SummaryRow
                label={copy.summary.dateTimeLabel}
                value={pickupDateTime}
              />
              {tripType === "round_trip" ? (
                <SummaryRow
                  label={copy.route.returnPreviewLabel}
                  value={returnDateTime}
                />
              ) : null}
            </div>
          </section>

          <section className="rounded-[20px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-5">
            <SectionHeader
              action={
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[var(--taxis-workspace-surface-deep)] px-2.5 py-1 font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)] ring-1 ring-[var(--taxis-workspace-border)]">
                    {passengerCount}
                  </span>
                  <ChangeSectionButton
                    onClick={() => onChangeSection("passengerVehicle")}
                  >
                    {copy.review.changePassengerVehicleLabel}
                  </ChangeSectionButton>
                </div>
              }
              title={copy.passenger.title}
            />
            <PassengerChipList
              emptyLabel={copy.passenger.emptyLabel}
              label={copy.passenger.assignedLabel}
              passengers={selectedPassengers}
            />
          </section>

          <section className="rounded-[20px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-5">
            <SectionHeader
              action={
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[var(--taxis-workspace-surface-deep)] px-2.5 py-1 font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)] ring-1 ring-[var(--taxis-workspace-border)]">
                    {formatVehiclesCalculatedLabel(
                      copy.vehicle.vehiclesCalculatedLabel,
                      vehicleRequests.length,
                    )}
                  </span>
                  <ChangeSectionButton
                    onClick={() => onChangeSection("passengerVehicle")}
                  >
                    {copy.review.changePassengerVehicleLabel}
                  </ChangeSectionButton>
                </div>
              }
              title={copy.vehicle.title}
            />
            <div className="space-y-3">
              <div className="space-y-2">
                {vehicleRequests.map((request) => (
                  <div
                    className="rounded-[14px] bg-[var(--taxis-workspace-surface-soft)]/70 px-3.5 py-3"
                    key={request.ordinal}
                  >
                    <p className="font-semibold text-[12px] text-[var(--taxis-workspace-text-strong)]">
                      {formatVehicleCardLabel(
                        copy.vehicle.vehicleCardLabel,
                        request.ordinal,
                      )}
                    </p>
                    <p className="mt-1 font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
                      {vehicleTypeLabelById.get(request.vehicleTypeId) ??
                        request.vehicleTypeId}{" "}
                      / {copy.vehicle.capacityLabel}: {request.capacity}
                    </p>
                    <p className="mt-1 font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
                      {request.passengers
                        .map((passenger) => passenger.name)
                        .join(", ")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-[var(--taxis-workspace-border)] border-t pt-3">
                <SummaryRow
                  label={copy.summary.totalAmountLabel}
                  value={copy.summary.calculatedLaterLabel}
                />
              </div>
            </div>
          </section>

          {hasContactDetails ? (
            <section className="rounded-[20px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-5 lg:col-span-2">
              <SectionHeader
                action={
                  <div className="flex flex-wrap items-center gap-2">
                    <ChangeSectionButton
                      onClick={() => onChangeSection("contact")}
                    >
                      {copy.review.changeContactLabel}
                    </ChangeSectionButton>
                    <ChangeSectionButton
                      onClick={() => onChangeSection("notes")}
                    >
                      {copy.review.changeNotesLabel}
                    </ChangeSectionButton>
                  </div>
                }
                title={`${copy.contact.title} / ${copy.notes.title}`}
              />
              <div className="grid gap-3 md:grid-cols-3">
                {contactPersonName.trim().length > 0 ? (
                  <SummaryRow
                    label={copy.contact.label}
                    value={contactPersonName}
                  />
                ) : null}
                {flightNumber.trim().length > 0 ? (
                  <SummaryRow
                    label={copy.flight.label}
                    value={flightNumber.trim()}
                  />
                ) : null}
                {internalNote.trim().length > 0 ? (
                  <SummaryRow
                    label={copy.notes.label}
                    value={internalNote.trim()}
                  />
                ) : null}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ReviewRoutePair({
  destinationLabel,
  destination,
  label,
  pickupLabel,
  pickup,
}: {
  destinationLabel: string;
  destination: string;
  label: string;
  pickupLabel: string;
  pickup: string;
}) {
  return (
    <div>
      <p className="mb-2 font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
        {label}
      </p>
      <div className="grid gap-3 rounded-[18px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface-soft)]/70 p-4">
        <SummaryStop label={pickupLabel} value={pickup} />
        <SummaryStop
          label={destinationLabel}
          tone="destination"
          value={destination}
        />
      </div>
    </div>
  );
}

export function BookingSummary({
  copy,
  destinationAddress,
  passengerCount,
  pickupAddress,
  pickupDate,
  pickupTime,
  tripType,
  vehicleType,
}: {
  copy: NewBookingOverlayCopy;
  destinationAddress: string;
  passengerCount: number;
  pickupAddress: string;
  pickupDate: string;
  pickupTime: string;
  tripType: NewBookingTripType;
  vehicleType: NewBookingVehicleTypeOption;
}) {
  const tripTypeLabel = {
    one_way_outbound: copy.tripType.outbound,
    round_trip: copy.tripType.roundTrip,
  } satisfies Record<NewBookingTripType, string>;
  const dateTime =
    pickupDate.trim().length > 0 || pickupTime.trim().length > 0
      ? `${pickupDate || "-"} ${pickupTime || "-"}`
      : "-";

  return (
    <div className="sticky top-6 space-y-4">
      <h3 className="font-semibold text-taxis-section-sm text-[var(--taxis-workspace-text-strong)] tracking-tight">
        {copy.summary.title}
      </h3>
      <div className="rounded-[22px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-4">
        <div className="space-y-2 border-[var(--taxis-workspace-border)] border-b pb-4">
          <SummaryStop
            label={copy.route.pickupLabel}
            value={pickupAddress.trim() || copy.summary.pickupFallback}
          />
          <SummaryStop
            label={copy.route.destinationLabel}
            value={
              destinationAddress.trim() || copy.summary.destinationFallback
            }
            tone="destination"
          />
        </div>
        <div className="space-y-3 pt-4">
          <SummaryRow
            label={copy.summary.tripTypeLabel}
            value={tripTypeLabel[tripType]}
          />
          <SummaryRow label={copy.summary.dateTimeLabel} value={dateTime} />
          <SummaryRow
            label={copy.summary.vehicleTypeLabel}
            value={vehicleType.label}
          />
          <SummaryRow
            label={copy.summary.totalPassengersLabel}
            value={String(passengerCount)}
          />
        </div>
      </div>
      <div className="rounded-[18px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface-deep)] p-4">
        <SummaryRow
          label={copy.summary.totalAmountLabel}
          value={copy.summary.calculatedLaterLabel}
        />
      </div>
    </div>
  );
}

function SummaryStop({
  label,
  tone = "pickup",
  value,
}: {
  label: string;
  tone?: "destination" | "pickup";
  value: string;
}) {
  return (
    <div className="grid grid-cols-[16px_minmax(0,1fr)] gap-3">
      <span
        aria-hidden="true"
        className={cn(
          "mt-1.5 h-2.5 w-2.5 rounded-full",
          tone === "pickup"
            ? "bg-[var(--taxis-workspace-accent)]"
            : "bg-[var(--taxis-workspace-text-strong)]",
        )}
      />
      <div className="min-w-0">
        <p className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
          {label}
        </p>
        <p className="mt-1 truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
        {label}
      </span>
      <span className="max-w-[180px] text-right font-semibold text-[12px] text-[var(--taxis-workspace-text-strong)] leading-snug">
        {value}
      </span>
    </div>
  );
}
