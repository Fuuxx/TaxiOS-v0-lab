import type { CompanyMemberInvitationStatus } from "./company-organization";

export type CompanyMemberInvitePublicDetails = {
  companyName: string;
  expiresAt: number;
  inviterName: string;
  status: CompanyMemberInvitationStatus;
};

export type CompanyMemberInviteAcceptanceCopy = {
  acceptedBody: string;
  acceptedCtaLabel: string;
  acceptedTitle: string;
  acceptLabel: string;
  acceptingLabel: string;
  body: string;
  claimedBody: string;
  claimedTitle: string;
  errorAlreadyClaimed: string;
  errorExpired: string;
  errorFallback: string;
  errorRejected: string;
  errorRevoked: string;
  expiredBody: string;
  expiredTitle: string;
  invalidBody: string;
  invalidTitle: string;
  rejectedBody: string;
  rejectedTitle: string;
  revokedBody: string;
  revokedTitle: string;
  signedOutBody: string;
  signInLabel: string;
  signUpLabel: string;
  title: string;
};
