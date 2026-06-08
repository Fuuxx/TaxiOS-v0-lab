"use client";

/**
 * Dashboard-local Fastbooking floating members overlay — not a global member picker yet.
 * Parent owns query, selection, and open state; styling lives in `company-dashboard.css`.
 */

import { Check } from "lucide-react";

import type { CompanyDashboardFastbookingMember } from "./company-dashboard-fastbooking-types";

export type CompanyDashboardFastbookingMemberPickerProps = {
  bookLabel: string;
  committedMemberIds?: readonly string[];
  isOpen: boolean;
  membersLabel: string;
  noMembersFoundLabel: string;
  visibleMembers: CompanyDashboardFastbookingMember[];
  onConfirm: () => void;
  onToggleMember: (id: string) => void;
  /** When set, applied to root overlay (`fastbooking-floating-members`) for `aria-controls`. */
  overlayId?: string;
  selectedMemberIds: string[];
};

export function CompanyDashboardFastbookingMemberPicker({
  bookLabel,
  committedMemberIds = [],
  isOpen,
  membersLabel,
  noMembersFoundLabel,
  onConfirm,
  onToggleMember,
  overlayId,
  selectedMemberIds,
  visibleMembers,
}: CompanyDashboardFastbookingMemberPickerProps) {
  const selectedCount = selectedMemberIds.length;

  return (
    <div
      className={`fastbooking-floating-members absolute inset-x-0 top-0 z-40 flex flex-col ${
        isOpen ? "fastbooking-floating-members-open" : "fastbooking-floating-members-closed"
      }`}
      aria-hidden={!isOpen}
      id={overlayId}
    >
      <div className="fastbooking-floating-booking-row flex items-center justify-between gap-3 px-5 pt-5 pb-3">
        <span className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
          {membersLabel}
        </span>
        <button
          className={`fastbooking-booking-trigger shrink-0 rounded-[12px] px-3.5 py-2 font-semibold text-[10px] transition-colors ${
            selectedCount > 0
              ? "taxis-button-tone-default shadow-taxis-soft"
              : "cursor-not-allowed bg-[var(--taxis-workspace-surface-deep)] text-[var(--taxis-workspace-text-muted)]"
          }`}
          disabled={selectedCount === 0}
          onClick={onConfirm}
          tabIndex={isOpen ? 0 : -1}
          type="button"
        >
          {bookLabel} ({selectedCount})
        </button>
      </div>
      <div className="fastbooking-floating-members-scroll flex-1 space-y-1.5 overflow-y-auto px-4 pt-1 pb-3">
        {visibleMembers.map((member) => {
          const selected = selectedMemberIds.includes(member.id);
          const committed = committedMemberIds.includes(member.id);
          const highlighted = selected || committed;

          return (
            <button
              className={`fastbooking-member-chip taxios-dashboard-ease-standard flex w-full items-center justify-between rounded-[14px] border px-3 py-2.5 text-[11px] transition-colors duration-200 ${
                highlighted
                  ? "fastbooking-member-chip-selected border-[var(--taxis-workspace-accent-ring)] bg-[var(--taxis-workspace-accent-soft)] text-[var(--taxis-workspace-accent-strong)]"
                  : "border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)]/90 text-[var(--taxis-workspace-text-secondary)] hover:border-[var(--taxis-workspace-border-strong)] hover:bg-[var(--taxis-workspace-surface)]"
              }`}
              data-committed={committed}
              data-selected={selected}
              key={member.id}
              onClick={() => onToggleMember(member.id)}
              tabIndex={isOpen ? 0 : -1}
              type="button"
            >
              <span className="font-bold">{member.name}</span>
              {selected ? (
                <Check className="taxios-dashboard-animate-fade-rise" size={14} strokeWidth={3} />
              ) : null}
            </button>
          );
        })}
        {visibleMembers.length === 0 ? (
          <div className="rounded-[14px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)]/90 px-3 py-4 text-center font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_1px_2px_-1px_rgba(15,23,42,0.04)]">
            {noMembersFoundLabel}
          </div>
        ) : null}
      </div>
    </div>
  );
}
