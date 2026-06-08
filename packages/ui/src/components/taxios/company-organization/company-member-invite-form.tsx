"use client";

import { Link2, UserPlus } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import type {
  CompanyMemberInviteFormCopy,
  CompanyMemberInviteFormData,
  CompanyMemberInviteRoleOption,
  CompanyMemberInviteUnitOption,
  CompanyOrganizationAction,
} from "../../../contracts/company-organization";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { WorkspaceSurface } from "../workspace/workspace-primitives";

export type CompanyMemberInviteFormProps = {
  action?: CompanyOrganizationAction;
  className?: string;
  copy: CompanyMemberInviteFormCopy;
  errorMessage?: string | null;
  inviteUrl?: string | null;
  isSubmitting?: boolean;
  onCopyInviteUrl?: () => void;
  onSubmit: (data: CompanyMemberInviteFormData) => void;
  resetKey?: number | string;
  roleOptions: readonly CompanyMemberInviteRoleOption[];
  successMessage?: string | null;
  unitOptions: readonly CompanyMemberInviteUnitOption[];
};

const emptyInviteFormData: CompanyMemberInviteFormData = {
  invitedEmail: "",
  invitedName: "",
  role: "company_user",
  unitId: "",
};

const fieldControlClassName =
  "h-10 rounded-xl bg-white/75 px-3 text-[13.5px] shadow-[inset_0_1px_0_var(--taxis-workspace-surface-sheen-strong)]";

const selectControlClassName =
  "h-10 w-full min-w-0 rounded-xl border border-input bg-white/75 px-3 py-1.5 text-[13.5px] outline-none transition-colors shadow-[inset_0_1px_0_var(--taxis-workspace-surface-sheen-strong)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50";

export function CompanyMemberInviteForm({
  action,
  className,
  copy,
  errorMessage,
  inviteUrl,
  isSubmitting = false,
  onCopyInviteUrl,
  onSubmit,
  resetKey,
  roleOptions,
  successMessage,
  unitOptions,
}: CompanyMemberInviteFormProps) {
  const [formData, setFormData] =
    useState<CompanyMemberInviteFormData>(emptyInviteFormData);
  const disabled = action === undefined || action.disabled === true;

  useEffect(() => {
    if (resetKey !== undefined) {
      setFormData(emptyInviteFormData);
    }
  }, [resetKey]);

  function updateField<Field extends keyof CompanyMemberInviteFormData>(
    field: Field,
    value: CompanyMemberInviteFormData[Field],
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (disabled || isSubmitting) {
      return;
    }

    onSubmit(formData);
  }

  const statusMessage =
    errorMessage ??
    successMessage ??
    (disabled ? (action?.reason ?? copy.unavailableLabel) : null);

  return (
    <WorkspaceSurface
      className={cn("taxis-company-surface-section p-5", className)}
    >
      <form className="flex flex-col gap-5" onSubmit={submit}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold text-[10.5px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
              Members
            </p>
            <h2 className="mt-2 flex items-center gap-2 font-semibold text-[18px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
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
          <CompanyMemberInviteFormField label={copy.emailLabel}>
            <Input
              className={fieldControlClassName}
              disabled={disabled || isSubmitting}
              inputMode="email"
              onChange={(event) =>
                updateField("invitedEmail", event.target.value)
              }
              placeholder={copy.emailPlaceholder}
              required
              value={formData.invitedEmail}
            />
          </CompanyMemberInviteFormField>
          <CompanyMemberInviteFormField label={copy.nameLabel}>
            <Input
              className={fieldControlClassName}
              disabled={disabled || isSubmitting}
              onChange={(event) =>
                updateField("invitedName", event.target.value)
              }
              placeholder={copy.namePlaceholder}
              value={formData.invitedName}
            />
          </CompanyMemberInviteFormField>
          <CompanyMemberInviteFormField label={copy.roleLabel}>
            <select
              className={selectControlClassName}
              disabled={disabled || isSubmitting}
              onChange={(event) =>
                updateField(
                  "role",
                  event.target.value as CompanyMemberInviteFormData["role"],
                )
              }
              value={formData.role}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </CompanyMemberInviteFormField>
          <CompanyMemberInviteFormField label={copy.unitLabel}>
            <select
              className={selectControlClassName}
              disabled={disabled || isSubmitting}
              onChange={(event) => updateField("unitId", event.target.value)}
              value={formData.unitId}
            >
              <option value="">{copy.unitPlaceholder}</option>
              {unitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </CompanyMemberInviteFormField>
        </div>

        {inviteUrl ? (
          <div className="grid gap-2">
            <Label className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
              {copy.inviteUrlLabel}
            </Label>
            <div className="flex gap-2">
              <Input
                className={fieldControlClassName}
                readOnly
                value={inviteUrl}
              />
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
                ? "text-red-700"
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

function CompanyMemberInviteFormField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Label className="grid gap-2 text-[var(--taxis-workspace-text-secondary)]">
      <span className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
        {label}
      </span>
      {children}
    </Label>
  );
}
