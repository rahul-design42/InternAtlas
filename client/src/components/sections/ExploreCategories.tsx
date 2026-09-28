import { CategoryCard } from "@/components/ui/CategoryCard";
import { ChevronRight } from "lucide-react";
import type { Category } from "@/lib/types";

interface ExploreCategoriesProps {
  categories: Category[];
}

export function ExploreCategories({
  categories,
}: ExploreCategoriesProps) {
  return (
    <section
      className="bg-transparent pb-8 pt-4 lg:pb-10 lg:pt-6"
      aria-label="Explore by category"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="relative flex items-center gap-4 lg:gap-8">
          <div className="-mt-4 flex min-w-0 flex-1 snap-x snap-mandatory gap-[12px] overflow-x-auto py-4 pr-10 scrollbar-none lg:snap-none lg:pr-0 xl:gap-[18px]">
            {categories.map((cat) => (
              <div key={cat.id} className="shrink-0 snap-start">
                <CategoryCard
                  category={cat}
                  className="h-[150px] w-[138px] xl:w-[150px]"
                />
              </div>
            ))}
          </div>

          <div className="z-10 hidden h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm transition-colors hover:bg-background lg:flex">
            <ChevronRight
              size={24}
              className="text-primary"
              strokeWidth={2.5}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between border-t border-border-light pt-8 pb-4 gap-6">
          <p className="max-w-[160px] text-[14px] font-medium leading-snug text-text-secondary">
            A growing community of ambitious students.
          </p>
          
          {/* 50K+ Opportunities */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-bold text-primary">50K+</p>
              <p className="text-[11px] font-medium text-text-secondary">Opportunities</p>
            </div>
          </div>

          {/* 10K+ Hiring Partners */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                <circle cx="12" cy="8" r="2.5"/>
                <path d="M8 14a4 4 0 0 1 8 0"/>
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-bold text-primary">10K+</p>
              <p className="text-[11px] font-medium text-text-secondary">Hiring Partners</p>
            </div>
          </div>

          {/* 5M+ Students */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                <circle cx="12" cy="10" r="2.5" />
                <path d="M7.5 16a4.5 4.5 0 0 1 9 0" />
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-bold text-primary">5M+</p>
              <p className="text-[11px] font-medium text-text-secondary">Students</p>
            </div>
          </div>

          {/* 1K+ Colleges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="22" x2="21" y2="22" />
                <line x1="6" y1="18" x2="6" y2="11" />
                <line x1="10" y1="18" x2="10" y2="11" />
                <line x1="14" y1="18" x2="14" y2="11" />
                <line x1="18" y1="18" x2="18" y2="11" />
                <polygon points="12 2 20 7 4 7" />
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-bold text-primary">1K+</p>
              <p className="text-[11px] font-medium text-text-secondary">Colleges</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}