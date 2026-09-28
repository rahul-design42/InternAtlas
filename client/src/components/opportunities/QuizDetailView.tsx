

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
  HelpCircle,
  Award,
  Layers,
  FileText,
  Sparkles,
  BarChart2,
} from "lucide-react";
import { Quiz } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizDetailViewProps {
  quiz: Quiz;
}

export function QuizDetailView({ quiz }: QuizDetailViewProps) {
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
    quiz.registrationDeadline
  ).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedQuizDate = new Date(quiz.startDate).toLocaleDateString(
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
            href="/quizzes"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-secondary hover:text-blue transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Quizzes</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share quiz"
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
                  {quiz.category}
                </span>

                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-bold",
                    quiz.status === "Closing Soon"
                      ? "bg-pink text-white"
                      : "bg-emerald-500 text-white"
                  )}
                >
                  {quiz.status}
                </span>

                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {quiz.difficulty} Level
                </span>

                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {quiz.mode}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {quiz.title}
              </h1>

              {quiz.tagline && (
                <p className="mt-2 text-sm sm:text-base text-cyan font-medium">
                  {quiz.tagline}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-border">
                <div className="inline-flex items-center gap-1.5">
                  <Building size={15} className="text-cyan" />
                  <span>{quiz.organizerName}</span>
                </div>

                {quiz.location && (
                  <div className="inline-flex items-center gap-1.5">
                    <MapPin size={15} className="text-cyan" />
                    <span>{quiz.location}</span>
                  </div>
                )}

                <div className="inline-flex items-center gap-1.5">
                  <Users size={15} className="text-cyan" />
                  <span>
                    {quiz.participantCount.toLocaleString("en-IN")}{" "}
                    Participants Joined
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
                {quiz.prizePool}
              </p>
            </div>

            <div className="sm:border-r border-border/60 sm:pr-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Questions & Time
              </span>
              <p className="mt-1 text-sm sm:text-base font-bold text-primary">
                {quiz.questionCount} Qs ({quiz.duration})
              </p>
            </div>

            <div className="border-r border-border/60 pr-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Registration Deadline
              </span>
              <p className="mt-1 text-sm sm:text-base font-bold text-primary">
                {formattedDeadline}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Entry Fee
              </span>
              <p
                className={cn(
                  "mt-1 text-sm sm:text-base font-extrabold",
                  quiz.isFree ? "text-emerald-600" : "text-primary"
                )}
              >
                {quiz.entryFee}
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
                About the Quiz
              </h2>
              <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-text-secondary whitespace-pre-line">
                {quiz.description}
              </p>

              {/* Technologies / Key Topics */}
              {quiz.technologies && quiz.technologies.length > 0 && (
                <div className="mt-6 pt-5 border-t border-border-light">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-3">
                    <Sparkles size={14} className="text-blue" />
                    <span>Focus Areas & Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quiz.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-blue-surface px-3 py-1 text-xs font-semibold text-blue border border-blue/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Quiz Information Overview */}
            <section className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-card">
              <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                <FileText size={20} className="text-blue" />
                Assessment Overview
              </h2>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border-light bg-background/50 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Total Questions
                  </span>
                  <div className="mt-1 flex items-center gap-2 font-bold text-primary text-base">
                    <HelpCircle size={16} className="text-blue" />
                    <span>{quiz.questionCount} Multiple Choice Questions</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border-light bg-background/50 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Duration
                  </span>
                  <div className="mt-1 flex items-center gap-2 font-bold text-primary text-base">
                    <Clock size={16} className="text-blue" />
                    <span>{quiz.duration} Total Time</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border-light bg-background/50 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Difficulty Level
                  </span>
                  <div className="mt-1 flex items-center gap-2 font-bold text-primary text-base">
                    <BarChart2 size={16} className="text-blue" />
                    <span>{quiz.difficulty}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border-light bg-background/50 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Assessment Language
                  </span>
                  <div className="mt-1 flex items-center gap-2 font-bold text-primary text-base">
                    <CheckCircle2 size={16} className="text-blue" />
                    <span>{quiz.languages.join(", ")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-border-light bg-background/50 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Eligibility Criteria
                </span>
                <p className="mt-1 text-sm font-semibold text-primary">
                  {quiz.eligibility}
                </p>
              </div>
            </section>

            {/* Rounds & Timeline */}
            {quiz.rounds && quiz.rounds.length > 0 && (
              <section className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-card">
                <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                  <Layers size={20} className="text-blue" />
                  Quiz Stages & Rounds
                </h2>

                <div className="mt-6 space-y-6">
                  {quiz.rounds.map((round, idx) => (
                    <div
                      key={round.title}
                      className="relative pl-7 sm:pl-9 border-l-2 border-blue/30 last:border-transparent pb-6 last:pb-0"
                    >
                      <span className="absolute -left-[9px] top-0 flex h-4 w-4 rounded-full bg-blue ring-4 ring-white" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue">
                          Stage {idx + 1}: {round.type}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
                          {round.questionCount && (
                            <span>{round.questionCount} Qs</span>
                          )}
                          {round.duration && <span>• {round.duration}</span>}
                        </div>
                      </div>

                      <h3 className="mt-1 text-base font-bold text-primary">
                        {round.title}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                        {round.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Instructions */}
            {quiz.instructions && quiz.instructions.length > 0 && (
              <section className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-card">
                <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                  <AlertCircle size={20} className="text-blue" />
                  Instructions for Participants
                </h2>

                <ul className="mt-4 space-y-2.5">
                  {quiz.instructions.map((inst, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary"
                    >
                      <CheckCircle2
                        size={15}
                        className="text-emerald-600 shrink-0 mt-0.5"
                      />
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Rewards & Prizes */}
            {quiz.rewards && quiz.rewards.length > 0 && (
              <section className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-card">
                <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                  <Trophy size={20} className="text-blue" />
                  Prizes & Rewards
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {quiz.rewards.map((reward) => (
                    <div
                      key={reward.position}
                      className="rounded-xl border border-border-light bg-background/50 p-4 transition-all hover:border-blue/40"
                    >
                      <div className="text-xs font-bold uppercase tracking-wider text-text-muted">
                        {reward.position}
                      </div>
                      <div className="mt-1 text-lg font-extrabold text-blue">
                        {reward.amount}
                      </div>

                      {reward.perks && reward.perks.length > 0 && (
                        <ul className="mt-3 space-y-1.5 text-xs text-text-secondary">
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

            {/* Rules & Integrity Guidelines */}
            {quiz.rules && quiz.rules.length > 0 && (
              <section className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-card">
                <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                  <Award size={20} className="text-blue" />
                  Quiz Rules & Integrity Guidelines
                </h2>

                <ul className="mt-4 space-y-3">
                  {quiz.rules.map((rule, idx) => (
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
                  {quiz.entryFee}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-bold",
                    quiz.status === "Closing Soon"
                      ? "bg-pink text-white"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  )}
                >
                  {quiz.status}
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

              {/* Quiz Schedule Date */}
              <div className="mt-2 rounded-xl bg-background border border-border p-3 text-xs">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock size={14} className="text-blue" />
                  <span>Scheduled date:</span>
                </div>
                <div className="mt-1 font-bold text-primary">
                  {formattedQuizDate} ({quiz.duration})
                </div>
              </div>

              {/* CTA Action */}
              <div className="mt-5 space-y-3">
                <a
                  href={quiz.registrationUrl}
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
                  {quiz.organizerName}
                </div>
                {quiz.websiteUrl && (
                  <a
                    href={quiz.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 font-semibold text-blue hover:underline"
                  >
                    <span>Visit Official Quiz Portal</span>
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
