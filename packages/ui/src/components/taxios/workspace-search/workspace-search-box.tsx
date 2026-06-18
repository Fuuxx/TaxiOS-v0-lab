"use client";

import { ArrowUpRight, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type {
  WorkspaceSearchGroup,
  WorkspaceSearchResult,
  WorkspaceSearchState,
} from "../../../contracts/workspace-search";
import {
  type WorkspaceStatusTone,
  workspaceStatusChipClassForTone,
} from "../workspace/workspace-status";

export type WorkspaceSearchBoxProps = {
  allResultsLabel?: string;
  groups: readonly WorkspaceSearchGroup[];
  inputLabel?: string;
  onAllResultsSelect?: () => void;
  onQueryChange: (query: string) => void;
  onResultSelect?: (result: WorkspaceSearchResult) => void;
  placeholder?: string;
  query: string;
  state: WorkspaceSearchState;
};

type FlatSearchItem =
  | {
      kind: "result";
      result: WorkspaceSearchResult;
    }
  | {
      kind: "all";
    };

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

function toneClassName(tone: WorkspaceSearchResult["tone"]) {
  return workspaceStatusChipClassForTone(resultToneBySearchTone[tone]);
}

function flattenGroups(groups: readonly WorkspaceSearchGroup[]) {
  return groups.flatMap((group) => group.results).slice(0, 8);
}

export function WorkspaceSearchBox({
  allResultsLabel = "Alle Ergebnisse anzeigen",
  groups,
  inputLabel = "Workspace durchsuchen",
  onAllResultsSelect,
  onQueryChange,
  onResultSelect,
  placeholder = "Suchen...",
  query,
  state,
}: WorkspaceSearchBoxProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const results = useMemo(() => flattenGroups(groups), [groups]);
  const flatItems = useMemo<FlatSearchItem[]>(
    () =>
      query.trim().length >= 2
        ? [...results.map((result) => ({ kind: "result" as const, result })), { kind: "all" as const }]
        : [],
    [query, results],
  );
  const shouldOpen =
    isFocused &&
    (query.trim().length >= 2 || state === "loading" || state === "error");

  useEffect(() => {
    setActiveIndex(flatItems.length > 0 ? 0 : -1);
  }, [flatItems.length]);

  function selectItem(item: FlatSearchItem | undefined) {
    if (item === undefined) {
      return;
    }

    if (item.kind === "all") {
      onAllResultsSelect?.();
      return;
    }

    if (item.result.href !== null) {
      onResultSelect?.(item.result);
    }
  }

  return (
    <fieldset
      className="relative m-0 h-full w-full border-0 p-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocused(false);
        }
      }}
      onFocus={() => setIsFocused(true)}
    >
      <legend className="sr-only">{inputLabel}</legend>
      <Search
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-4 z-10 text-[var(--taxis-workspace-text-muted)] transition-colors duration-200 group-focus-within:text-[var(--taxis-workspace-accent-strong)]"
        size={18}
        strokeWidth={2}
      />
      <input
        aria-activedescendant={
          shouldOpen && activeIndex >= 0
            ? `workspace-search-option-${activeIndex}`
            : undefined
        }
        aria-autocomplete="list"
        aria-controls="workspace-search-panel"
        aria-expanded={shouldOpen}
        aria-haspopup="listbox"
        aria-label={inputLabel}
        className="taxis-workspace-topbar-search w-full rounded-2xl py-3.5 pr-6 pl-11 font-medium text-[14px] text-[var(--taxis-workspace-text-strong)] outline-none"
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.currentTarget.blur();
            setIsFocused(false);
            return;
          }

          if (flatItems.length === 0) {
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((current) => (current + 1) % flatItems.length);
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex(
              (current) => (current - 1 + flatItems.length) % flatItems.length,
            );
            return;
          }

          if (event.key === "Enter") {
            event.preventDefault();
            selectItem(flatItems[activeIndex]);
          }
        }}
        placeholder={placeholder}
        role="combobox"
        type="search"
        value={query}
      />

      {shouldOpen ? (
        <div
          className="taxis-overlay-panel absolute top-[calc(100%+0.65rem)] right-0 left-0 z-50 overflow-hidden rounded-[18px] border p-2"
          id="workspace-search-panel"
          ref={panelRef}
          role="listbox"
        >
          {state === "loading" ? (
            <div className="flex min-h-20 items-center gap-2 px-4 text-[13px] text-[var(--taxis-workspace-text-secondary)]">
              <Loader2 className="animate-spin" size={15} />
              Suche läuft...
            </div>
          ) : null}

          {state === "error" ? (
            <div className="min-h-20 px-4 py-5 text-[13px] text-[var(--taxis-status-danger-text)]">
              Suche gerade nicht verfügbar.
            </div>
          ) : null}

          {state === "empty" ? (
            <div className="min-h-20 px-4 py-5 text-[13px] text-[var(--taxis-workspace-text-secondary)]">
              Keine Treffer im aktiven Workspace.
            </div>
          ) : null}

          {state === "ready" ? (
            <div className="space-y-2">
              {groups.map((group) => (
                <div key={group.targetType}>
                  <div className="px-3 py-1 font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.16em]">
                    {group.label}
                  </div>
                  <div className="space-y-1">
                    {group.results.slice(0, 8).map((result) => {
                      const resultIndex = results.findIndex(
                        (candidate) => candidate.resultId === result.resultId,
                      );
                      const isActive = resultIndex === activeIndex;
                      const isDisabled = result.href === null;

                      const optionId = `workspace-search-option-${resultIndex}`;

                      return (
                        <button
                          aria-selected={isActive}
                          className={[
                            "flex w-full min-w-0 items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition-colors",
                            isActive
                              ? "bg-[var(--taxis-workspace-surface-soft)]"
                              : "hover:bg-[var(--taxis-workspace-surface-soft)]",
                            isDisabled ? "cursor-not-allowed opacity-55" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          disabled={isDisabled}
                          id={optionId}
                          key={result.resultId}
                          onMouseDown={(event) => event.preventDefault()}
                          onMouseEnter={() => setActiveIndex(resultIndex)}
                          onClick={() => selectItem({ kind: "result", result })}
                          role="option"
                          type="button"
                        >
                          <span
                            className={[
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-[10px] ring-1",
                              toneClassName(result.tone),
                            ].join(" ")}
                          >
                            {result.publicId?.slice(0, 3) ?? result.typeLabel.slice(0, 3)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex min-w-0 items-center gap-2">
                              <span className="truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-primary)]">
                                {result.title}
                              </span>
                              {result.publicId ? (
                                <span className="taxis-data-id shrink-0 font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)]">
                                  {result.publicId}
                                </span>
                              ) : null}
                            </span>
                            <span className="block truncate text-[12px] text-[var(--taxis-workspace-text-secondary)]">
                              {result.subtitle}
                            </span>
                          </span>
                          {result.statusLabel ? (
                            <span
                              className={[
                                "hidden shrink-0 items-center rounded-full px-2 py-1 font-semibold text-[10px] tracking-normal ring-1 sm:inline-flex",
                                workspaceStatusChipClassForTone("neutral"),
                              ].join(" ")}
                            >
                              {result.statusLabel}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {query.trim().length >= 2 ? (
            <button
              aria-selected={activeIndex === flatItems.length - 1}
              className={[
                "mt-2 flex w-full items-center justify-between rounded-[14px] border border-[var(--taxis-workspace-border)] px-3 py-2.5 font-semibold text-[12px] transition-colors",
                activeIndex === flatItems.length - 1
                  ? "bg-[var(--taxis-workspace-text-primary)] text-white"
                  : "bg-white text-[var(--taxis-workspace-text-primary)] hover:bg-[var(--taxis-workspace-surface-soft)]",
              ].join(" ")}
              id={`workspace-search-option-${flatItems.length - 1}`}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(flatItems.length - 1)}
              onClick={() => selectItem({ kind: "all" })}
              role="option"
              type="button"
            >
              <span>{allResultsLabel}</span>
              <ArrowUpRight size={15} strokeWidth={2.2} />
            </button>
          ) : null}
        </div>
      ) : null}
    </fieldset>
  );
}
