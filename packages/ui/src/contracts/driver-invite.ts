import type { DriverInvitationStatus } from "./provider-drivers";

export type DriverInvitePublicDetails = {
  expiresAt: number;
  invitedEmail: string;
  invitedName: string | null;
  providerName: string;
  status: DriverInvitationStatus;
};

export type DriverInviteOnboardingCopy = {
  approvedBody: string;
  approvedCtaLabel: string;
  approvedTitle: string;
  body: string;
  expiredBody: string;
  expiredTitle: string;
  invalidBody: string;
  invalidTitle: string;
  revokedBody: string;
  revokedTitle: string;
  signedOutBody: string;
  signInLabel: string;
  signUpLabel: string;
  submittedBody: string;
  submittedTitle: string;
  title: string;
};

export type DriverOnboardingFormData = {
  driverLicenseReference: string;
  legalName: string;
  passengerTransportPermitReference: string;
  phone: string;
  termsAccepted: boolean;
};

export type DriverOnboardingFormCopy = {
  driverLicenseLabel: string;
  driverLicensePlaceholder: string;
  errorFallback: string;
  formTitle: string;
  legalNameLabel: string;
  legalNamePlaceholder: string;
  permitLabel: string;
  permitPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  successLabel: string;
  termsLabel: string;
};
