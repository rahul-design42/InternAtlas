

import { useEffect, useCallback } from "react";
import { X, RotateCcw, Check } from "lucide-react";
import { CompetitionFilterState } from "@/types/competition";
import { CompetitionFilterMetadata } from "@/lib/services/competitionService";
import { cn } from "@/lib/utils";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CompetitionFilterState;
  onFilterChange: (filters: CompetitionFilterState) => void;
  onClearFilters: () => void;
  metadata: CompetitionFilterMetadata;
  totalFilteredCount: number;
}

export function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  metadata,
  totalFilteredCount,
}: FilterDrawerProps) {
  // Handle Escape key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filter competitions"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-primary/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside
          className={cn(
            "flex w-screen max-w-[400px] flex-col bg-white shadow-2xl transition-transform duration-300 motion-reduce:transition-none",
            "h-[100dvh]"
          )}
          style={{ width: "min(90vw, 400px)" }}
        >
          {/* Header */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-primary">Filters</h2>
              <span className="rounded-full bg-blue-surface px-2.5 py-0.5 text-xs font-semibold text-blue">
                {totalFilteredCount} matching
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filter drawer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-background hover:text-primary transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Filter Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
            {/* Entry Fee (Free vs Paid) */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Entry Fee
              </label>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {[
                  { value: "all", label: "All" },
                  { value: "free", label: "Free (₹0)" },
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
                      "flex items-center justify-center rounded-xl border py-2 text-xs font-semibold transition-all",
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

            {/* Mode (Online / Offline / Hybrid) */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Participation Mode
              </label>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {["All", ...metadata.modes].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, mode })}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                      filters.mode === mode
                        ? "border-blue bg-blue-surface text-blue font-semibold"
                        : "border-border bg-white text-text-secondary hover:border-slate-300"
                    )}
                  >
                    {filters.mode === mode && <Check size={12} />}
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Category
              </label>
              <div className="mt-2.5 space-y-1.5">
                {["All", ...metadata.categories].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, category: cat })}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-all",
                      filters.category === cat
                        ? "bg-primary text-white font-semibold"
                        : "text-text-secondary hover:bg-background hover:text-primary"
                    )}
                  >
                    <span>{cat}</span>
                    {filters.category === cat && <Check size={14} className="text-cyan" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Status (Open / Closing Soon) */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Registration Status
              </label>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {["All", "Open", "Closing Soon"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, status: st })}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                      filters.status === st
                        ? "border-blue bg-blue-surface text-blue font-semibold"
                        : "border-border bg-white text-text-secondary hover:border-slate-300"
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Eligibility
              </label>
              <div className="mt-2.5 space-y-1.5">
                {["All", ...metadata.eligibilities].map((elig) => (
                  <button
                    key={elig}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, eligibility: elig })}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-all",
                      filters.eligibility === elig
                        ? "bg-primary text-white font-semibold"
                        : "text-text-secondary hover:bg-background hover:text-primary"
                    )}
                  >
                    <span>{elig}</span>
                    {filters.eligibility === elig && <Check size={14} className="text-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Actions Footer */}
          <div className="sticky bottom-0 border-t border-border bg-white px-5 py-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onClearFilters}
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border text-xs font-semibold text-text-secondary hover:bg-background hover:text-primary transition-colors"
            >
              <RotateCcw size={13} />
              Clear All
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 flex-1 items-center justify-center rounded-xl bg-blue text-xs font-bold text-white shadow-sm hover:bg-blue-hover transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
