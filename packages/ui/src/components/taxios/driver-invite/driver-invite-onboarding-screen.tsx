import { CheckCircle2, ShieldAlert, UserCheck } from "lucide-react";
import type React from "react";

import type {
  DriverInviteOnboardingCopy,
  DriverInvitePublicDetails,
} from "../../../contracts/driver-invite";
import { buttonVariants } from "../../ui/button";
import {
  WorkspaceInnerCard,
  WorkspaceSurface,
} from "../workspace/workspace-primitives";

export type DriverInviteOnboardingScreenProps = {
  copy: DriverInviteOnboardingCopy;
  invite: DriverInvitePublicDetails | null;
  onboardingForm?: React.ReactNode;
  signedIn: boolean;
  signInHref: string;
  signUpHref: string;
};

function DriverInviteStateCard({
  body,
  children,
  title,
}: {
  body: string;
  children?: React.ReactNode;
  title: string;
}) {
  return (
    <WorkspaceInnerCard className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--taxis-workspace-accent-soft)] text-[var(--taxis-workspace-accent-strong)]">
        <ShieldAlert aria-hidden="true" size={22} strokeWidth={1.8} />
      </span>
      <h2 className="mt-4 font-semibold text-[22px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
        {title}
      </h2>
      <p className="mt-2 max-w-xl text-[13px] text-[var(--taxis-workspace-text-muted)] leading-relaxed">
        {body}
      </p>
      {children ? <div className="mt-5 flex gap-3">{children}</div> : null}
    </WorkspaceInnerCard>
  );
}

export function DriverInviteOnboardingScreen({
  copy,
  invite,
  onboardingForm,
  signedIn,
  signInHref,
  signUpHref,
}: DriverInviteOnboardingScreenProps) {
  if (invite === null) {
    return (
      <DriverInvitePageShell>
        <DriverInviteStateCard body={copy.invalidBody} title={copy.invalidTitle} />
      </DriverInvitePageShell>
    );
  }

  if (invite.status === "expired") {
    return (
      <DriverInvitePageShell>
        <DriverInviteStateCard body={copy.expiredBody} title={copy.expiredTitle} />
      </DriverInvitePageShell>
    );
  }

  if (invite.status === "revoked") {
    return (
      <DriverInvitePageShell>
        <DriverInviteStateCard body={copy.revokedBody} title={copy.revokedTitle} />
      </DriverInvitePageShell>
    );
  }

  if (invite.status === "approved") {
    return (
      <DriverInvitePageShell>
        <DriverInviteStateCard body={copy.approvedBody} title={copy.approvedTitle}>
          <a className={buttonVariants({ variant: "brand" })} href="/driver-jobs">
            {copy.approvedCtaLabel}
          </a>
        </DriverInviteStateCard>
      </DriverInvitePageShell>
    );
  }

  if (invite.status === "onboarding_submitted") {
    return (
      <DriverInvitePageShell>
        <DriverInviteStateCard
          body={copy.submittedBody}
          title={copy.submittedTitle}
        />
      </DriverInvitePageShell>
    );
  }

  if (!signedIn) {
    return (
      <DriverInvitePageShell>
        <DriverInviteStateCard body={copy.signedOutBody} title={copy.title}>
          <a className={buttonVariants({ variant: "brand" })} href={signInHref}>
            {copy.signInLabel}
          </a>
          <a className={buttonVariants({ variant: "outline" })} href={signUpHref}>
            {copy.signUpLabel}
          </a>
        </DriverInviteStateCard>
      </DriverInvitePageShell>
    );
  }

  return (
    <DriverInvitePageShell>
      <WorkspaceSurface className="grid gap-6 rounded-[30px] p-6">
        <div>
          <p className="flex items-center gap-2 font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
            <UserCheck aria-hidden="true" size={14} strokeWidth={1.9} />
            {invite.providerName}
          </p>
          <h1 className="mt-2 font-semibold text-[30px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
            {copy.title}
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] text-[var(--taxis-workspace-text-muted)] leading-relaxed">
            {copy.body}
          </p>
        </div>
        {onboardingForm}
      </WorkspaceSurface>
    </DriverInvitePageShell>
  );
}

function DriverInvitePageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="taxis-workspace-ambient relative min-h-dvh overflow-hidden text-[var(--taxis-workspace-text-primary)]">
      <div className="taxis-workspace-ambient-bg" />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col justify-center px-6 py-12">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--taxis-workspace-accent-soft)] text-[var(--taxis-workspace-accent-strong)]">
            <CheckCircle2 aria-hidden="true" size={20} strokeWidth={1.8} />
          </span>
          <div className="flex items-baseline font-extrabold text-3xl tracking-tighter">
            <span className="text-zinc-900">Taxi</span>
            <span className="text-[var(--taxis-workspace-accent)]">OS</span>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
