"use client";

import { LoaderCircle, X } from "lucide-react";

import type {
  CompanyBookingAction,
  CompanyBookingActionCopy,
} from "../../../contracts/company-dashboard";

export type CompanyBookingActionButtonProps = {
  action: CompanyBookingAction;
  copy: CompanyBookingActionCopy;
  errorMessage?: string | null;
  isWorking?: boolean;
  onRun: () => void;
};

const actionToneByActionId: Record<CompanyBookingAction["id"], string> = {
  cancel_booking:
    "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20",
};

export function CompanyBookingActionButton({
  action,
  copy,
  errorMessage = null,
  isWorking = false,
  onRun,
}: CompanyBookingActionButtonProps) {
  const isDisabled = action.disabled === true || isWorking;
  const visibleLabel = isWorking
    ? copy.workingLabelByActionId[action.id]
    : copy.labelByActionId[action.id];

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        aria-label={visibleLabel}
        aria-busy={isWorking}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55 ${
          actionToneByActionId[action.id]
        }`}
        disabled={isDisabled}
        onClick={(event) => {
          event.stopPropagation();
          onRun();
        }}
        title={action.reason ?? visibleLabel}
        type="button"
      >
        {isWorking ? (
          <LoaderCircle
            aria-hidden="true"
            className="h-3.5 w-3.5 animate-spin"
            strokeWidth={2}
          />
        ) : (
          <X aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.2} />
        )}
        <span className="sr-only">{visibleLabel}</span>
      </button>
      {errorMessage ? (
        <span
          aria-live="assertive"
          className="max-w-48 text-right text-[11px] text-destructive leading-tight"
          role="alert"
        >
          {errorMessage}
        </span>
      ) : null}
    </span>
  );
}
