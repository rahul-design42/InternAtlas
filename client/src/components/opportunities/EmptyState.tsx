

import { SearchX, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  className?: string;
}

export function EmptyState({
  title = "No competitions found",
  description = "Try adjusting your search criteria or resetting some of your active filters.",
  onClearFilters,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-8 sm:p-12 text-center shadow-xs",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-surface text-blue mb-4">
        <SearchX size={26} strokeWidth={2} />
      </div>

      <h3 className="text-lg font-bold text-primary">{title}</h3>

      <p className="mt-1.5 max-w-md text-xs sm:text-sm text-text-secondary">
        {description}
      </p>

      {onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue transition-colors focus-visible:ring-2 focus-visible:ring-blue"
        >
          <RotateCcw size={13} />
          Clear All Filters
        </button>
      )}
    </div>
  );
}
