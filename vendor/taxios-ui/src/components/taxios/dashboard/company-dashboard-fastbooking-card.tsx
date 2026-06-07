"use client";

/**
 * Dashboard-local Fastbooking route card; not exported from `@taxios-v2/ui` root.
 * Member picker UX lives inline per product spec; CSS lives in `company-dashboard.css`.
 */

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { UserPlus, Users } from "lucide-react";

import { CompanyDashboardFastbookingFooterMemberActions } from "./company-dashboard-fastbooking-footer-member-actions";
import { CompanyDashboardFastbookingMemberPicker } from "./company-dashboard-fastbooking-member-picker";
import { CompanyDashboardAvatar } from "./dashboard-avatar";
import type { CompanyDashboardCopy } from "../../../contracts/company-dashboard";
import type {
  CompanyDashboardFastRoute,
  CompanyDashboardFastRouteBookingStartHandler,
  CompanyDashboardFastRouteMemberChangeHandler,
  CompanyDashboardFastbookingMember,
} from "./company-dashboard-fastbooking-types";

type FastBookingCardProps = Omit<CompanyDashboardFastRoute, "memberIds"> & {
  availableMembers: CompanyDashboardFastbookingMember[];
  copy: CompanyDashboardCopy["fastbooking"];
  memberIds?: readonly string[];
  onBookingStart?: CompanyDashboardFastRouteBookingStartHandler;
  onRouteMembersChange?: CompanyDashboardFastRouteMemberChangeHandler;
  /** Storybook / demos only; defaults closed for production callers. */
  initialIsSelecting?: boolean;
  /** Storybook / demos only; seeds persisted members when no route payload exists. */
  initialSelectedMemberIds?: readonly string[];
  /** Storybook / demos only; seeded search query (filtered client-side only). */
  initialMemberQuery?: string;
};

type FastbookingRoutePointProps = {
  address: string;
  isEnd?: boolean;
  label: string;
};

type FastbookingPickerMode = "booking" | "edit_idle" | "add" | "remove";

function initialsFromMemberName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.at(0)?.toUpperCase() ?? "")
    .join("");
}

function FastbookingRoutePoint({
  address,
  isEnd = false,
  label,
}: FastbookingRoutePointProps) {
  return (
    <div
      className="fastbooking-route-entry relative"
      data-end={isEnd ? "true" : "false"}
    >
      <p className="mb-1 font-semibold text-taxis-eyebrow text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
        {label}
      </p>
      <div className="relative">
        <span aria-hidden="true" className="fastbooking-route-point" />
        <p className="truncate font-bold text-[14px] leading-snug text-[var(--taxis-workspace-text-strong)] transition-colors duration-300 group-hover:text-[var(--taxis-workspace-text-strong)]">
          {address}
        </p>
      </div>
    </div>
  );
}

