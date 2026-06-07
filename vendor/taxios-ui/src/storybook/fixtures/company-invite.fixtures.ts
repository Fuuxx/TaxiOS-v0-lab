import type {
  CompanyMemberInviteAcceptanceCopy,
  CompanyMemberInvitePublicDetails,
} from "../../contracts/company-invite";

export const demoCompanyInviteAcceptanceCopy: CompanyMemberInviteAcceptanceCopy =
  {
    acceptedBody:
      "Your Company account is active. You can now open the Company dashboard.",
    acceptedCtaLabel: "Open company dashboard",
    acceptedTitle: "Company access active",
    acceptLabel: "Accept invite",
    acceptingLabel: "Accepting...",
    body: "Wenn du annimmst, wird deine Anfrage zur Freigabe gesendet.",
    claimedBody:
      "Your request is waiting for Company approval. The Company workspace will appear after approval.",
    claimedTitle: "Invite waiting for approval",
    errorAlreadyClaimed:
      "This invite link has already been claimed by another account.",
    errorExpired: "This Company invite is no longer valid.",
    errorFallback: "This invite could not be accepted. Please try again.",
    errorRejected: "This invite request was rejected.",
    errorRevoked: "This Company invite was revoked.",
    expiredBody:
      "This Company invite is no longer valid. Ask your Company admin for a new link.",
    expiredTitle: "Invite expired",
    invalidBody: "This Company invite link is not valid.",
    invalidTitle: "Invite not found",
    rejectedBody:
      "This invite request was rejected by the Company. Contact the inviter if this is unexpected.",
    rejectedTitle: "Invite rejected",
    revokedBody: "This Company invite was revoked by a Company admin.",
    revokedTitle: "Invite revoked",
    signedOutBody:
      "Sign in or create a normal TaxiOS account to continue this Company invite.",
    signInLabel: "Sign in",
    signUpLabel: "Create account",
    title: "Company invite",
  };

export const demoCompanyInvitePending: CompanyMemberInvitePublicDetails = {
  companyName: "Smoke Company HQ",
  expiresAt: 1_801_209_600_000,
  inviterName: "Ayoub Amid",
  status: "pending",
};

export const demoCompanyInviteAccepted: CompanyMemberInvitePublicDetails = {
  ...demoCompanyInvitePending,
  status: "accepted",
};

export const demoCompanyInviteRevoked: CompanyMemberInvitePublicDetails = {
  ...demoCompanyInvitePending,
  status: "revoked",
};

export const demoCompanyInviteExpired: CompanyMemberInvitePublicDetails = {
  ...demoCompanyInvitePending,
  status: "expired",
};

export const demoCompanyInviteClaimed: CompanyMemberInvitePublicDetails = {
  ...demoCompanyInvitePending,
  status: "claimed",
};

export const demoCompanyInviteRejected: CompanyMemberInvitePublicDetails = {
  ...demoCompanyInvitePending,
  status: "rejected",
};
