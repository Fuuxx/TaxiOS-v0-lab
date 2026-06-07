import type {
  DriverInviteOnboardingCopy,
  DriverInvitePublicDetails,
  DriverOnboardingFormCopy,
} from "../../contracts/driver-invite";

export const demoDriverInviteCopy: DriverInviteOnboardingCopy = {
  approvedBody:
    "Your provider has approved your driver onboarding. You can now open your driver jobs.",
  approvedCtaLabel: "Open driver jobs",
  approvedTitle: "Driver access approved",
  body: "Complete the driver onboarding profile. Your provider will review it before driver access becomes active.",
  expiredBody: "This driver invite is no longer valid. Ask your provider for a new link.",
  expiredTitle: "Invite expired",
  invalidBody: "This driver invite link is not valid.",
  invalidTitle: "Invite not found",
  revokedBody: "This driver invite was revoked by the provider.",
  revokedTitle: "Invite revoked",
  signedOutBody:
    "Sign in or create a normal TaxiOS account to continue this driver invite.",
  signInLabel: "Sign in",
  signUpLabel: "Create account",
  submittedBody:
    "Your onboarding has been submitted. Your provider must approve it before driver access is active.",
  submittedTitle: "Waiting for provider approval",
  title: "Driver invite",
};

export const demoDriverOnboardingFormCopy: DriverOnboardingFormCopy = {
  driverLicenseLabel: "Driver license reference",
  driverLicensePlaceholder: "B-123456",
  errorFallback: "Driver onboarding could not be submitted. Please try again.",
  formTitle: "Compliance-lite profile",
  legalNameLabel: "Legal name",
  legalNamePlaceholder: "Dana Driver",
  permitLabel: "Passenger transport permit",
  permitPlaceholder: "P-987654",
  phoneLabel: "Phone",
  phonePlaceholder: "+49 30 123456",
  submitLabel: "Submit onboarding",
  submittingLabel: "Submitting...",
  successLabel: "Driver onboarding submitted.",
  termsLabel:
    "I confirm that this driver information is accurate and may be reviewed by the provider.",
};

export const demoDriverInvite: DriverInvitePublicDetails = {
  expiresAt: 1_801_209_600_000,
  invitedEmail: "driver@example.com",
  invitedName: "Dana Driver",
  providerName: "City Funk Berlin",
  status: "pending",
};
