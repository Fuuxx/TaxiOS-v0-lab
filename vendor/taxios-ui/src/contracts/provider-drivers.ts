export type DriverInvitationStatus =
  | "approved"
  | "expired"
  | "onboarding_started"
  | "onboarding_submitted"
  | "pending"
  | "revoked";

export type ProviderDriverActionId =
  | "approve_driver_onboarding"
  | "revoke_driver_invite";

export type ProviderDriverRowAction = {
  disabled?: boolean;
  id: ProviderDriverActionId;
  label: string;
  reason?: string;
};

export type ProviderDriverRow = {
  acceptedDriverEmail: string | null;
  acceptedDriverName: string | null;
  allowedActions: ProviderDriverRowAction[];
  createdAt: number;
  expiresAt: number;
  invitationId: string;
  invitedEmail: string;
  invitedName: string | null;
  publicId: string | null;
  status: DriverInvitationStatus;
  updatedAt: number;
};

export type ProviderDriversAction = {
  disabled?: boolean;
  id: "create_driver_invite";
  label: string;
  reason?: string;
};

export type ProviderDriversPayload = {
  activeDriverCount: number;
  allowedActions: ProviderDriversAction[];
  rows: ProviderDriverRow[];
};

export type ProviderDriversCopy = {
  acceptedDriverColumn: string;
  activeCountLabel: string;
  actionsColumn: string;
  emptyDescription: string;
  emptyTitle: string;
  formSlotLabel: string;
  invitedDriverColumn: string;
  statusColumn: string;
  statusLabels: Record<DriverInvitationStatus, string>;
  subtitle: string;
  title: string;
};

export type ProviderDriverInviteFormData = {
  invitedEmail: string;
  invitedName: string;
};

export type ProviderDriverInviteFormCopy = {
  copyInviteUrlLabel: string;
  emailLabel: string;
  emailPlaceholder: string;
  errorFallback: string;
  formTitle: string;
  inviteUrlLabel: string;
  nameLabel: string;
  namePlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  successLabel: string;
  unavailableLabel: string;
};
