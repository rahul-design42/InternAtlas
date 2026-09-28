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
  Code2,
} from "lucide-react";
import { Hackathon } from "@/types/hackathon";
import { cn } from "@/lib/utils";

interface HackathonCardProps {
  hackathon: Hackathon;
  viewMode?: "grid" | "list";
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
  className?: string;
}

export function HackathonCard({
  hackathon,
  viewMode = "grid",
  isBookmarked: externalBookmarked,
  onToggleBookmark,
  className,
}: HackathonCardProps) {
  const router = useRouter();
  const [internalBookmarked, setInternalBookmarked] = useState(false);

  const isBookmarked =
    externalBookmarked !== undefined ? externalBookmarked : internalBookmarked;

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleBookmark) {
      onToggleBookmark(hackathon.id);
    } else {
      setInternalBookmarked((prev) => !prev);
    }
  };

  const handleCardClick = () => {
    router.push(`/hackathons/${hackathon.slug}`);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(`/hackathons/${hackathon.slug}`);
    }
  };

  const formattedDeadline = new Date(
    hackathon.registrationDeadline
  ).toLocaleDateString("en-IN", { month: "short", day: "numeric" });

  const formattedDates = `${new Date(hackathon.startDate).toLocaleDateString(
    "en-IN",
    { month: "short", day: "numeric" }
  )} – ${new Date(hackathon.endDate).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  })}`;

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
        aria-label={`View details for ${hackathon.title}`}
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
            <Code2 size={20} className="text-blue" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-bold leading-none",
                  getStatusColor(hackathon.status)
                )}
              >
                {hackathon.status}
              </span>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
                {hackathon.category}
              </span>

              <span className="rounded-full border border-border-light bg-background px-2 py-0.5 text-[10px] font-semibold text-blue">
                {hackathon.mode}
              </span>
            </div>

            <h3 className="text-base font-bold text-primary group-hover:text-blue transition-colors line-clamp-1">
              {hackathon.title}
            </h3>

            <p className="text-xs font-medium text-text-secondary mt-0.5 line-clamp-1">
              {hackathon.organizerName}
            </p>

            {/* List metadata row */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary">
              <div className="inline-flex items-center gap-1">
                <Trophy size={13} className="text-amber-500" />
                <span className="font-bold text-primary">{hackathon.prize}</span>
              </div>
              <div className="inline-flex items-center gap-1">
                <Calendar size={13} className="text-text-muted" />
                <span>Runs: {formattedDates}</span>
              </div>
              <div className="inline-flex items-center gap-1">
                <Users size={13} className="text-text-muted" />
                <span>{hackathon.teamSize}</span>
              </div>
              {hackathon.location && (
                <div className="inline-flex items-center gap-1">
                  <MapPin size={13} className="text-text-muted" />
                  <span className="truncate max-w-[150px]">{hackathon.location}</span>
                </div>
              )}
            </div>

            {/* Tech stack tags */}
            {hackathon.technologies && hackathon.technologies.length > 0 && (
              <div className="mt-2.5 hidden sm:flex flex-wrap gap-1.5">
                {hackathon.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-background px-2 py-0.5 text-[10px] font-medium text-text-secondary border border-border-light"
                  >
                    {tech}
                  </span>
                ))}
                {hackathon.technologies.length > 4 && (
                  <span className="rounded-md bg-background px-1.5 py-0.5 text-[10px] font-medium text-text-muted border border-border-light">
                    +{hackathon.technologies.length - 4}
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
                hackathon.isFree ? "text-emerald-600" : "text-primary"
              )}
            >
              {hackathon.entryFee}
            </span>
            <span className="text-[11px] font-medium text-text-muted">
              {hackathon.registeredCount.toLocaleString("en-IN")} registered
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBookmarkClick}
              aria-label={
                isBookmarked
                  ? `Remove ${hackathon.title} from bookmarks`
                  : `Save ${hackathon.title} to bookmarks`
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
      aria-label={`View details for ${hackathon.title}`}
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
                getStatusColor(hackathon.status)
              )}
            >
              {hackathon.status}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
              {hackathon.mode}
            </span>
          </div>

          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={
              isBookmarked
                ? `Remove ${hackathon.title} from bookmarks`
                : `Save ${hackathon.title} to bookmarks`
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
          {hackathon.category}
        </span>

        {/* Title */}
        <h3 className="text-base font-bold text-primary leading-snug group-hover:text-blue transition-colors line-clamp-2">
          {hackathon.title}
        </h3>

        {/* Host / Organizer */}
        <p className="mt-1 text-xs font-medium text-text-secondary line-clamp-1">
          {hackathon.organizerName}
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
                {hackathon.prize}
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
                hackathon.isFree ? "text-emerald-600" : "text-primary"
              )}
            >
              {hackathon.entryFee}
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
              Team: {hackathon.teamSize}
            </span>
          </div>

          {hackathon.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-text-muted shrink-0" />
              <span className="text-[11.5px] truncate">
                {hackathon.location}
              </span>
            </div>
          )}
        </div>

        {/* Tech tags */}
        {hackathon.technologies && hackathon.technologies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {hackathon.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-text-secondary border border-slate-200/80"
              >
                {tech}
              </span>
            ))}
            {hackathon.technologies.length > 3 && (
              <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-text-muted border border-slate-200/80">
                +{hackathon.technologies.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border-light flex items-center justify-between">
        <span className="text-[11px] font-semibold text-text-muted">
          {hackathon.registeredCount.toLocaleString("en-IN")} registered
        </span>

        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue group-hover:translate-x-0.5 transition-transform">
          View Details
          <ArrowRight size={13} />
        </span>
      </div>
    </article>
  );
}

