"use client";

import { CalendarPlus } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import type {
  CompanyBookingFormCopy,
  CompanyBookingFormData,
} from "../../../contracts/company-dashboard";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { TaxiosPorcelainSurface } from "./taxios-dashboard-primitives";

export type CompanyBookingFormProps = {
  className?: string;
  copy: CompanyBookingFormCopy;
  disabled?: boolean;
  disabledReason?: string;
  errorMessage?: string | null;
  isSubmitting?: boolean;
  onSubmit: (data: CompanyBookingFormData) => void;
  resetKey?: number | string;
  successMessage?: string | null;
};

const emptyCompanyBookingFormData: CompanyBookingFormData = {
  destinationAddress: "",
  passengerName: "",
  pickupAddress: "",
  requestedPickupAt: "",
};

export function CompanyBookingForm({
  className,
  copy,
  disabled = false,
  disabledReason,
  errorMessage,
  isSubmitting = false,
  onSubmit,
  resetKey,
  successMessage,
}: CompanyBookingFormProps) {
  const [formData, setFormData] = useState<CompanyBookingFormData>(
    emptyCompanyBookingFormData,
  );

  useEffect(() => {
    if (resetKey !== undefined) {
      setFormData(emptyCompanyBookingFormData);
    }
  }, [resetKey]);

  function updateField(field: keyof CompanyBookingFormData, value: string) {
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
    <TaxiosPorcelainSurface
      className={cn("taxios-company-booking-form rounded-[32px] p-6", className)}
    >
      <form className="flex flex-col gap-6" onSubmit={submit}>
        <div className="flex flex-col gap-3.5">
          <div>
            <p className="font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
              {copy.eyebrow}
            </p>
            <h2 className="mt-2 flex items-center gap-2.5 font-semibold text-[23px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
              <CalendarPlus
                aria-hidden="true"
                className="text-[var(--taxis-workspace-accent-strong)]"
                size={20}
                strokeWidth={1.9}
              />
              {copy.title}
            </h2>
            <p className="mt-1.5 max-w-3xl font-medium text-taxis-body-sm text-[var(--taxis-workspace-text-muted)] leading-relaxed">
              {copy.subtitle}
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          <CompanyBookingFormField label={copy.passengerLabel}>
            <Input
              className="h-10 rounded-xl px-3 text-[14px]"
              disabled={disabled || isSubmitting}
              onChange={(event) => updateField("passengerName", event.target.value)}
              placeholder={copy.passengerPlaceholder}
              required
              value={formData.passengerName}
            />
          </CompanyBookingFormField>
          <CompanyBookingFormField label={copy.pickupLabel}>
            <Input
              className="h-10 rounded-xl px-3 text-[14px]"
              disabled={disabled || isSubmitting}
              onChange={(event) => updateField("pickupAddress", event.target.value)}
              placeholder={copy.pickupPlaceholder}
              required
              value={formData.pickupAddress}
            />
          </CompanyBookingFormField>
          <CompanyBookingFormField label={copy.destinationLabel}>
            <Input
              className="h-10 rounded-xl px-3 text-[14px]"
              disabled={disabled || isSubmitting}
              onChange={(event) =>
                updateField("destinationAddress", event.target.value)
              }
              placeholder={copy.destinationPlaceholder}
              required
              value={formData.destinationAddress}
            />
          </CompanyBookingFormField>
          <CompanyBookingFormField label={copy.optionalPickupTimeLabel}>
            <Input
              className="h-10 rounded-xl px-3 text-[14px]"
              disabled={disabled || isSubmitting}
              onChange={(event) =>
                updateField("requestedPickupAt", event.target.value)
              }
              type="datetime-local"
              value={formData.requestedPickupAt}
            />
          </CompanyBookingFormField>
        </div>

        <div className="flex justify-end">
          <Button
            aria-busy={isSubmitting}
            className="h-10 w-full px-4 text-taxis-body-sm sm:w-auto"
            disabled={disabled || isSubmitting}
            type="submit"
            variant="brand"
          >
            {isSubmitting ? copy.submittingLabel : copy.submitLabel}
          </Button>
        </div>

        {statusMessage ? (
          <p
            aria-live={errorMessage ? "assertive" : "polite"}
            className={cn(
              "font-medium text-taxis-body-sm",
              errorMessage
                ? "text-destructive"
                : "text-[var(--taxis-workspace-text-muted)]",
            )}
            role={errorMessage ? "alert" : "status"}
          >
            {statusMessage}
          </p>
        ) : null}
      </form>
    </TaxiosPorcelainSurface>
  );
}

function CompanyBookingFormField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Label className="grid gap-2.5 text-[var(--taxis-workspace-text-secondary)]">
      <span className="font-semibold text-taxis-eyebrow text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
        {label}
      </span>
      {children}
    </Label>
  );
}
