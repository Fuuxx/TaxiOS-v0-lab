"use client";

import { Link2, UserPlus } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import type {
  ProviderDriverInviteFormCopy,
  ProviderDriverInviteFormData,
} from "../../../contracts/provider-drivers";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { WorkspaceSurface } from "../workspace/workspace-primitives";

export type ProviderDriverInviteFormProps = {
  className?: string;
  copy: ProviderDriverInviteFormCopy;
  disabled?: boolean;
  disabledReason?: string;
  errorMessage?: string | null;
  inviteUrl?: string | null;
  isSubmitting?: boolean;
  onCopyInviteUrl?: () => void;
  onSubmit: (data: ProviderDriverInviteFormData) => void;
  resetKey?: number | string;
  successMessage?: string | null;
};

const emptyInviteFormData: ProviderDriverInviteFormData = {
  invitedEmail: "",
  invitedName: "",
};

export function ProviderDriverInviteForm({
  className,
  copy,
  disabled = false,
  disabledReason,
  errorMessage,
  inviteUrl,
  isSubmitting = false,
  onCopyInviteUrl,
  onSubmit,
  resetKey,
  successMessage,
}: ProviderDriverInviteFormProps) {
  const [formData, setFormData] =
    useState<ProviderDriverInviteFormData>(emptyInviteFormData);

  useEffect(() => {
    if (resetKey !== undefined) {
      setFormData(emptyInviteFormData);
    }
  }, [resetKey]);

  function updateField(field: keyof ProviderDriverInviteFormData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (disabled || isSubmitting) {
      return;
    }

    onSubmit(formData);
  }

  const statusMessage = errorMessage ?? successMessage ?? disabledReason;

  return (
    <WorkspaceSurface
      className={cn("rounded-[30px] p-5", className)}
    >
      <form className="flex flex-col gap-5" onSubmit={submit}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold text-[10.5px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.18em]">
              Drivers
            </p>
            <h2 className="mt-2 flex items-center gap-2 font-semibold text-[20px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
              <UserPlus
                aria-hidden="true"
                className="text-[var(--taxis-workspace-accent-strong)]"
                size={18}
                strokeWidth={1.9}
              />
              {copy.formTitle}
            </h2>
          </div>
          <Button
            aria-busy={isSubmitting}
            disabled={disabled || isSubmitting}
            type="submit"
            variant="brand"
          >
            {isSubmitting ? copy.submittingLabel : copy.submitLabel}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ProviderDriverInviteFormField label={copy.emailLabel}>
            <Input
              disabled={disabled || isSubmitting}
              inputMode="email"
              onChange={(event) =>
                updateField("invitedEmail", event.target.value)
              }
              placeholder={copy.emailPlaceholder}
              required
              value={formData.invitedEmail}
            />
          </ProviderDriverInviteFormField>
          <ProviderDriverInviteFormField label={copy.nameLabel}>
            <Input
              disabled={disabled || isSubmitting}
              onChange={(event) =>
                updateField("invitedName", event.target.value)
              }
              placeholder={copy.namePlaceholder}
              value={formData.invitedName}
            />
          </ProviderDriverInviteFormField>
        </div>

        {inviteUrl ? (
          <div className="grid gap-2">
            <Label className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
              {copy.inviteUrlLabel}
            </Label>
            <div className="flex gap-2">
              <Input readOnly value={inviteUrl} />
              {onCopyInviteUrl ? (
                <Button onClick={onCopyInviteUrl} type="button" variant="outline">
                  <Link2 aria-hidden="true" size={16} strokeWidth={1.9} />
                  {copy.copyInviteUrlLabel}
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}

        {statusMessage ? (
          <p
            aria-live={errorMessage ? "assertive" : "polite"}
            className={cn(
              "font-medium text-[12px]",
              errorMessage
                ? "text-[var(--taxis-status-danger-text)]"
                : "text-[var(--taxis-workspace-text-muted)]",
            )}
            role={errorMessage ? "alert" : "status"}
          >
            {statusMessage}
          </p>
        ) : null}
      </form>
    </WorkspaceSurface>
  );
}

function ProviderDriverInviteFormField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Label className="grid gap-2 text-[var(--taxis-workspace-text-secondary)]">
      <span className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
        {label}
      </span>
      {children}
    </Label>
  );
}
