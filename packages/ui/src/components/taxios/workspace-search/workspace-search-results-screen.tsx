"use client";

import { ArrowUpRight, Loader2 } from "lucide-react";

import type {
  WorkspaceSearchResult,
  WorkspaceSearchTargetType,
} from "../../../contracts/workspace-search";
import { WorkspaceSurface } from "../workspace/workspace-primitives";
import {
  type WorkspaceStatusTone,
  workspaceChipClassForTone,
  workspaceStatusChipClassForTone,
} from "../workspace/workspace-status";

export type WorkspaceSearchResultsScreenProps = {
  canLoadMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onResultSelect: (result: WorkspaceSearchResult) => void;
  onTargetTypeChange: (targetType: WorkspaceSearchTargetType | null) => void;
  query: string;
  results: readonly WorkspaceSearchResult[];
  selectedTargetType: WorkspaceSearchTargetType | null;
};

const filterOptions: Array<{
  label: string;
  targetType: WorkspaceSearchTargetType | null;
}> = [
  { label: "Alle", targetType: null },
  { label: "Buchungen", targetType: "booking" },
  { label: "Fahrzeuge", targetType: "vehicle" },
  { label: "Mitglieder", targetType: "member" },
  { label: "Fahrer", targetType: "driver" },
  { label: "Standorte", targetType: "unit" },
  { label: "Einladungen", targetType: "invite" },
  { label: "Rechnungen", targetType: "invoice" },
  { label: "Audit", targetType: "audit" },
];

const resultToneBySearchTone: Record<
  WorkspaceSearchResult["tone"],
  WorkspaceStatusTone
> = {
  blue: "info",
  green: "success",
  grey: "neutral",
  navy: "strong",
  orange: "accent",
  red: "danger",
};

function resultToneClassName(tone: WorkspaceSearchResult["tone"]) {
  return workspaceStatusChipClassForTone(resultToneBySearchTone[tone]);
}

export function WorkspaceSearchResultsScreen({
  canLoadMore,
  isLoadingMore,
  onLoadMore,
  onResultSelect,
  onTargetTypeChange,
  query,
  results,
  selectedTargetType,
}: WorkspaceSearchResultsScreenProps) {
  const normalizedQuery = query.trim();

  return (
    <section className="taxis-company-workspace-frame space-y-7">
      <div className="space-y-2">
        <p className="font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.22em]">
          Workspace Search
        </p>
        <h1 className="font-bold text-[34px] text-[var(--taxis-workspace-text-primary)] tracking-tight">
          Suche
        </h1>
        <p className="max-w-3xl text-[15px] text-[var(--taxis-workspace-text-secondary)]">
          Ergebnisse aus dem aktiven Workspace, gefiltert nach deinen Rechten.
        </p>
      </div>

      <WorkspaceSurface className="taxis-search-results-panel overflow-hidden rounded-[32px] p-0">
        <div className="taxis-search-results-header grid gap-5 px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                Ergebnisraum
              </p>
              <h2 className="mt-1 font-bold text-[22px] text-[var(--taxis-workspace-text-primary)] tracking-tight">
                {normalizedQuery.length > 0
                  ? `Ergebnisse für "${normalizedQuery}"`
                  : "Suchbegriff eingeben"}
              </h2>
            </div>
            <div className={workspaceChipClassForTone("neutral")}>
              {results.length} Treffer geladen
            </div>
          </div>

          <div className="taxis-search-filter-row flex max-w-full flex-wrap gap-2">
            {filterOptions.map((option) => {
              const isSelected = selectedTargetType === option.targetType;

              return (
                <button
                  className={[
                    "taxis-search-filter rounded-full border px-3 py-1.5 font-semibold text-[12px] transition-colors",
                    isSelected ? "taxis-search-filter-active" : "",
                  ].join(" ")}
                  key={option.label}
                  onClick={() => onTargetTypeChange(option.targetType)}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 pt-5 pb-4 sm:px-5 sm:pb-5">
          <div className="taxis-search-results-list space-y-2.5">
            {results.length === 0 ? (
              <div className="taxis-search-empty-state rounded-[20px] border px-5 py-8 text-[14px] text-[var(--taxis-workspace-text-secondary)]">
                Keine Treffer für diese Suche.
              </div>
            ) : null}

            {results.map((result) => {
              const isDisabled = result.href === null;

              return (
                <button
                  className={[
                    "taxis-search-result-row flex w-full min-w-0 items-center gap-4 rounded-[20px] border px-4 py-3.5 text-left transition",
                    isDisabled ? "cursor-not-allowed opacity-60" : "hover:-translate-y-px",
                  ].join(" ")}
                  disabled={isDisabled}
                  key={result.resultId}
                  onClick={() => onResultSelect(result)}
                  type="button"
                >
                  <span
                    className={[
                      "taxis-search-result-avatar flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold text-[11px] ring-1",
                      resultToneClassName(result.tone),
                    ].join(" ")}
                  >
                    {result.publicId?.slice(0, 3) ?? result.typeLabel.slice(0, 3)}
                  </span>
                  <span className="grid min-w-0 flex-1 gap-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-[14px] text-[var(--taxis-workspace-text-primary)]">
                        {result.title}
                      </span>
                      {result.publicId ? (
                        <span className="taxis-data-id font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)]">
                          {result.publicId}
                        </span>
                      ) : null}
                    </span>
                    <span className="block truncate text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                      {result.subtitle}
                    </span>
                    {result.meta.length > 0 ? (
                      <span className="mt-1 flex flex-wrap gap-1.5">
                        {result.meta.slice(0, 3).map((meta) => (
                          <span
                            className="rounded-full border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface-soft)]/72 px-2 py-1 font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)]"
                            key={meta}
                          >
                            {meta}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </span>
                  {result.statusLabel ? (
                    <span
                      className={[
                        "hidden min-h-7 shrink-0 items-center rounded-full px-3 font-semibold text-[11px] tracking-normal ring-1 md:inline-flex",
                        workspaceStatusChipClassForTone("neutral"),
                      ].join(" ")}
                    >
                      {result.statusLabel}
                    </span>
                  ) : null}
                  {!isDisabled ? <ArrowUpRight className="shrink-0 text-[var(--taxis-workspace-text-muted)]" size={16} /> : null}
                </button>
              );
            })}
          </div>
        </div>

        {canLoadMore ? (
          <button
            className="mx-auto mb-5 flex items-center gap-2 rounded-full border border-[var(--taxis-workspace-border)] bg-white px-4 py-2 font-semibold text-[13px] text-[var(--taxis-workspace-text-primary)] transition-colors hover:bg-[var(--taxis-workspace-surface-soft)] disabled:opacity-60"
            disabled={isLoadingMore}
            onClick={onLoadMore}
            type="button"
          >
            {isLoadingMore ? <Loader2 className="animate-spin" size={15} /> : null}
            {isLoadingMore ? "Wird geladen..." : "Mehr laden"}
          </button>
        ) : null}
      </WorkspaceSurface>
    </section>
  );
}
