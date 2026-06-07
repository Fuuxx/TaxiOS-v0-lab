"use client";

import { CarFront } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import type {
  ProviderVehicleFormCopy,
  ProviderVehicleFormData,
} from "../../../contracts/provider-fleet";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { WorkspaceSurface } from "../workspace/workspace-primitives";

export type ProviderVehicleFormProps = {
  className?: string;
  copy: ProviderVehicleFormCopy;
  disabled?: boolean;
  disabledReason?: string;
  errorMessage?: string | null;
  isSubmitting?: boolean;
  onSubmit: (data: ProviderVehicleFormData) => void;
  resetKey?: number | string;
  successMessage?: string | null;
};

const emptyProviderVehicleFormData: ProviderVehicleFormData = {
  displayName: "",
  licensePlate: "",
};

export function ProviderVehicleForm({
  className,
  copy,
  disabled = false,
  disabledReason,
  errorMessage,
  isSubmitting = false,
  onSubmit,
  resetKey,
  successMessage,
}: ProviderVehicleFormProps) {
  const [formData, setFormData] = useState<ProviderVehicleFormData>(
    emptyProviderVehicleFormData,
  );

  useEffect(() => {
    if (resetKey !== undefined) {
      setFormData(emptyProviderVehicleFormData);
    }
  }, [resetKey]);

  function updateField(field: keyof ProviderVehicleFormData, value: string) {
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
      className={cn(
        "taxios-provider-vehicle-form rounded-[30px] p-5",
        className,
      )}
    >
      <form className="flex flex-col gap-5" onSubmit={submit}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold text-[10.5px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.18em]">
              Fleet
            </p>
            <h2 className="mt-2 flex items-center gap-2 font-semibold text-[20px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
              <CarFront
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
          <ProviderVehicleFormField label={copy.displayNameLabel}>
            <Input
              disabled={disabled || isSubmitting}
              onChange={(event) =>
                updateField("displayName", event.target.value)
              }
              placeholder={copy.displayNamePlaceholder}
              required
              value={formData.displayName}
            />
          </ProviderVehicleFormField>
          <ProviderVehicleFormField label={copy.licensePlateLabel}>
            <Input
              disabled={disabled || isSubmitting}
              onChange={(event) =>
                updateField("licensePlate", event.target.value)
              }
              placeholder={copy.licensePlatePlaceholder}
              required
              value={formData.licensePlate}
            />
          </ProviderVehicleFormField>
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

function ProviderVehicleFormField({
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
