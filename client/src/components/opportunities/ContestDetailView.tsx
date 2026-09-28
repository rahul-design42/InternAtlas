

import { useState } from "react";
import { Link } from "@/lib/next-polyfills";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Trophy,
  Users,
  CheckCircle2,
  Share2,
  Bookmark,
  Check,
  AlertCircle,
  Building,
  ShieldCheck,
  Award,
  Terminal,
} from "lucide-react";
import { Contest } from "@/types/contest";
import { cn } from "@/lib/utils";

interface ContestDetailViewProps {
  contest: Contest;
}

export function ContestDetailView({ contest }: ContestDetailViewProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const formattedDeadline = new Date(
    contest.registrationDeadline
  ).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedContestDate = new Date(contest.startDate).toLocaleDateString(
    "en-IN",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="min-h-screen bg-background text-primary pb-16">
      {/* 1. Back Navigation Bar */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3.5 sm:px-6">
          <Link
            href="/contests"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-secondary hover:text-blue transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Contests</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share contest"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary hover:border-blue hover:text-blue transition-all"
            >
              {copiedShare ? (
                <>
                  <Check size={13} className="text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={13} />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsBookmarked((prev) => !prev)}
              aria-label={
                isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"
              }
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                isBookmarked
                  ? "border-blue bg-blue-surface text-blue"
                  : "border-border text-text-secondary hover:border-blue hover:text-blue"
              )}
            >
              <Bookmark
                size={13}
                className={isBookmarked ? "fill-blue text-blue" : ""}
              />
              <span>{isBookmarked ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="mx-auto max-w-[1280px] px-4 pt-6 sm:px-6 lg:pt-8">
        {/* Top Hero Card */}
        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
          <div className="relative bg-deep-navy px-6 py-8 sm:px-8 sm:py-10 text-white overflow-hidden">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-blue/25 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute left-1/3 bottom-0 h-48 w-48 rounded-full bg-cyan/15 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-full bg-cyan/20 border border-cyan/40 px-3 py-0.5 text-xs font-bold text-cyan-light">
                  {contest.category}
                </span>

                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-bold",
                    contest.status === "Closing Soon"
                      ? "bg-pink text-white"
                      : "bg-emerald-500 text-white"
                  )}
                >
                  {contest.status}
                </span>

                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {contest.mode}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {contest.title}
              </h1>

              {contest.tagline && (
                <p className="mt-2 text-sm sm:text-base text-cyan font-medium">
                  {contest.tagline}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-border">
                <div className="inline-flex items-center gap-1.5">
                  <Building size={15} className="text-cyan" />
                  <span>{contest.organizerName}</span>
                </div>

                {contest.location && (
                  <div className="inline-flex items-center gap-1.5">
                    <MapPin size={15} className="text-cyan" />
                    <span>{contest.location}</span>
                  </div>
                )}

                <div className="inline-flex items-center gap-1.5">
                  <Users size={15} className="text-cyan" />
                  <span>
                    {contest.registeredCount.toLocaleString("en-IN")}{" "}
                    Contestants Registered
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-4 border-t border-border/60 bg-white p-5 sm:grid-cols-4 sm:p-6 text-center sm:text-left">
            <div className="border-r border-border/60 pr-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Prize Pool
              </span>
              <p className="mt-1 text-base sm:text-lg font-extrabold text-blue">
                {contest.prize}
              </p>
            </div>

            <div className="sm:border-r border-border/60 sm:pr-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Registration Deadline
              </span>
              <p className="mt-1 text-sm sm:text-base font-bold text-primary">
                {formattedDeadline}
              </p>
            </div>

            <div className="border-r border-border/60 pr-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Contest Format
              </span>
              <p className="mt-1 text-sm sm:text-base font-bold text-primary">
                {contest.teamSize}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Entry Fee
              </span>
              <p
                className={cn(
                  "mt-1 text-sm sm:text-base font-extrabold",
                  contest.isFree ? "text-emerald-600" : "text-primary"
                )}
              >
                {contest.entryFee}
              </p>
            </div>
          </div>
        </section>

        {/* 2-Column Layout: Details Body (Left) + Action Sidebar (Right) */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] items-start">
          {/* Left Column: Rich Sections */}
          <div className="space-y-8">
            {/* About Section */}
            <section className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-card">
              <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                <AlertCircle size={20} className="text-blue" />
                About the Contest
              </h2>
              <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-text-secondary whitespace-pre-line">
                {contest.description}
              </p>

              {/* Technologies / Languages if supported */}
              {contest.technologies && contest.technologies.length > 0 && (
                <div className="mt-6 pt-5 border-t border-border-light">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-3">
                    <Terminal size={14} className="text-blue" />
                    <span>Supported Environments / Languages</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {contest.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-blue-surface/60 px-3 py-1 text-xs font-semibold text-blue border border-blue/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {contest.tags && contest.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-border-light">
                  {contest.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-background px-3 py-1 text-xs font-semibold text-text-secondary border border-border-light"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Eligibility Section */}
            <section className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-card">
              <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-600" />
                Eligibility & Format
              </h2>
              <div className="mt-4 rounded-xl bg-blue-surface/50 border border-blue/20 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue">
                  Who Can Participate
                </span>
                <p className="mt-1 text-sm font-semibold text-primary">
                  {contest.eligibility}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-text-secondary">
                <div className="flex items-center gap-2 rounded-xl border border-border p-3">
                  <Users size={16} className="text-blue shrink-0" />
                  <span>
                    Format: <strong>{contest.teamSize}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border p-3">
                  <Calendar size={16} className="text-blue shrink-0" />
                  <span>
                    Contest Date: <strong>{formattedContestDate}</strong>
                  </span>
                </div>
              </div>
            </section>

            {/* Rounds & Timeline Section */}
            {contest.timeline && contest.timeline.length > 0 && (
              <section className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-card">
                <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                  <Clock size={20} className="text-blue" />
                  Schedule & Rounds
                </h2>

                <div className="mt-6 space-y-6 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-border-light">
                  {contest.timeline.map((round, index) => (
                    <div
                      key={round.title}
                      className="relative flex items-start gap-4 pl-1"
                    >
                      <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue text-xs font-bold text-white shadow-xs">
                        {index + 1}
                      </div>

                      <div className="flex-1 rounded-xl border border-border p-4 bg-background/50">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-primary">
                            {round.title}
                          </h3>
                          <span className="rounded-full bg-white border border-border px-2.5 py-0.5 text-[11px] font-semibold text-blue">
                            {round.type}
                          </span>
                        </div>

                        <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                          {round.description}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-text-muted">
                          <Calendar size={13} />
                          <span>
                            {new Date(round.startDate).toLocaleDateString(
                              "en-IN",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}{" "}
                            –{" "}
                            {new Date(round.endDate).toLocaleDateString(
                              "en-IN",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rewards & Prizes Section */}
            {contest.rewards && contest.rewards.length > 0 && (
              <section className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-card">
                <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                  <Trophy size={20} className="text-amber-500" />
                  Prizes & Recognition
                </h2>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contest.rewards.map((reward, i) => (
                    <div
                      key={reward.position}
                      className={cn(
                        "rounded-xl border p-4 flex flex-col justify-between",
                        i === 0
                          ? "border-amber-300 bg-amber-50/40"
                          : "border-border bg-background/40"
                      )}
                    >
                      <div>
                        <span className="inline-block rounded-md bg-white px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-text-secondary border border-border-light mb-2">
                          {reward.position}
                        </span>
                        <div className="text-xl font-extrabold text-primary">
                          {reward.amount}
                        </div>
                      </div>

                      {reward.perks && reward.perks.length > 0 && (
                        <ul className="mt-3 space-y-1.5 border-t border-border/50 pt-3 text-xs text-text-secondary">
                          {reward.perks.map((perk) => (
                            <li key={perk} className="flex items-start gap-1.5">
                              <CheckCircle2
                                size={13}
                                className="text-emerald-600 shrink-0 mt-0.5"
                              />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rules & Guidelines */}
            {contest.rules && contest.rules.length > 0 && (
              <section className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-card">
                <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                  <Award size={20} className="text-blue" />
                  Contest Rules & Integrity Guidelines
                </h2>

                <ul className="mt-4 space-y-3">
                  {contest.rules.map((rule, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-xs sm:text-sm text-text-secondary leading-relaxed"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-surface text-[11px] font-bold text-blue mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right Column: Sticky Action Card */}
          <aside className="lg:sticky lg:top-28">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Registration Status
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xl font-extrabold text-primary">
                  {contest.entryFee}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-bold",
                    contest.status === "Closing Soon"
                      ? "bg-pink text-white"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  )}
                >
                  {contest.status}
                </span>
              </div>

              {/* Deadline Box */}
              <div className="mt-4 rounded-xl bg-background border border-border p-3 text-xs">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Calendar size={14} className="text-blue" />
                  <span>Registration closes on:</span>
                </div>
                <div className="mt-1 font-bold text-primary">
                  {formattedDeadline}
                </div>
              </div>

              {/* CTA Action */}
              <div className="mt-5 space-y-3">
                <a
                  href={contest.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue text-sm font-bold text-white shadow-sm hover:bg-blue-hover transition-all"
                >
                  Register Now
                  <ExternalLink size={15} />
                </a>

                <button
                  type="button"
                  onClick={() => setIsBookmarked((prev) => !prev)}
                  className={cn(
                    "flex h-10 w-full items-center justify-center gap-2 rounded-xl border text-xs font-semibold transition-all",
                    isBookmarked
                      ? "border-blue bg-blue-surface text-blue"
                      : "border-border bg-white text-text-secondary hover:border-slate-300 hover:text-primary"
                  )}
                >
                  <Bookmark
                    size={14}
                    className={isBookmarked ? "fill-blue text-blue" : ""}
                  />
                  <span>
                    {isBookmarked
                      ? "Saved in My Opportunities"
                      : "Save for Later"}
                  </span>
                </button>
              </div>

              {/* Organizer Summary */}
              <div className="mt-6 border-t border-border-light pt-5 text-xs">
                <div className="text-text-muted font-medium mb-1">
                  Organized by
                </div>
                <div className="font-bold text-primary text-sm">
                  {contest.organizerName}
                </div>
                {contest.websiteUrl && (
                  <a
                    href={contest.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 font-semibold text-blue hover:underline"
                  >
                    <span>Visit Official Contest Page</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
