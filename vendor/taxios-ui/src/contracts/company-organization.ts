export type CompanyUnitStatus = "active" | "deleted";

export type CompanyMemberInvitationStatus =
  | "accepted"
  | "claimed"
  | "expired"
  | "pending"
  | "rejected"
  | "revoked";

export type CompanyMemberInviteEmailDeliveryStatus =
  | "failed"
  | "not_requested"
  | "sent";

export type CompanyMemberInviteRole =
  | "company_admin"
  | "company_booker"
  | "company_user";

export type CompanyPermissionKey =
  | "workspace.view"
  | "workspace.search"
  | "notifications.view"
  | "notifications.manage"
  | "bookings.view_own"
  | "bookings.view_all"
  | "bookings.create"
  | "bookings.update"
  | "bookings.cancel"
  | "bookings.view_driver_vehicle"
  | "bookings.view_history"
  | "organization.view"
  | "members.view"
  | "members.invite"
  | "members.approve_invites"
  | "members.update"
  | "members.deactivate"
  | "roles.view"
  | "roles.manage"
  | "units.view"
  | "units.manage"
  | "finance.view"
  | "invoices.view"
  | "booking_costs.view"
  | "finance.export"
  | "reports.view"
  | "audit.view"
  | "data.export"
  | "settings.view"
  | "settings.general.manage"
  | "settings.booking_rules.manage"
  | "settings.notifications.manage"
  | "settings.security.view"
  | "integrations.manage";

export type CompanyPermissionDefinition = {
  description: string;
  groupKey: string;
  groupLabel: string;
  key: CompanyPermissionKey;
  label: string;
  sensitive: boolean;
};

export type CompanyPermissionGroup = {
  description: string;
  key: string;
  label: string;
  permissions: Omit<CompanyPermissionDefinition, "groupKey" | "groupLabel">[];
};

export type CompanyPermissionCatalog = {
  groups: CompanyPermissionGroup[];
  permissions: CompanyPermissionDefinition[];
};

export type CompanyRoleRow = {
  assignedMemberCount: number;
  createdAt: number;
  description: string;
  name: string;
  permissions: CompanyPermissionKey[];
  publicId: string | null;
  roleId: string | null;
  roleKey: string;
  status: "active";
  systemRole: boolean;
  updatedAt: number;
};

export type CompanyMemberAccessSummary = {
  effectivePermissions: CompanyPermissionKey[];
  extraPermissions: CompanyPermissionKey[];
  roleKey: string;
  roleName: string;
  rolePermissions: CompanyPermissionKey[];
  rolePublicId: string | null;
  systemRole: boolean;
};

export type CompanyMemberAccessDetail = {
  access: CompanyMemberAccessSummary;
  auditHistory: Array<{
    createdAt: number;
    decision: string;
    publicId: string | null;
    reason: string | null;
  }>;
  companyContactEmail: string | null;
  displayName: string | null;
  email: string | null;
  imageUrl: string | null;
  memberPublicId: string | null;
  membershipCreatedAt: number;
  membershipId: string;
  membershipUpdatedAt: number;
  status: "active";
  unitName: string | null;
  userPublicId: string | null;
};

export type CompanyAccessActionId =
  | "create_company_role"
  | "manage_company_member_access"
  | "view_company_member_access_detail";

export type CompanyAccessAction = {
  disabled?: boolean;
  id: CompanyAccessActionId;
  label: string;
  reason?: string;
};

export type CompanyAccessModel = {
  allowedActions: CompanyAccessAction[];
  permissionCatalog: CompanyPermissionCatalog;
  roles: CompanyRoleRow[];
};

export type CompanyOrganizationActionId =
  | "create_company_member_invite"
  | "create_company_unit"
  | "manage_company_roles";

export type CompanyOrganizationSectionId =
  | "invites"
  | "members"
  | "overview"
  | "roles"
  | "standorte";

export type CompanyOrganizationAction = {
  disabled?: boolean;
  id: CompanyOrganizationActionId;
  label: string;
  reason?: string;
};

export type CompanyUnitRow = {
  city: string | null;
  code: string | null;
  contactEmail: string | null;
  contactName: string | null;
  contactPhone: string | null;
  createdAt: number;
  name: string;
  organizationId: string;
  postalCode: string | null;
  publicId: string | null;
  status: CompanyUnitStatus;
  street: string | null;
  unitId: string;
  updatedAt: number;
};

export type CompanyMemberRow = {
  access: CompanyMemberAccessSummary;
  companyContactEmail: string | null;
  displayName: string | null;
  imageUrl: string | null;
  membershipId: string;
  publicId: string | null;
  role: string;
  status: "active";
  unitId: string | null;
  unitName: string | null;
  userId: string;
};

export type CompanyMemberInvitationAction = {
  disabled?: boolean;
  id:
    | "approve_company_member_invite"
    | "create_company_member_invite_link"
    | "reject_company_member_invite"
    | "revoke_company_member_invite";
  label: string;
  reason?: string;
};

