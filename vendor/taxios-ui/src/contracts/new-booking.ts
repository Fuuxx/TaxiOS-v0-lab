export type NewBookingTripType = "one_way_outbound" | "round_trip";
export type NewBookingPassengerInputMode = "assign_seats" | "guest_count";

export type NewBookingPassengerOption = {
  id: string;
  name: string;
};

export type NewBookingSubmittedPassenger =
  | {
      kind: "member";
      memberId: string;
      name: string;
    }
  | {
      kind: "guest";
      name: string;
    };

export type NewBookingFavoriteRoute = {
  destinationAddress: string;
  id: string;
  pickupAddress: string;
  title: string;
};

export type NewBookingAddressField = "destination" | "pickup";

export type NewBookingAddressSuggestion = {
  id: string;
  mainText: string;
  secondaryText?: string;
};

export type NewBookingAddressComponent = {
  longText: string;
  shortText: string | null;
  types: readonly string[];
};

export type NewBookingAddressSelection = {
  addressComponents: readonly NewBookingAddressComponent[];
  displayName: string | null;
  formattedAddress: string;
  latitude: number | null;
  longitude: number | null;
  placeId: string;
  provider: "google_maps";
};

export type NewBookingAddressAutocompleteController = {
  getSuggestions: (
    input: string,
    field: NewBookingAddressField,
  ) => Promise<readonly NewBookingAddressSuggestion[]>;
  resolveSuggestion: (
    suggestion: NewBookingAddressSuggestion,
    field: NewBookingAddressField,
  ) => Promise<NewBookingAddressSelection | null>;
};

export type NewBookingOverlayDraft = {
  destinationAddress?: string;
  passengerIds?: readonly string[];
  pickupAddress?: string;
};

export type NewBookingVehicleTypeOption = {
  capacity: number;
  description?: string;
  id: string;
  isTemporaryFallback?: boolean;
  label: string;
  luggageHint?: string;
  shortLabel?: string;
};

export type NewBookingVehicleRequest = {
  capacity: number;
  ordinal: number;
  passengers: NewBookingSubmittedPassenger[];
  vehicleTypeId: string;
};

export type NewBookingOverlayFormValues = {
  contactPersonId: string;
  customPassengerName: string;
  destinationAddress: string;
  flightNumber: string;
  guestCount: number;
  internalNote: string;
  passengerInputMode: NewBookingPassengerInputMode;
  passengerIds: string[];
  passengersPerVehicle: number;
  pickupAddress: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  tripType: NewBookingTripType;
  vehicleTypeId: string;
};

export type NewBookingOverlaySubmitData = {
  contactPersonId?: string;
  destinationAddress: string;
  destinationPlace?: NewBookingAddressSelection;
  flightNumber?: string;
  internalNote?: string;
  passengerInputMode: NewBookingPassengerInputMode;
  passengers: NewBookingSubmittedPassenger[];
  passengerIds: string[];
  passengerNames: string[];
  pickupAddress: string;
  pickupPlace?: NewBookingAddressSelection;
  requestedPickupAt: number;
  returnRequestedPickupAt?: number;
  tripType: NewBookingTripType;
  vehicleTypeId: string;
  vehicleRequests: NewBookingVehicleRequest[];
};

export type NewBookingOverlayCopy = {
  advanced: {
    summary: string;
    title: string;
  };
  addressAutocomplete: {
    errorLabel: string;
    loadingLabel: string;
    noResultsLabel: string;
    suggestionListLabel: string;
  };
  addressVerification: {
    googleSelectedLabel: string;
    houseNumberDetectedLabel: string;
    missingGoogleSelectionLabel: string;
    missingHouseNumberLabel: string;
    unavailableLabel: string;
  };
  cancelLabel: string;
  closeLabel: string;
  command: {
    livePlanSummary: string;
    livePlanTitle: string;
    passengersEmptyLabel: string;
    routeOpenLabel: string;
    routeReadyLabel: string;
    statusLabel: string;
    timeOpenLabel: string;
    timeReadyLabel: string;
    vehiclePluralLabel: string;
    vehicleSingularLabel: string;
  };
  contact: {
    label: string;
    placeholder: string;
    title: string;
  };
  dateTime: {
    pickupDateLabel: string;
    pickupTimeLabel: string;
    quickNowLabel: string;
    quickOneHourLabel: string;
    quickThirtyMinutesLabel: string;
    quickTomorrowMorningLabel: string;
    returnDateLabel: string;
    returnTimeLabel: string;
    title: string;
  };
  favorites: {
    emptyLabel: string;
    saveCurrentLabel: string;
    saveDisabledLabel: string;
    title: string;
  };
  flight: {
    label: string;
    placeholder: string;
    title: string;
  };
  notes: {
    label: string;
    placeholder: string;
    title: string;
  };
  passenger: {
    addCustomLabel: string;
    assignedLabel: string;
    customNameLabel: string;
    customNamePlaceholder: string;
    emptyLabel: string;
    externalSummary: string;
    externalTitle: string;
    memberSearchLabel: string;
    memberSearchPlaceholder: string;
    membersEmptyLabel: string;
    selectLabel: string;
    title: string;
    totalLabel: string;
  };
  recurring: {
    disabledLabel: string;
    summary: string;
    title: string;
  };
  review: {
    backLabel: string;
    changeContactLabel: string;
    changeDateTimeLabel: string;
    changeNotesLabel: string;
    changePassengerVehicleLabel: string;
    changeRouteLabel: string;
    nextLabel: string;
    summary: string;
    title: string;
  };
  route: {
    destinationLabel: string;
    destinationPlaceholder: string;
    pickupLabel: string;
    pickupPlaceholder: string;
    returnPendingLabel: string;
    returnPreviewLabel: string;
    title: string;
  };
  submitLabel: string;
  submittingLabel: string;
  summary: {
    calculatedLaterLabel: string;
    dateTimeLabel: string;
    destinationFallback: string;
    pickupFallback: string;
    title: string;
    totalAmountLabel: string;
    totalPassengersLabel: string;
    tripTypeLabel: string;
    vehicleTypeLabel: string;
  };
  title: string;
  tripType: {
    outbound: string;
    roundTrip: string;
    title: string;
  };
  validation: {
    contactRequired: string;
    destinationRequired: string;
    googleAddressRequired: string;
    houseNumberRequired: string;
    overCapacity: string;
    passengerRequired: string;
    pickupDateRequired: string;
    pickupRequired: string;
    pickupTimeRequired: string;
    returnDateRequired: string;
    returnTimeRequired: string;
  };
  vehicle: {
    assignedLabel: string;
    capacityLabel: string;
    cardDescriptionFallback: string;
    externalPassengerLabel: string;
    emptySlotLabel: string;
    memberPassengerLabel: string;
    overflowLabel: string;
    remainingLabel: string;
    slotClearLabel: string;
    slotInputPlaceholder: string;
    slotLabel: string;
    slotSearchEmptyLabel: string;
    slotSuggestionLabel: string;
    standardLabel: string;
    title: string;
    typeLabel: string;
    typeSeatsLabel: string;
    addVehicleLabel: string;
    assignSeatsModeLabel: string;
    guestCountLabel: string;
    guestCountModeLabel: string;
    inputModeLabel: string;
    passengersPerVehicleLabel: string;
    removeVehicleLabel: string;
    vehicleCardLabel: string;
    vehiclesCalculatedLabel: string;
  };
};
