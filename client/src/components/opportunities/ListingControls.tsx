

import { LayoutGrid, List, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { CompetitionSortOption } from "@/types/competition";
import { cn } from "@/lib/utils";

interface ListingControlsProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  sortBy: CompetitionSortOption;
  onSortChange: (sort: CompetitionSortOption) => void;
  totalResults: number;
  itemLabel?: string;
  className?: string;
}

const SORT_OPTIONS: { value: CompetitionSortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "deadline_soon", label: "Deadline: Soonest" },
  { value: "deadline_later", label: "Deadline: Furthest" },
  { value: "most_registered", label: "Most Registered" },
  { value: "alphabetical", label: "Alphabetical (A - Z)" },
];

export function ListingControls({
  viewMode,
  onViewModeChange,
  onOpenFilterDrawer,
  activeFilterCount,
  sortBy,
  onSortChange,
  totalResults,
  itemLabel = "Competition",
  className,
}: ListingControlsProps) {
  const pluralLabel = itemLabel.endsWith("s") ? itemLabel : `${itemLabel}s`;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 py-3 border-b border-border bg-transparent",
        className
      )}
    >
      {/* Left: Results Count */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-primary">
          {totalResults} {totalResults === 1 ? itemLabel : pluralLabel}
        </span>
        {activeFilterCount > 0 && (
          <span className="text-xs font-medium text-text-muted">
            (filtered)
          </span>
        )}
      </div>

      {/* Right: Controls (Filters, Sort, Grid/List) */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Filter Toggle Button */}
        <button
          type="button"
          onClick={onOpenFilterDrawer}
          className={cn(
            "relative inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-blue",
            activeFilterCount > 0
              ? "border-blue bg-blue-surface text-blue"
              : "border-border bg-white text-primary hover:border-blue hover:bg-slate-50"
          )}
          aria-label={`Open filters. ${activeFilterCount} active.`}
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue px-1 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort Select */}
        <div className="relative inline-flex items-center">
          <label htmlFor="sort-select" className="sr-only">
            Sort opportunities
          </label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3 text-text-muted">
              <ArrowUpDown size={13} />
            </span>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as CompetitionSortOption)}
              className="h-9 rounded-xl border border-border bg-white pl-8 pr-7 text-xs font-semibold text-primary shadow-sm transition-colors hover:border-blue focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue cursor-pointer appearance-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <span className="pointer-events-none absolute right-2.5 text-text-muted text-[10px]">
              ▼
            </span>
          </div>
        </div>

        {/* View Mode Switcher (Grid / List) */}
        <div
          role="group"
          aria-label="View presentation style"
          className="inline-flex rounded-xl border border-border bg-white p-0.5 shadow-sm"
        >
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            aria-pressed={viewMode === "grid"}
            aria-label="Grid view"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-all",
              viewMode === "grid"
                ? "bg-primary text-white shadow-xs"
                : "hover:text-primary hover:bg-background"
            )}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            aria-pressed={viewMode === "list"}
            aria-label="List view"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-all",
              viewMode === "list"
                ? "bg-primary text-white shadow-xs"
                : "hover:text-primary hover:bg-background"
            )}
          >
            <List size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
