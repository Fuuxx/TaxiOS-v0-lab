"use client";

import { Building2, Check, ChevronsUpDown, LoaderCircle } from "lucide-react";
import type React from "react";
import { useEffect, useId, useMemo, useState } from "react";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";

export type ActiveContextSwitcherOption = {
  contextLabel?: string;
  disabled?: boolean;
  helperText?: string;
  label: string;
  selected: boolean;
  type: "company" | "provider";
  value: string;
};

export type ActiveContextSwitcherCopy = {
  currentLabel: string;
  emptyLabel: string;
  errorFallback: string;
  label: string;
  loadingLabel: string;
  selectLabel: string;
  submitLabel: string;
  typeLabels: Record<ActiveContextSwitcherOption["type"], string>;
};

export type ActiveContextSwitcherSize = "default" | "compact";

export type ActiveContextSwitcherProps = {
  className?: string;
  copy: ActiveContextSwitcherCopy;
  disabled?: boolean;
  errorMessage?: string | null;
  isSubmitting?: boolean;
  onSelect: (value: string) => void;
  options: readonly ActiveContextSwitcherOption[];
  showHelperText?: boolean;
  size?: ActiveContextSwitcherSize;
};

export function ActiveContextSwitcher({
  className,
  copy,
  disabled = false,
  errorMessage,
  isSubmitting = false,
  onSelect,
  options,
  showHelperText = true,
  size = "default",
}: ActiveContextSwitcherProps) {
  const selectId = useId();
  const helperId = useId();
  const statusId = useId();
  const isCompact = size === "compact";
  const selectedOptionValue =
    options.find((option) => option.selected)?.value ?? null;
  const initialValue = selectedOptionValue ?? options[0]?.value ?? "";
  const [selectedValue, setSelectedValue] = useState(initialValue);

  useEffect(() => {
    setSelectedValue(initialValue);
  }, [initialValue]);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue) ?? null,
    [options, selectedValue],
  );
  const isEmpty = options.length === 0;
  const isDisabled = disabled || isSubmitting || isEmpty;
  const isSubmitDisabled =
    isDisabled ||
    selectedValue.length === 0 ||
    (selectedOptionValue !== null && selectedOptionValue === selectedValue);
  const statusMessage = errorMessage === "" ? copy.errorFallback : errorMessage;
  const selectedHelperText =
    selectedOption?.helperText ??
    (selectedOption ? copy.typeLabels[selectedOption.type] : copy.emptyLabel);
  const helperText = selectedOption?.selected
    ? `${copy.currentLabel} - ${selectedHelperText}`
    : selectedHelperText;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    onSelect(selectedValue);
  }

  if (isEmpty) {
    return (
      <div
        className={cn(
          "inline-flex min-h-11 items-center gap-3 rounded-2xl border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-4 py-2 shadow-[var(--taxis-shadow-soft)]",
          className,
        )}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--taxis-workspace-surface-deep)] text-[var(--taxis-workspace-text-muted)]">
          <Building2 aria-hidden="true" size={15} strokeWidth={1.9} />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
            {copy.label}
          </p>
          <p className="truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-secondary)]">
            {copy.emptyLabel}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      aria-describedby={statusMessage ? statusId : undefined}
      className={cn(
        "inline-flex w-full flex-col rounded-2xl border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] shadow-[var(--taxis-shadow-soft)] sm:w-auto",
        isCompact ? "max-w-sm gap-1.5 p-1.5" : "max-w-md gap-2 p-2",
        className,
      )}
      onSubmit={submit}
    >
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-end",
          isCompact ? "gap-1.5" : "gap-2",
        )}
      >
        <Label
          className={cn("grid min-w-0 flex-1", isCompact ? "gap-1" : "gap-1.5")}
        >
          <span className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
            {copy.label}
          </span>
          <span className="relative flex min-w-0 items-center">
            <Building2
              aria-hidden="true"
              className="pointer-events-none absolute left-3 text-[var(--taxis-workspace-text-muted)]"
              size={15}
              strokeWidth={1.9}
            />
            <select
              aria-describedby={showHelperText ? helperId : undefined}
              aria-label={copy.selectLabel}
              className={cn(
                "min-w-0 appearance-none rounded-xl border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface-deep)] font-semibold text-[var(--taxis-workspace-text-strong)] outline-none transition-colors focus:border-[var(--taxis-workspace-accent-strong)] disabled:cursor-not-allowed disabled:opacity-60",
                isCompact
                  ? "h-9 py-1.5 pr-8 pl-8 text-[12px] sm:min-w-48"
                  : "h-10 py-2 pr-9 pl-9 text-[13px] sm:min-w-56",
              )}
              disabled={isDisabled}
              id={selectId}
              onChange={(event) => setSelectedValue(event.target.value)}
              value={selectedValue}
            >
              {options.map((option) => (
                <option
                  disabled={option.disabled}
                  key={option.value}
                  value={option.value}
                >
                  {option.label} -{" "}
                  {option.contextLabel ?? copy.typeLabels[option.type]}
                </option>
              ))}
            </select>
            <ChevronsUpDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 text-[var(--taxis-workspace-text-muted)]"
              size={15}
              strokeWidth={1.9}
            />
          </span>
        </Label>

        <Button
          aria-busy={isSubmitting}
          disabled={isSubmitDisabled}
          size={isCompact ? "default" : "lg"}
          type="submit"
          variant="default"
        >
          {isSubmitting ? (
            <LoaderCircle
              aria-hidden="true"
              className="animate-spin"
              data-icon="inline-start"
            />
          ) : (
            <Check aria-hidden="true" data-icon="inline-start" />
          )}
          {isSubmitting ? copy.loadingLabel : copy.submitLabel}
        </Button>
      </div>

      {showHelperText ? (
        <p
          className={cn(
            "px-1 font-medium text-[var(--taxis-workspace-text-muted)] leading-relaxed",
            isCompact ? "text-[10.5px]" : "text-[11px]",
          )}
          id={helperId}
        >
          {helperText}
        </p>
      ) : null}

      {statusMessage ? (
        <p
          aria-live="assertive"
          className="px-1 font-medium text-[11px] text-destructive leading-relaxed"
          id={statusId}
          role="alert"
        >
          {statusMessage || copy.errorFallback}
        </p>
      ) : null}
    </form>
  );
}