export function FastBookingCard({
  avatars,
  availableMembers,
  copy,
  from,
  memberIds,
  onBookingStart,
  onRouteMembersChange,
  title,
  to,
  initialIsSelecting = false,
  initialSelectedMemberIds,
  initialMemberQuery,
}: FastBookingCardProps) {
  const memberPickerOverlayId = useId();
  const persistedMemberIds = useMemo(
    () => [...(memberIds ?? initialSelectedMemberIds ?? [])],
    [initialSelectedMemberIds, memberIds],
  );
  const [isSelecting, setIsSelecting] = useState(initialIsSelecting);
  const [pickerMode, setPickerMode] = useState<FastbookingPickerMode>("booking");
  const [memberQuery, setMemberQuery] = useState(initialMemberQuery ?? "");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedBookingMemberIds, setSelectedBookingMemberIds] = useState<string[]>(
    [],
  );
  const [footerMemberIds, setFooterMemberIds] = useState<string[]>(() => [
    ...persistedMemberIds,
  ]);
  const [draggedMemberId, setDraggedMemberId] = useState<string | null>(null);
  const draggedMemberIdRef = useRef<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const footerMemberIdSet = useMemo(() => new Set(footerMemberIds), [footerMemberIds]);
  const selectedBookingMemberIdSet = useMemo(
    () => new Set(selectedBookingMemberIds),
    [selectedBookingMemberIds],
  );
  const normalizedMemberQuery = memberQuery.trim().toLowerCase();
  const matchingMembers = [...availableMembers]
    .filter((member) =>
      member.name.toLowerCase().includes(normalizedMemberQuery),
    )
    .sort((firstMember, secondMember) =>
      firstMember.name.localeCompare(secondMember.name),
    );
  const addableMembers = matchingMembers.filter(
    (member) => !footerMemberIdSet.has(member.id),
  );
  const removableMembers = matchingMembers.filter((member) =>
    footerMemberIdSet.has(member.id),
  );
  const visibleMembers =
    pickerMode === "add"
      ? addableMembers
      : pickerMode === "remove"
        ? removableMembers
        : pickerMode === "edit_idle"
          ? [...addableMembers, ...removableMembers]
          : matchingMembers;
  const footerMembers = footerMemberIds
    .map((memberId) => availableMembers.find((member) => member.id === memberId))
    .filter((member): member is CompanyDashboardFastbookingMember => Boolean(member));
  const memberActionLabel =
    pickerMode === "booking"
      ? copy.bookLabel
      : pickerMode === "remove"
        ? copy.removeMemberLabel
        : copy.addMemberLabel;
  const committedPickerMemberIds =
    pickerMode === "booking" ? [] : footerMemberIds;

  const closeMemberPicker = () => {
    setIsSelecting(false);
    setMemberQuery("");
    setPickerMode("booking");
    setSelectedMembers([]);
  };

  const openRouteMemberPicker = () => {
    setPickerMode("edit_idle");
    setSelectedMembers([]);
    setMemberQuery("");
    setIsSelecting(true);
  };

  const openBookingMemberPicker = () => {
    setPickerMode("booking");
    setSelectedMembers([...selectedBookingMemberIds]);
    setMemberQuery("");
    setIsSelecting(true);
  };

  const toggleMemberPicker = () => {
    if (isSelecting) {
      closeMemberPicker();
      return;
    }

    openBookingMemberPicker();
  };

  const toggleMemberId = (ids: string[], id: string) => {
    if (ids.includes(id)) {
      return ids.filter((memberId) => memberId !== id);
    }

    return [...ids, id];
  };

  const toggleBookingMember = (id: string) => {
    setSelectedBookingMemberIds((previous) =>
      toggleMemberId(previous, id),
    );
  };

  const toggleMember = (id: string) => {
    setPickerMode((current) => {
      if (current === "booking" || current === "add" || current === "remove") {
        return current;
      }

      return footerMemberIdSet.has(id) ? "remove" : "add";
    });
    setSelectedMembers((previous) =>
      pickerMode === "booking"
        ? toggleMemberId(previous, id)
        : previous.includes(id)
          ? previous.filter((memberId) => memberId !== id)
          : [...previous, id],
    );
  };

  const startBooking = (memberIdsForBooking: readonly string[]) => {
    const nextMemberIds = [...memberIdsForBooking];

    if (nextMemberIds.length === 0) {
      return;
    }

    setSelectedBookingMemberIds([...nextMemberIds]);
    void onBookingStart?.({
      from,
      memberIds: [...nextMemberIds],
      title,
      to,
    });
    closeMemberPicker();
  };

  const persistFooterMemberIds = (nextFooterMemberIds: string[]) => {
    setFooterMemberIds(nextFooterMemberIds);
    void onRouteMembersChange?.({
      from,
      memberIds: nextFooterMemberIds,
      to,
    });
  };

  const moveFooterMemberBefore = (draggedId: string, targetId: string) => {
    if (draggedId === targetId) {
      return;
    }

    const nextFooterMemberIds = footerMemberIds.filter(
      (memberId) => memberId !== draggedId,
    );
    const targetIndex = nextFooterMemberIds.indexOf(targetId);

    if (targetIndex < 0 || nextFooterMemberIds.length === footerMemberIds.length) {
      return;
    }

    nextFooterMemberIds.splice(targetIndex, 0, draggedId);
    persistFooterMemberIds(nextFooterMemberIds);
  };

  const confirmMemberChange = () => {
    if (selectedMembers.length === 0) {
      return;
    }

    if (pickerMode === "booking") {
      startBooking(selectedMembers);
      return;
    }

    if (pickerMode === "edit_idle") {
      return;
    }

    const nextFooterMemberIds =
      pickerMode === "add"
        ? [
            ...footerMemberIds,
            ...selectedMembers.filter(
              (memberId) => !footerMemberIds.includes(memberId),
            ),
          ]
        : footerMemberIds.filter(
            (memberId) => !selectedMembers.includes(memberId),
          );

    persistFooterMemberIds(nextFooterMemberIds);
    closeMemberPicker();
  };

  useEffect(() => {
    setFooterMemberIds([...persistedMemberIds]);
  }, [persistedMemberIds]);

  useEffect(() => {
    if (!isSelecting) {
      return;
    }

    const hasInvalidSelection = selectedMembers.some((memberId) =>
      pickerMode === "add"
        ? footerMemberIds.includes(memberId)
        : pickerMode === "remove"
          ? !footerMemberIds.includes(memberId)
          : false,
    );

    if (!hasInvalidSelection) {
      return;
    }

    setSelectedMembers((previous) =>
      previous.filter((memberId) =>
        pickerMode === "add"
          ? !footerMemberIds.includes(memberId)
          : footerMemberIds.includes(memberId),
      ),
    );
  }, [footerMemberIds, isSelecting, pickerMode, selectedMembers]);

  useEffect(() => {
    if (!isSelecting) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 240);

    return () => window.clearTimeout(focusTimer);
  }, [isSelecting]);

  return (
    <div className="group relative flex h-[304px] min-w-0 flex-col">
      <div className="fastbooking-card-aura absolute inset-x-5 top-12 bottom-4 rounded-[28px]" />
      <div
        className={`fastbooking-porcelain-edge relative z-10 min-w-0 flex-1 rounded-[18px] text-left transition-colors duration-200 ${
          isSelecting ? "fastbooking-card-selecting" : ""
        }`}
        data-testid="fastbooking-card"
      >
        <div className="fastbooking-card-clip absolute inset-0 flex flex-col overflow-visible rounded-[18px]">
          <div className="fastbooking-card-underlight absolute inset-x-0 bottom-0 h-16 rounded-[999px]" />

          <div className="taxios-dashboard-ease-standard relative z-10 flex flex-1 flex-col gap-3 px-5 py-5 transition-opacity duration-500">
            <div className="fastbooking-route-copy flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="mb-1 font-medium text-taxis-eyebrow text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
                  {copy.cardEyebrow}
                </p>
                <h4 className="truncate font-semibold text-[19px] text-[var(--taxis-workspace-text-strong)] leading-tight tracking-tight transition-colors duration-200 group-hover:text-[var(--taxis-workspace-text-strong)]">
                  {title}
                </h4>
              </div>
              <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--taxis-workspace-surface-deep)] px-2.5 py-1 font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)] tracking-tight ring-1 ring-[var(--taxis-workspace-border)]">
                <Users
                  className="text-[var(--taxis-workspace-text-muted)]"
                  size={12}
                  strokeWidth={2.25}
                />
                {avatars.length}
              </span>
            </div>

            <div className="fastbooking-route-copy fastbooking-route-line relative my-auto space-y-7">
              <FastbookingRoutePoint address={from} label={copy.fromLabel} />
              <FastbookingRoutePoint address={to} isEnd label={copy.toLabel} />
            </div>
          </div>

          <CompanyDashboardFastbookingMemberPicker
            bookLabel={memberActionLabel}
            committedMemberIds={committedPickerMemberIds}
            isOpen={isSelecting}
            membersLabel={copy.membersLabel}
            noMembersFoundLabel={copy.noMembersFound}
            onConfirm={confirmMemberChange}
            onToggleMember={toggleMember}
            overlayId={memberPickerOverlayId}
            selectedMemberIds={selectedMembers}
            visibleMembers={visibleMembers}
          />

          <div className="taxios-dashboard-card-footer fastbooking-card-dock relative z-50 mt-auto h-[66px] rounded-b-[18px] px-5 py-3">
            {!isSelecting ? (
              <div className="fastbooking-card-dock-zone-avatars fastbooking-footer-people">
                <div className="fastbooking-avatar-stack flex items-center">
                  {avatars.map((avatar) => (
                    <span
                      className="fastbooking-avatar-button"
                      data-interactive="false"
                      key={`${title}-${avatar}`}
                    >
                      <CompanyDashboardAvatar
                        className="h-[38px] w-[38px] ring-2 ring-[var(--taxis-workspace-surface)]"
                        initials={avatar}
                        name={avatar}
                      />
                    </span>
                  ))}
                  {footerMembers.map((member) => (
                    <button
                      aria-label={`${member.name} ${copy.selectAvatarLabel}`}
                      aria-pressed={selectedBookingMemberIdSet.has(member.id)}
                      className="fastbooking-avatar-button"
                      data-active={
                        draggedMemberId === member.id ? "true" : "false"
                      }
                      data-selected={
                        selectedBookingMemberIdSet.has(member.id)
                          ? "true"
                          : "false"
                      }
                      draggable={footerMembers.length > 1}
                      key={`${title}-${member.id}`}
                      onClick={() => toggleBookingMember(member.id)}
                      onDragEnd={() => {
                        draggedMemberIdRef.current = null;
                        setDraggedMemberId(null);
                      }}
                      onDragOver={(event) => {
                        const currentDraggedMemberId =
                          draggedMemberIdRef.current ?? draggedMemberId;

                        if (
                          currentDraggedMemberId === null ||
                          currentDraggedMemberId === member.id
                        ) {
                          return;
                        }

                        event.preventDefault();
                      }}
                      onDragStart={(event) => {
                        event.dataTransfer?.setData("text/plain", member.id);
                        if (event.dataTransfer) {
                          event.dataTransfer.effectAllowed = "move";
                        }
                        draggedMemberIdRef.current = member.id;
                        setDraggedMemberId(member.id);
                      }}
                      onDrop={(event) => {
                        const droppedMemberId =
                          draggedMemberIdRef.current ||
                          draggedMemberId ||
                          event.dataTransfer?.getData("text/plain");

                        if (!droppedMemberId) {
                          return;
                        }

                        event.preventDefault();
                        moveFooterMemberBefore(droppedMemberId, member.id);
                        draggedMemberIdRef.current = null;
                        setDraggedMemberId(null);
                      }}
                      type="button"
                    >
                      <CompanyDashboardAvatar
                        className="h-[38px] w-[38px] ring-2 ring-[var(--taxis-workspace-surface)]"
                        initials={initialsFromMemberName(member.name)}
                        name={member.name}
                      />
                    </button>
                  ))}
                  <button
                    aria-label={copy.addMemberLabel}
                    className="fastbooking-avatar-button fastbooking-avatar-add-button"
                    data-active="false"
                    onClick={openRouteMemberPicker}
                    type="button"
                  >
                    <span className="taxios-avatar fastbooking-avatar-add-circle h-[38px] w-[38px] ring-2 ring-[var(--taxis-workspace-surface)]">
                      <UserPlus aria-hidden="true" size={17} strokeWidth={2.35} />
                    </span>
                  </button>
                </div>
              </div>
            ) : null}
            <div className="fastbooking-card-dock-zone-actions">
              <CompanyDashboardFastbookingFooterMemberActions
                bookingLabel={copy.bookLabel}
                bookingSelectedCount={selectedBookingMemberIds.length}
                closeLabel={copy.closeMemberPickerLabel}
                isSelecting={isSelecting}
                memberPickerOverlayId={memberPickerOverlayId}
                memberQuery={memberQuery}
                onBookingStart={() => startBooking(selectedBookingMemberIds)}
                onMemberQueryChange={setMemberQuery}
                onToggleSelecting={toggleMemberPicker}
                openLabel={copy.openMemberPickerLabel}
                searchInputRef={searchInputRef}
                searchLabel={copy.searchMembersLabel}
                searchPlaceholder={copy.searchPlaceholder}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
