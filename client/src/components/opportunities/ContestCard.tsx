import { useRouter } from '@/lib/next-polyfills';


import { useState } from "react";
// import from next/navigation removed
import {
  Bookmark,
  Calendar,
  Users,
  Trophy,
  MapPin,
  ArrowRight,
  Flame,
} from "lucide-react";
import { Contest } from "@/types/contest";
import { cn } from "@/lib/utils";

interface ContestCardProps {
  contest: Contest;
  viewMode?: "grid" | "list";
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
  className?: string;
}

export function ContestCard({
  contest,
  viewMode = "grid",
  isBookmarked: externalBookmarked,
  onToggleBookmark,
  className,
}: ContestCardProps) {
  const router = useRouter();
  const [internalBookmarked, setInternalBookmarked] = useState(false);

  const isBookmarked =
    externalBookmarked !== undefined ? externalBookmarked : internalBookmarked;

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleBookmark) {
      onToggleBookmark(contest.id);
    } else {
      setInternalBookmarked((prev) => !prev);
    }
  };

  const handleCardClick = () => {
    router.push(`/contests/${contest.slug}`);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(`/contests/${contest.slug}`);
    }
  };

  const formattedDeadline = new Date(
    contest.registrationDeadline
  ).toLocaleDateString("en-IN", { month: "short", day: "numeric" });

  const formattedContestDate = new Date(contest.startDate).toLocaleDateString(
    "en-IN",
    { month: "short", day: "numeric" }
  );

  const getStatusColor = (status: string) => {
    if (status === "Closing Soon")
      return "bg-pink-soft text-pink border-pink/30";
    if (status === "Open")
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  /* =========================================================================
     LIST VIEW LAYOUT (Desktop horizontal, mobile compact stack)
     ========================================================================= */
  if (viewMode === "list") {
    return (
      <article
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
        aria-label={`View details for ${contest.title}`}
        className={cn(
          "group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-card",
          "transition-all duration-200 cursor-pointer",
          "hover:-translate-y-0.5 hover:border-cyan hover:shadow-hover",
          className
        )}
      >
        {/* Left: Indicator Icon + Primary Info */}
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="hidden xs:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-surface text-blue font-bold border border-blue/20">
            <Flame size={20} className="text-blue" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-bold leading-none",
                  getStatusColor(contest.status)
                )}
              >
                {contest.status}
              </span>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
                {contest.category}
              </span>

              <span className="rounded-full border border-border-light bg-background px-2 py-0.5 text-[10px] font-semibold text-blue">
                {contest.mode}
              </span>
            </div>

            <h3 className="text-base font-bold text-primary group-hover:text-blue transition-colors line-clamp-1">
              {contest.title}
            </h3>

            <p className="text-xs font-medium text-text-secondary mt-0.5 line-clamp-1">
              {contest.organizerName}
            </p>

            {/* List metadata row */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary">
              <div className="inline-flex items-center gap-1">
                <Trophy size={13} className="text-amber-500" />
                <span className="font-bold text-primary">{contest.prize}</span>
              </div>
              <div className="inline-flex items-center gap-1">
                <Calendar size={13} className="text-text-muted" />
                <span>Date: {formattedContestDate}</span>
              </div>
              <div className="inline-flex items-center gap-1">
                <Users size={13} className="text-text-muted" />
                <span>{contest.teamSize}</span>
              </div>
              {contest.location && (
                <div className="inline-flex items-center gap-1">
                  <MapPin size={13} className="text-text-muted" />
                  <span className="truncate max-w-[150px]">{contest.location}</span>
                </div>
              )}
            </div>

            {/* Tags preview */}
            {contest.tags && contest.tags.length > 0 && (
              <div className="mt-2.5 hidden sm:flex flex-wrap gap-1.5">
                {contest.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-background px-2 py-0.5 text-[10px] font-medium text-text-secondary border border-border-light"
                  >
                    #{tag}
                  </span>
                ))}
                {contest.tags.length > 4 && (
                  <span className="rounded-md bg-background px-1.5 py-0.5 text-[10px] font-medium text-text-muted border border-border-light">
                    +{contest.tags.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right / Bottom Action & Meta */}
        <div className="flex w-full sm:w-auto items-center justify-between sm:flex-col sm:items-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border-light shrink-0">
          <div className="flex sm:flex-col sm:items-end gap-2 sm:gap-0.5 text-right">
            <span
              className={cn(
                "text-xs font-bold",
                contest.isFree ? "text-emerald-600" : "text-primary"
              )}
            >
              {contest.entryFee}
            </span>
            <span className="text-[11px] font-medium text-text-muted">
              {contest.registeredCount.toLocaleString("en-IN")} registered
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBookmarkClick}
              aria-label={
                isBookmarked
                  ? `Remove ${contest.title} from bookmarks`
                  : `Save ${contest.title} to bookmarks`
              }
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl border transition-all",
                isBookmarked
                  ? "border-blue bg-blue-surface text-blue"
                  : "border-border bg-white text-text-muted hover:border-blue hover:text-blue"
              )}
            >
              <Bookmark
                size={16}
                className={cn(
                  "transition-transform active:scale-90",
                  isBookmarked ? "fill-blue" : ""
                )}
              />
            </button>

            <span className="inline-flex items-center gap-1 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white transition-colors group-hover:bg-blue">
              View
              <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </article>
    );
  }

  /* =========================================================================
     GRID VIEW LAYOUT (Default Multi-column card)
     ========================================================================= */
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      aria-label={`View details for ${contest.title}`}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-card",
        "transition-all duration-200 cursor-pointer h-full",
        "hover:-translate-y-1 hover:border-cyan hover:shadow-hover",
        className
      )}
    >
      <div>
        {/* Top Badges & Bookmark */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-bold leading-none",
                getStatusColor(contest.status)
              )}
            >
              {contest.status}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
              {contest.mode}
            </span>
          </div>

          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={
              isBookmarked
                ? `Remove ${contest.title} from bookmarks`
                : `Save ${contest.title} to bookmarks`
            }
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all",
              isBookmarked
                ? "border-blue bg-blue-surface text-blue"
                : "border-border bg-white text-text-muted hover:border-blue hover:text-blue"
            )}
          >
            <Bookmark
              size={15}
              className={cn(
                "transition-transform active:scale-90",
                isBookmarked ? "fill-blue" : ""
              )}
            />
          </button>
        </div>

        {/* Category Pill */}
        <span className="text-[11px] font-semibold text-blue uppercase tracking-wider block mb-1">
          {contest.category}
        </span>

        {/* Title */}
        <h3 className="text-base font-bold text-primary leading-snug group-hover:text-blue transition-colors line-clamp-2">
          {contest.title}
        </h3>

        {/* Host / Organizer */}
        <p className="mt-1 text-xs font-medium text-text-secondary line-clamp-1">
          {contest.organizerName}
        </p>

        {/* Prize Pool Highlight Box */}
        <div className="mt-3.5 flex items-center justify-between rounded-xl bg-background/80 border border-border-light p-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Trophy size={14} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                Prizes Worth
              </div>
              <div className="text-xs font-extrabold text-primary">
                {contest.prize}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Entry Fee
            </div>
            <div
              className={cn(
                "text-xs font-extrabold",
                contest.isFree ? "text-emerald-600" : "text-primary"
              )}
            >
              {contest.entryFee}
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="mt-3 space-y-1.5 text-xs text-text-secondary">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-text-muted shrink-0" />
            <span className="text-[11.5px]">
              Deadline:{" "}
              <strong className="text-primary font-semibold">
                {formattedDeadline}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users size={13} className="text-text-muted shrink-0" />
            <span className="text-[11.5px] truncate">
              Format: {contest.teamSize}
            </span>
          </div>

          {contest.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-text-muted shrink-0" />
              <span className="text-[11.5px] truncate">
                {contest.location}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {contest.tags && contest.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {contest.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-text-secondary border border-slate-200/80"
              >
                #{tag}
              </span>
            ))}
            {contest.tags.length > 3 && (
              <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-text-muted border border-slate-200/80">
                +{contest.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border-light flex items-center justify-between">
        <span className="text-[11px] font-semibold text-text-muted">
          {contest.registeredCount.toLocaleString("en-IN")} registered
        </span>

        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue group-hover:translate-x-0.5 transition-transform">
          View Details
          <ArrowRight size={13} />
        </span>
      </div>
    </article>
  );
}

