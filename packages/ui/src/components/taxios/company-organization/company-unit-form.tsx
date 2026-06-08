"use client";

import { Building2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import type {
  CompanyOrganizationAction,
  CompanyUnitFormCopy,
  CompanyUnitFormData,
} from "../../../contracts/company-organization";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { WorkspaceSurface } from "../workspace/workspace-primitives";

export type CompanyUnitFormProps = {
  action?: CompanyOrganizationAction;
  className?: string;
  copy: CompanyUnitFormCopy;
  errorMessage?: string | null;
  isSubmitting?: boolean;
  onSubmit: (data: CompanyUnitFormData) => void;
  resetKey?: number | string;
  successMessage?: string | null;
};

const emptyUnitFormData: CompanyUnitFormData = {
  city: "",
  code: "",
  contactEmail: "",
  contactName: "",
  contactPhone: "",
  name: "",
  postalCode: "",
  street: "",
};

const fieldControlClassName =
  "h-10 rounded-xl bg-white/75 px-3 text-[13.5px] shadow-[inset_0_1px_0_var(--taxis-workspace-surface-sheen-strong)]";

export function CompanyUnitForm({
  action,
  className,
  copy,
  errorMessage,
  isSubmitting = false,
  onSubmit,
  resetKey,
  successMessage,
}: CompanyUnitFormProps) {
  const [formData, setFormData] =
    useState<CompanyUnitFormData>(emptyUnitFormData);
  const disabled = action === undefined || action.disabled === true;

  useEffect(() => {
    if (resetKey !== undefined) {
      setFormData(emptyUnitFormData);
    }
  }, [resetKey]);

  function updateField(field: keyof CompanyUnitFormData, value: string) {
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
              Company
            </p>
            <h2 className="mt-2 flex items-center gap-2 font-semibold text-[18px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
              <Building2
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
          <CompanyUnitFormField label={copy.nameLabel}>
            <Input
              className={fieldControlClassName}
              disabled={disabled || isSubmitting}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder={copy.namePlaceholder}
              required
              value={formData.name}
            />
          </CompanyUnitFormField>
          <CompanyUnitFormField label={copy.codeLabel}>
            <Input
              className={fieldControlClassName}
              disabled={disabled || isSubmitting}
              onChange={(event) => updateField("code", event.target.value)}
              placeholder={copy.codePlaceholder}
              value={formData.code}
            />
          </CompanyUnitFormField>
          <CompanyUnitFormField label={copy.streetLabel}>
            <Input
              className={fieldControlClassName}
              disabled={disabled || isSubmitting}
              onChange={(event) => updateField("street", event.target.value)}
              placeholder={copy.streetPlaceholder}
              value={formData.street}
            />
          </CompanyUnitFormField>
          <CompanyUnitFormField label={copy.postalCodeLabel}>
            <Input
              className={fieldControlClassName}
              disabled={disabled || isSubmitting}
              onChange={(event) =>
                updateField("postalCode", event.target.value)
              }
              placeholder={copy.postalCodePlaceholder}
              value={formData.postalCode}
            />
          </CompanyUnitFormField>
          <CompanyUnitFormField label={copy.cityLabel}>
            <Input
              className={fieldControlClassName}
              disabled={disabled || isSubmitting}
              onChange={(event) => updateField("city", event.target.value)}
              placeholder={copy.cityPlaceholder}
              value={formData.city}
            />
          </CompanyUnitFormField>
          <CompanyUnitFormField label={copy.contactNameLabel}>
            <Input
              className={fieldControlClassName}
              disabled={disabled || isSubmitting}
              onChange={(event) =>
                updateField("contactName", event.target.value)
              }
              placeholder={copy.contactNamePlaceholder}
              value={formData.contactName}
            />
          </CompanyUnitFormField>
          <CompanyUnitFormField label={copy.contactEmailLabel}>
            <Input
              className={fieldControlClassName}
              disabled={disabled || isSubmitting}
              inputMode="email"
              onChange={(event) =>
                updateField("contactEmail", event.target.value)
              }
              placeholder={copy.contactEmailPlaceholder}
              value={formData.contactEmail}
            />
          </CompanyUnitFormField>
          <CompanyUnitFormField label={copy.contactPhoneLabel}>
            <Input
              className={fieldControlClassName}
              disabled={disabled || isSubmitting}
              onChange={(event) =>
                updateField("contactPhone", event.target.value)
              }
              placeholder={copy.contactPhonePlaceholder}
              value={formData.contactPhone}
            />
          </CompanyUnitFormField>
        </div>

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

function CompanyUnitFormField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Label className="grid gap-2 text-[var(--taxis-workspace-text-secondary)]">
      <span className="font-semibold text-taxis-eyebrow text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
        {label}
      </span>
      {children}
    </Label>
  );
}
