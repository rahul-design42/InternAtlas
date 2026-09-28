

import { Link } from "@/lib/next-polyfills";
import { useRef } from "react";
// icons removed

import { OpportunityCard } from "@/components/ui/OpportunityCard";
import type { Opportunity } from "@/lib/types";

type OpportunitySectionProps = {
  eyebrow: string;
  title: string;
  highlightText?: string;
  opportunities: Opportunity[];
  viewAllLabel: string;
  viewAllHref: string;
};

export function OpportunitySection({
  eyebrow,
  title,
  highlightText,
  opportunities,
  viewAllLabel,
  viewAllHref,
}: OpportunitySectionProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  function scrollCards(direction: "left" | "right") {
    sliderRef.current?.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  }

  return (
    <section className="bg-[#f8fafc] pt-6 pb-14 lg:pt-8 lg:pb-16">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
              {eyebrow}
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#071c46] sm:text-4xl">
              {title}{" "}
              {highlightText && (
                <span className="font-serif font-normal italic text-[#c63845]">
                  {highlightText}
                </span>
              )}
            </h2>
          </div>

          <div className="hidden items-center gap-4 sm:flex">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-2 font-semibold text-[#071c46] hover:text-blue-600"
            >
              {viewAllLabel}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>

            {opportunities.length > 1 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => scrollCards("left")}
                  aria-label="Scroll internships left"
                  className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollCards("right")}
                  aria-label="Scroll internships right"
                  className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {opportunities.length > 0 ? (
          <div
            ref={sliderRef}
            className="flex snap-x gap-4 overflow-x-auto pb-3"
          >
            {opportunities.map((opportunity) => (
              <Link
                key={opportunity.id}
                href={opportunity.href || viewAllHref}
                className="shrink-0 snap-start rounded-[20px]"
              >
                <OpportunityCard
                  opportunity={opportunity}
                  className="w-[270px]"
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <p className="font-bold text-[#071c46]">
              No internships are currently available.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Please check again later for new opportunities.
            </p>
          </div>
        )}

        <Link
          href={viewAllHref}
          className="mt-5 inline-flex items-center gap-2 font-semibold text-[#071c46] sm:hidden"
        >
          {viewAllLabel}
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}