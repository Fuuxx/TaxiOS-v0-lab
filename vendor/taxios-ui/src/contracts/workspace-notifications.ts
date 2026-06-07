export type WorkspaceNotificationPriority =
  | "action_required"
  | "critical"
  | "info"
  | "success"
  | "warning";

export type WorkspaceNotificationType =
  | "billing_problem"
  | "booking_cancelled"
  | "booking_completed"
  | "booking_confirmed"
  | "booking_created"
  | "booking_rejected"
  | "company_member_invitation_approved"
  | "company_member_invitation_claimed"
  | "company_member_invitation_created"
  | "driver_arrived"
  | "driver_assigned"
  | "driver_enroute"
  | "driver_invitation_approved"
  | "driver_invitation_created"
  | "driver_onboarding_submitted"
  | "invoice_created"
  | "passenger_picked_up"
  | "vehicle_registered";

export type WorkspaceNotificationFilter = "all" | "important" | "unread";
export type WorkspaceNotificationsState = "empty" | "error" | "loading" | "ready";

export type WorkspaceNotificationItem = {
  body: string;
  createdAtLabel: string;
  entityPublicId: string | null;
  href: string | null;
  itemId: string;
  priority: WorkspaceNotificationPriority;
  publicId: string | null;
  read: boolean;
  title: string;
  type: WorkspaceNotificationType;
};