export type CompanyMemberInvitationRow = {
  allowedActions: CompanyMemberInvitationAction[];
  companyOrganizationId: string;
  createdAt: number;
  emailDeliveryError: string | null;
  emailDeliveryProvider: "clerk" | null;
  emailDeliveryStatus: CompanyMemberInviteEmailDeliveryStatus;
  emailDeliveryUpdatedAt: number | null;
  expiresAt: number;
  invitationId: string;
  claimantName: string | null;
  invitedEmail: string;
  invitedName: string | null;
  publicId: string | null;
  role: CompanyMemberInviteRole;
  status: CompanyMemberInvitationStatus;
  unitId: string | null;
  unitName: string | null;
  updatedAt: number;
};

export type CompanyOrganizationPayload = {
  access: CompanyAccessModel;
  allowedActions: CompanyOrganizationAction[];
  invitations: CompanyMemberInvitationRow[];
  members: CompanyMemberRow[];
  organizationId: string;
  organizationName: string;
  organizationPublicId: string | null;
  organizationSlug: string;
  units: CompanyUnitRow[];
  visibleSections: CompanyOrganizationSectionId[];
};

export type CompanyOrganizationCopy = {
  activeMembersLabel: string;
  actionsColumn: string;
  deliveryStatusLabels: Record<CompanyMemberInviteEmailDeliveryStatus, string>;
  inviteEmailColumn: string;
  inviteDeliveryColumn: string;
  inviteNameFallback: string;
  inviteRoleColumn: string;
  inviteStatusColumn: string;
  invitationsEmptyDescription: string;
  invitationsEmptyTitle: string;
  invitationsSectionTitle: string;
  memberAccountColumn: string;
  memberRoleColumn: string;
  memberUnitColumn: string;
  membersEmptyDescription: string;
  membersEmptyTitle: string;
  membersSectionTitle: string;
  openInvitesLabel: string;
  roleLabels: Record<CompanyMemberInviteRole, string>;
  roleManagementCreateLabel: string;
  roleManagementDescription: string;
  roleManagementEmptyDescription: string;
  roleManagementEmptyTitle: string;
  roleManagementSectionTitle: string;
  roleManagementSystemRoleLabel: string;
  roleManagementCustomRoleLabel: string;
  roleManagementMembersLabel: string;
  memberDetailCloseLabel: string;
  memberDetailEditLabel: string;
  memberDetailCancelLabel: string;
  memberDetailSaveLabel: string;
  memberDetailSavingLabel: string;
  memberDetailTitle: string;
  memberDetailProfileTitle: string;
  memberDetailMembershipTitle: string;
  memberDetailPermissionsTitle: string;
  memberDetailRolePermissionsLabel: string;
  memberDetailExtraPermissionsLabel: string;
  memberDetailEffectivePermissionsLabel: string;
  memberDetailAuditTitle: string;
  memberDetailNoAuditLabel: string;
  memberDetailReadOnlyReason: string;
  memberDetailSinceLabel: string;
  memberDetailUpdatedLabel: string;
  memberDetailUnitLabel: string;
  permissionSensitiveLabel: string;
  sectionLabels: Record<CompanyOrganizationSectionId, string>;
  statusLabels: Record<CompanyMemberInvitationStatus, string>;
  subtitle: string;
  title: string;
  unitCodeFallback: string;
  unitContactColumn: string;
  unitLocationColumn: string;
  unitNameColumn: string;
  unitsEmptyDescription: string;
  unitsEmptyTitle: string;
  unitsLabel: string;
  unitsSectionTitle: string;
};

export type CompanyUnitFormData = {
  city: string;
  code: string;
  contactEmail: string;
  contactName: string;
  contactPhone: string;
  name: string;
  postalCode: string;
  street: string;
};

export type CompanyUnitFormCopy = {
  cityLabel: string;
  cityPlaceholder: string;
  codeLabel: string;
  codePlaceholder: string;
  contactEmailLabel: string;
  contactEmailPlaceholder: string;
  contactNameLabel: string;
  contactNamePlaceholder: string;
  contactPhoneLabel: string;
  contactPhonePlaceholder: string;
  errorFallback: string;
  formTitle: string;
  nameLabel: string;
  namePlaceholder: string;
  postalCodeLabel: string;
  postalCodePlaceholder: string;
  streetLabel: string;
  streetPlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  successLabel: string;
  unavailableLabel: string;
};

export type CompanyMemberInviteFormData = {
  invitedEmail: string;
  invitedName: string;
  role: CompanyMemberInviteRole;
  unitId: string;
};

export type CompanyMemberInviteUnitOption = {
  label: string;
  value: string;
};

export type CompanyMemberInviteRoleOption = {
  label: string;
  value: CompanyMemberInviteRole;
};

export type CompanyMemberInviteFormCopy = {
  copyInviteUrlLabel: string;
  emailLabel: string;
  emailPlaceholder: string;
  errorFallback: string;
  formTitle: string;
  inviteUrlLabel: string;
  nameLabel: string;
  namePlaceholder: string;
  roleLabel: string;
  submitLabel: string;
  submittingLabel: string;
  successLabel: string;
  unitLabel: string;
  unitPlaceholder: string;
  unavailableLabel: string;
};
