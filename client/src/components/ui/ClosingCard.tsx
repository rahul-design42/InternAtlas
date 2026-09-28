import { MapPin, CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/lib/types";

interface ClosingCardProps {
  opportunity: Opportunity;
  className?: string;
}

function deadlineBadgeClasses(daysLeft: number): string {
  if (daysLeft <= 2) return "bg-red-100    text-red-600";
  if (daysLeft <= 4) return "bg-orange-100 text-orange-600";
  if (daysLeft <= 6) return "bg-yellow-100 text-yellow-700";
  return                    "bg-green-100  text-green-700";
}

export function ClosingCard({ opportunity, className }: ClosingCardProps) {
  const { title, organization, location, compensation, applyBy, daysLeft } = opportunity;
  const days = daysLeft ?? 0;
  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-border bg-white shadow-card",
        "transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:border-cyan-light hover:shadow-hover focus-within:ring-2 focus-within:ring-blue focus-within:ring-offset-2",
        className
      )}
      tabIndex={0}
      aria-label={`${title} at ${organization} — ${days} days left`}
    >
      <div className="p-5 pb-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[14px] font-bold leading-snug text-primary truncate">{title}</h3>
            <p className="mt-0.5 text-[12.5px] font-medium text-text-secondary">{organization}</p>
          </div>
          <span className={cn("flex-shrink-0 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide", deadlineBadgeClasses(days))}>
            {days} DAYS LEFT
          </span>
        </div>
        <div className="flex flex-col gap-1.5 border-t border-border-light pt-3">
          <span className="inline-flex items-center gap-1.5 text-[12px] text-text-secondary">
            <MapPin size={11} className="flex-shrink-0 text-text-muted" />{location}
          </span>
          {compensation ? (
            <span className="text-[12.5px] font-semibold text-blue">{compensation}</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-text-secondary">
              <CalendarDays size={11} className="flex-shrink-0 text-text-muted" />Apply by {applyBy}
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-end p-3 pt-0">
        <Button variant="icon" size="icon-sm" aria-label={`View ${title} at ${organization}`} tabIndex={-1}>
          <ArrowRight size={13} />
        </Button>
      </div>
    </article>
  );
}
