"use client";

/**
 * Dashboard-local Fastbooking footer member controls; not a global search/toggle component.
 * Parent owns query, open state, ref, and focus timing; styling lives in `company-dashboard.css`.
 */

import type { ChangeEvent, RefObject } from "react";

import { ArrowRight, Plus, Search } from "lucide-react";

export type CompanyDashboardFastbookingFooterMemberActionsProps = {
  bookingLabel: string;
  bookingSelectedCount: number;
  closeLabel: string;
  isSelecting: boolean;
  /** Matches `id` on the floating member picker overlay root (`aria-controls`). */
  memberPickerOverlayId: string;
  memberQuery: string;
  onBookingStart: () => void;
  onMemberQueryChange: (nextValue: string) => void;
  onToggleSelecting: () => void;
  openLabel: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
  searchLabel: string;
  searchPlaceholder: string;
};

export function CompanyDashboardFastbookingFooterMemberActions({
  bookingLabel,
  bookingSelectedCount,
  closeLabel,
  isSelecting,
  memberPickerOverlayId,
  memberQuery,
  onBookingStart,
  onMemberQueryChange,
  onToggleSelecting,
  openLabel,
  searchInputRef,
  searchLabel,
  searchPlaceholder,
}: CompanyDashboardFastbookingFooterMemberActionsProps) {
  const canStartBooking = !isSelecting && bookingSelectedCount > 0;
  const toggleLabel = canStartBooking
    ? `${bookingLabel} (${bookingSelectedCount})`
    : isSelecting
      ? closeLabel
      : openLabel;
  const handleFooterAction = () => {
    if (canStartBooking) {
      onBookingStart();
      return;
    }

    onToggleSelecting();
  };

  return (
    <>
      <div
        className={`fastbooking-member-search ml-auto flex min-w-0 items-center justify-end ${
          isSelecting
            ? "fastbooking-member-search-open"
            : "fastbooking-member-search-closed"
        }`}
        aria-hidden={!isSelecting}
      >
        <label className="fastbooking-member-search-rail relative block min-w-0">
          <Search
            className="-translate-y-1/2 absolute top-1/2 left-3 text-[var(--taxis-workspace-text-muted)]"
            size={13}
          />
          <input
            aria-label={searchLabel}
            className="box-border block h-9 w-full rounded-full border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface-deep)] pr-3 pl-8 font-semibold text-[11px] text-[var(--taxis-workspace-text-strong)] leading-none outline-none transition-colors placeholder:text-[var(--taxis-workspace-text-muted)] focus:border-[var(--taxis-workspace-accent-ring)] focus:bg-[var(--taxis-workspace-surface)] focus:ring-2 focus:ring-[var(--taxis-workspace-focus-ring)]"
            disabled={!isSelecting}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onMemberQueryChange(event.target.value)
            }
            placeholder={searchPlaceholder}
            ref={searchInputRef}
            tabIndex={isSelecting ? 0 : -1}
            type="text"
            value={memberQuery}
          />
        </label>
      </div>
      <button
        aria-controls={canStartBooking ? undefined : memberPickerOverlayId}
        aria-expanded={canStartBooking ? undefined : isSelecting}
        aria-label={toggleLabel}
        className={`fastbooking-member-toggle fastbooking-footer-toggle flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
          isSelecting || canStartBooking ? "fastbooking-member-toggle-open" : ""
        }`}
        data-mode={canStartBooking ? "booking" : "member-picker"}
        data-testid="fastbooking-member-selector-toggle"
        onClick={handleFooterAction}
        title={toggleLabel}
        type="button"
      >
        {canStartBooking ? (
          <ArrowRight aria-hidden="true" size={19} strokeWidth={2.6} />
        ) : (
          <Plus
            className={`fastbooking-plus-icon transition-transform duration-200 ease-[var(--taxis-motion-ease-standard)] ${
              isSelecting ? "fastbooking-plus-icon-open" : "rotate-0"
            }`}
            size={20}
            strokeWidth={2.5}
          />
        )}
      </button>
    </>
  );
}
