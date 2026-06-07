"use client";

import type React from "react";
import { useState } from "react";
import { Plus } from "lucide-react";

import {
  FastbookingRouteForm,
  type FastbookingRouteFormData,
} from "../fastbooking-route-form";
import type { CompanyDashboardCopy } from "../../../contracts/company-dashboard";
import { cn } from "../../../lib/utils";

import { FastBookingCard } from "./company-dashboard-fastbooking-card";
import type {
  CompanyDashboardFastRouteBookingStartHandler,
  CompanyDashboardFastRouteMemberChangeHandler,
  CompanyDashboardFastbookingMember,
  CompanyDashboardFastRoute,
} from "./company-dashboard-fastbooking-types";
import { TaxiosDashboardSectionHeader } from "./taxios-dashboard-primitives";

/** Re-exported for callers that already import dashboard types from the Fastbooking orchestrator. */
export type {
  CompanyDashboardFastbookingMember,
  CompanyDashboardFastRoute,
} from "./company-dashboard-fastbooking-types";

export type CompanyDashboardFastbookingClientProps = {
  availableMembers: CompanyDashboardFastbookingMember[];
  copy: CompanyDashboardCopy["fastbooking"];
  fastRoutes: CompanyDashboardFastRoute[];
  onFastRouteBookingStart?: CompanyDashboardFastRouteBookingStartHandler;
  onFastRouteMembersChange?: CompanyDashboardFastRouteMemberChangeHandler;
};

export type FastBookingGridProps = {
  availableMembers: CompanyDashboardFastbookingMember[];
  className?: string;
  copy: CompanyDashboardCopy["fastbooking"];
  fastRoutes: readonly CompanyDashboardFastRoute[];
  onFastRouteBookingStart?: CompanyDashboardFastRouteBookingStartHandler;
  onFastRouteMembersChange?: CompanyDashboardFastRouteMemberChangeHandler;
};

export function FastBookingGrid({
  availableMembers,
  className,
  copy,
  fastRoutes,
  onFastRouteBookingStart,
  onFastRouteMembersChange,
}: FastBookingGridProps) {
  return (
    <div
      className={cn(
        "fastbooking-cards-pane grid min-w-0 grid-cols-1 gap-8",
        className,
      )}
    >
      {fastRoutes.length === 0 ? (
        <div className="fastbooking-empty-state rounded-[22px] px-6 py-8">
          <p className="font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)] tracking-tight">
            {copy.emptyTitle}
          </p>
          <p className="mt-2 max-w-md font-medium text-taxis-body-sm text-[var(--taxis-workspace-text-muted)] leading-relaxed">
            {copy.emptyDescription}
          </p>
        </div>
      ) : (
        fastRoutes.map((route) => (
          <FastBookingCard
            availableMembers={availableMembers}
            avatars={route.avatars}
            copy={copy}
            from={route.from}
            key={`${route.title}-${route.from}-${route.to}`}
            memberIds={route.memberIds}
            onBookingStart={onFastRouteBookingStart}
            onRouteMembersChange={onFastRouteMembersChange}
            title={route.title}
            to={route.to}
          />
        ))
      )}
    </div>
  );
}

export const CompanyDashboardFastbookingClient: React.FC<
  CompanyDashboardFastbookingClientProps
> = ({
  availableMembers,
  copy,
  fastRoutes,
  onFastRouteBookingStart,
  onFastRouteMembersChange,
}) => {
  const [isAddingFastbooking, setIsAddingFastbooking] = useState(false);

  const saveFastbooking = (_data: FastbookingRouteFormData) => {
    setIsAddingFastbooking(false);
  };

  return (
    <>
      <TaxiosDashboardSectionHeader
        action={
          <button
            aria-label={copy.newRouteAriaLabel}
            className={`fastbooking-add-route-toggle fastbooking-member-toggle flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
              isAddingFastbooking ? "fastbooking-member-toggle-open" : ""
            }`}
            onClick={() => setIsAddingFastbooking((current) => !current)}
            type="button"
          >
            <Plus
              className={`fastbooking-plus-icon transition-transform duration-200 ease-[var(--taxis-motion-ease-standard)] ${
                isAddingFastbooking ? "fastbooking-plus-icon-open" : "rotate-0"
              }`}
              size={24}
              strokeWidth={2.6}
            />
          </button>
        }
        className="mb-5 px-1"
        title={copy.title}
      />
      <div className="fastbooking-add-stage relative min-w-0 flex-1">
        <FastBookingGrid
          availableMembers={availableMembers}
          className={`fastbooking-add-pane ${
            isAddingFastbooking
              ? "fastbooking-pane-exit-left"
              : "fastbooking-pane-active"
          }`}
          copy={copy}
          fastRoutes={fastRoutes}
          onFastRouteBookingStart={onFastRouteBookingStart}
          onFastRouteMembersChange={onFastRouteMembersChange}
        />
        <div
          className={`fastbooking-add-pane fastbooking-form-pane absolute inset-0 ${
            isAddingFastbooking
              ? "fastbooking-pane-active"
              : "fastbooking-pane-enter-right"
          }`}
        >
          <FastbookingRouteForm
            destinationLabel={copy.destinationLabel}
            destinationPlaceholder={copy.destinationPlaceholder}
            eyebrow={copy.eyebrow}
            heading={copy.newRouteHeading}
            onSave={saveFastbooking}
            pickupLabel={copy.pickupLabel}
            pickupPlaceholder={copy.pickupPlaceholder}
            routeTitleLabel={copy.routeTitleLabel}
            routeTitlePlaceholder={copy.routeTitlePlaceholder}
            saveLabel={copy.saveLabel}
          />
        </div>
      </div>
    </>
  );
};
