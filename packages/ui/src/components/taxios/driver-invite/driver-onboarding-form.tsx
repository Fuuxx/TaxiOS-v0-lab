"use client";

import { ClipboardCheck } from "lucide-react";
import type React from "react";
import { useState } from "react";

import type {
  DriverOnboardingFormCopy,
  DriverOnboardingFormData,
} from "../../../contracts/driver-invite";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { WorkspaceSurface } from "../workspace/workspace-primitives";

export type DriverOnboardingFormProps = {
  copy: DriverOnboardingFormCopy;
  errorMessage?: string | null;
  isSubmitting?: boolean;
  onSubmit: (data: DriverOnboardingFormData) => void;
  successMessage?: string | null;
};

const emptyOnboardingData: DriverOnboardingFormData = {
  driverLicenseReference: "",
  legalName: "",
  passengerTransportPermitReference: "",
  phone: "",
  termsAccepted: false,
};

export function DriverOnboardingForm({
  copy,
  errorMessage,
  isSubmitting = false,
  onSubmit,
  successMessage,
}: DriverOnboardingFormProps) {
  const [formData, setFormData] =
    useState<DriverOnboardingFormData>(emptyOnboardingData);

  function updateField(
    field: keyof DriverOnboardingFormData,
    value: boolean | string,
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    onSubmit(formData);
  }

  const statusMessage = errorMessage ?? successMessage;

  return (
    <WorkspaceSurface className="rounded-[30px] p-5">
      <form className="flex flex-col gap-5" onSubmit={submit}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold text-[10.5px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
              Driver onboarding
            </p>
            <h2 className="mt-2 flex items-center gap-2 font-semibold text-[20px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
              <ClipboardCheck
                aria-hidden="true"
                className="text-[var(--taxis-workspace-accent-strong)]"
                size={18}
                strokeWidth={1.9}
              />
              {copy.formTitle}
            </h2>
          </div>
          <Button aria-busy={isSubmitting} disabled={isSubmitting} type="submit">
            {isSubmitting ? copy.submittingLabel : copy.submitLabel}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <DriverOnboardingFormField label={copy.legalNameLabel}>
            <Input
              disabled={isSubmitting}
              onChange={(event) => updateField("legalName", event.target.value)}
              placeholder={copy.legalNamePlaceholder}
              required
              value={formData.legalName}
            />
          </DriverOnboardingFormField>
          <DriverOnboardingFormField label={copy.phoneLabel}>
            <Input
              disabled={isSubmitting}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder={copy.phonePlaceholder}
              required
              value={formData.phone}
            />
          </DriverOnboardingFormField>
          <DriverOnboardingFormField label={copy.driverLicenseLabel}>
            <Input
              disabled={isSubmitting}
              onChange={(event) =>
                updateField("driverLicenseReference", event.target.value)
              }
              placeholder={copy.driverLicensePlaceholder}
              required
              value={formData.driverLicenseReference}
            />
          </DriverOnboardingFormField>
          <DriverOnboardingFormField label={copy.permitLabel}>
            <Input
              disabled={isSubmitting}
              onChange={(event) =>
                updateField(
                  "passengerTransportPermitReference",
                  event.target.value,
                )
              }
              placeholder={copy.permitPlaceholder}
              required
              value={formData.passengerTransportPermitReference}
            />
          </DriverOnboardingFormField>
        </div>

        <Label className="flex items-start gap-3 text-[13px] text-[var(--taxis-workspace-text-secondary)] leading-relaxed">
          <input
            checked={formData.termsAccepted}
            className="mt-0.5 h-4 w-4 rounded border-[var(--taxis-workspace-border)]"
            disabled={isSubmitting}
            onChange={(event) =>
              updateField("termsAccepted", event.target.checked)
            }
            required
            type="checkbox"
          />
          <span>{copy.termsLabel}</span>
        </Label>

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

function DriverOnboardingFormField({
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
