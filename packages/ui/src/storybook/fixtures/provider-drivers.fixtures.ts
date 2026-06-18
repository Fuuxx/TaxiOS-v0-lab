import type {
  ProviderDriverInviteFormCopy,
  ProviderDriversCopy,
  ProviderDriversPayload,
} from "../../contracts/provider-drivers";

export const demoProviderDriversCopy: ProviderDriversCopy = {
  acceptedDriverColumn: "Account email",
  activeCountLabel: "Active drivers",
  actionsColumn: "Actions",
  emptyDescription:
    "Driver invites and approved driver accounts will appear here.",
  emptyTitle: "No driver invites",
  formSlotLabel: "Invite provider driver",
  invitedDriverColumn: "Invite email",
  statusColumn: "Status",
  statusLabels: {
    approved: "Approved",
    expired: "Expired",
    onboarding_started: "Started",
    onboarding_submitted: "Ready for approval",
    pending: "Invited",
    revoked: "Revoked",
  },
  subtitle:
    "Invite drivers, review submitted onboarding, and control active driver access.",
  title: "Provider drivers",
};

export const demoProviderDriverInviteFormCopy: ProviderDriverInviteFormCopy = {
  copyInviteUrlLabel: "Copy",
  emailLabel: "Driver email",
  emailPlaceholder: "driver@example.com",
  errorFallback: "Driver invite could not be created. Please try again.",
  formTitle: "Invite driver",
  inviteUrlLabel: "Invite link",
  nameLabel: "Driver name",
  namePlaceholder: "Dana Driver",
  submitLabel: "Create invite",
  submittingLabel: "Creating...",
  successLabel: "Invite link created.",
  unavailableLabel: "Driver invites are not available.",
};

export const demoProviderDriversPayload: ProviderDriversPayload = {
  activeDriverCount: 1,
  allowedActions: [
    {
      id: "create_driver_invite",
      label: "Invite driver",
    },
  ],
  rows: [
    {
      acceptedDriverEmail: null,
      acceptedDriverName: null,
      allowedActions: [
        {
          disabled: true,
          id: "approve_driver_onboarding",
          label: "Approve",
          reason: "Driver onboarding must be submitted before approval.",
        },
        {
          id: "revoke_driver_invite",
          label: "Revoke",
        },
      ],
      createdAt: 1_800_000_000_000,
      expiresAt: 1_801_209_600_000,
      invitationId: "driver_invitation_pending",
      invitedEmail: "driver@example.com",
      invitedName: "Dana Driver",
      publicId: "IVT-J8Q4MD",
      status: "pending",
      updatedAt: 1_800_000_000_000,
    },
    {
      acceptedDriverEmail: "driver2@example.com",
      acceptedDriverName: "Cem Driver",
      allowedActions: [
        {
          id: "approve_driver_onboarding",
          label: "Approve",
        },
        {
          id: "revoke_driver_invite",
          label: "Revoke",
        },
      ],
      createdAt: 1_800_000_000_000,
      expiresAt: 1_801_209_600_000,
      invitationId: "driver_invitation_submitted",
      invitedEmail: "driver2@example.com",
      invitedName: "Cem Driver",
      publicId: "IVT-W3K7HA",
      status: "onboarding_submitted",
      updatedAt: 1_800_003_600_000,
    },
    {
      acceptedDriverEmail: "driver3@example.com",
      acceptedDriverName: "Mina Driver",
      allowedActions: [
        {
          disabled: true,
          id: "approve_driver_onboarding",
          label: "Approve",
          reason: "Driver onboarding must be submitted before approval.",
        },
        {
          id: "revoke_driver_invite",
          label: "Revoke",
        },
      ],
      createdAt: 1_800_000_000_000,
      expiresAt: 1_801_209_600_000,
      invitationId: "driver_invitation_approved",
      invitedEmail: "driver3@example.com",
      invitedName: "Mina Driver",
      publicId: "IVT-P9C2VX",
      status: "approved",
      updatedAt: 1_800_007_200_000,
    },
    {
      acceptedDriverEmail: null,
      acceptedDriverName: null,
      allowedActions: [
        {
          disabled: true,
          id: "approve_driver_onboarding",
          label: "Approve",
          reason: "Driver onboarding must be submitted before approval.",
        },
        {
          disabled: true,
          id: "revoke_driver_invite",
          label: "Revoke",
          reason: "This invite is already closed.",
        },
      ],
      createdAt: 1_800_000_000_000,
      expiresAt: 1_801_209_600_000,
      invitationId: "driver_invitation_revoked",
      invitedEmail: "driver4@example.com",
      invitedName: "Rana Driver",
      publicId: "IVT-R6M8QA",
      status: "revoked",
      updatedAt: 1_800_010_800_000,
    },
    {
      acceptedDriverEmail: null,
      acceptedDriverName: null,
      allowedActions: [
        {
          disabled: true,
          id: "approve_driver_onboarding",
          label: "Approve",
          reason: "Driver onboarding must be submitted before approval.",
        },
        {
          disabled: true,
          id: "revoke_driver_invite",
          label: "Revoke",
          reason: "This invite is already closed.",
        },
      ],
      createdAt: 1_798_000_000_000,
      expiresAt: 1_799_209_600_000,
      invitationId: "driver_invitation_expired",
      invitedEmail: "driver5@example.com",
      invitedName: "Leo Driver",
      publicId: "IVT-4G7N2K",
      status: "expired",
      updatedAt: 1_799_209_600_000,
    },
  ],
};

export const demoProviderDriversEmptyPayload: ProviderDriversPayload = {
  activeDriverCount: 0,
  allowedActions: demoProviderDriversPayload.allowedActions,
  rows: [],
};

export const demoProviderDriversDisabledPayload: ProviderDriversPayload = {
  ...demoProviderDriversPayload,
  allowedActions: [
    {
      disabled: true,
      id: "create_driver_invite",
      label: "Invite driver",
      reason: "Only provider operators can invite drivers.",
    },
  ],
};
