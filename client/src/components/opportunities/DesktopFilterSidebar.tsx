

import { RotateCcw, Check, Filter } from "lucide-react";
import { CompetitionFilterState } from "@/types/competition";
import { CompetitionFilterMetadata } from "@/lib/services/competitionService";
import { cn } from "@/lib/utils";

interface DesktopFilterSidebarProps {
  filters: CompetitionFilterState;
  onFilterChange: (filters: CompetitionFilterState) => void;
  onClearFilters: () => void;
  metadata: CompetitionFilterMetadata;
  activeFilterCount: number;
  className?: string;
}

export function DesktopFilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  metadata,
  activeFilterCount,
  className,
}: DesktopFilterSidebarProps) {
  return (
    <aside
      aria-label="Desktop Filters"
      className={cn(
        "hidden lg:block w-64 shrink-0 rounded-2xl border border-border bg-white p-5 shadow-card self-start sticky top-28",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-primary" />
          <h3 className="text-sm font-bold text-primary">Filters</h3>
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue hover:underline"
          >
            <RotateCcw size={11} />
            Reset
          </button>
        )}
      </div>

      <div className="mt-4 space-y-5">
        {/* Entry Fee (Free vs Paid) */}
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Entry Fee
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { value: "all", label: "All" },
              { value: "free", label: "Free" },
              { value: "paid", label: "Paid" },
            ].map((fee) => (
              <button
                key={fee.value}
                type="button"
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    feeType: fee.value as "all" | "free" | "paid",
                  })
                }
                className={cn(
                  "rounded-lg border py-1.5 text-center text-xs font-semibold transition-all",
                  filters.feeType === fee.value
                    ? "border-blue bg-blue text-white shadow-xs"
                    : "border-border bg-white text-text-secondary hover:border-slate-300 hover:text-primary"
                )}
              >
                {fee.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mode */}
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Mode
          </span>
          <div className="flex flex-wrap gap-1.5">
            {["All", ...metadata.modes].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onFilterChange({ ...filters, mode })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
                  filters.mode === mode
                    ? "border-blue bg-blue-surface text-blue font-bold"
                    : "border-border bg-white text-text-secondary hover:border-slate-300"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Status
          </span>
          <div className="flex flex-wrap gap-1.5">
            {["All", "Open", "Closing Soon"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onFilterChange({ ...filters, status: st })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
                  filters.status === st
                    ? "border-blue bg-blue-surface text-blue font-bold"
                    : "border-border bg-white text-text-secondary hover:border-slate-300"
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Category
          </span>
          <div className="max-h-44 overflow-y-auto space-y-1 pr-1 scrollbar-none">
            {["All", ...metadata.categories].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onFilterChange({ ...filters, category: cat })}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                  filters.category === cat
                    ? "bg-primary text-white font-semibold"
                    : "text-text-secondary hover:bg-background hover:text-primary"
                )}
              >
                <span className="truncate">{cat}</span>
                {filters.category === cat && <Check size={12} className="text-cyan shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Eligibility */}
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Eligibility
          </span>
          <div className="space-y-1">
            {["All", ...metadata.eligibilities].map((elig) => (
              <button
                key={elig}
                type="button"
                onClick={() => onFilterChange({ ...filters, eligibility: elig })}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                  filters.eligibility === elig
                    ? "bg-primary text-white font-semibold"
                    : "text-text-secondary hover:bg-background hover:text-primary"
                )}
              >
                <span className="truncate">{elig}</span>
                {filters.eligibility === elig && <Check size={12} className="text-cyan shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
