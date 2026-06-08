"use client";

import { BriefcaseBusiness } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import type {
  ProviderJobFormCopy,
  ProviderJobFormData,
} from "../../../contracts/provider-inbox";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { TaxiDateTimeField } from "../../ui/date-time-field";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { WorkspaceSurface } from "../workspace/workspace-primitives";

export type ProviderJobFormProps = {
  className?: string;
  copy: ProviderJobFormCopy;
  disabled?: boolean;
  disabledReason?: string;
  errorMessage?: string | null;
  isSubmitting?: boolean;
  onSubmit: (data: ProviderJobFormData) => void;
  resetKey?: number | string;
  successMessage?: string | null;
};

const emptyProviderJobFormData: ProviderJobFormData = {
  destinationAddress: "",
  passengerName: "",
  pickupAddress: "",
  requestedPickupAt: "",
};

export function ProviderJobForm({
  className,
  copy,
  disabled = false,
  disabledReason,
  errorMessage,
  isSubmitting = false,
  onSubmit,
  resetKey,
  successMessage,
}: ProviderJobFormProps) {
  const [formData, setFormData] = useState<ProviderJobFormData>(
    emptyProviderJobFormData,
  );

  useEffect(() => {
    if (resetKey !== undefined) {
      setFormData(emptyProviderJobFormData);
    }
  }, [resetKey]);

  function updateField(field: keyof ProviderJobFormData, value: string) {
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
      className={cn("taxios-provider-job-form rounded-[30px] p-5", className)}
    >
      <form className="flex flex-col gap-5" onSubmit={submit}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold text-[10.5px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
              Accepted jobs
            </p>
            <h2 className="mt-2 flex items-center gap-2 font-semibold text-[20px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
              <BriefcaseBusiness
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

        <div className="grid gap-4 lg:grid-cols-4">
          <ProviderJobFormField label={copy.passengerLabel}>
            <Input
              disabled={disabled || isSubmitting}
              onChange={(event) => updateField("passengerName", event.target.value)}
              placeholder={copy.passengerPlaceholder}
              required
              value={formData.passengerName}
            />
          </ProviderJobFormField>
          <ProviderJobFormField label={copy.pickupLabel}>
            <Input
              disabled={disabled || isSubmitting}
              onChange={(event) => updateField("pickupAddress", event.target.value)}
              placeholder={copy.pickupPlaceholder}
              required
              value={formData.pickupAddress}
            />
          </ProviderJobFormField>
          <ProviderJobFormField label={copy.destinationLabel}>
            <Input
              disabled={disabled || isSubmitting}
              onChange={(event) =>
                updateField("destinationAddress", event.target.value)
              }
              placeholder={copy.destinationPlaceholder}
              required
              value={formData.destinationAddress}
            />
          </ProviderJobFormField>
          <ProviderJobFormField label={copy.optionalPickupTimeLabel}>
            <TaxiDateTimeField
              disabled={disabled || isSubmitting}
              onValueChange={(value) => updateField("requestedPickupAt", value)}
              value={formData.requestedPickupAt}
            />
          </ProviderJobFormField>
        </div>

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

function ProviderJobFormField({
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
