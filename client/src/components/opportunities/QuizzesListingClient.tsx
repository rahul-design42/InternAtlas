

import { useState, useMemo } from "react";
import { SubNav } from "./SubNav";
import { HeroBanner } from "./HeroBanner";
import { ListingControls } from "./ListingControls";
import { DesktopFilterSidebar } from "./DesktopFilterSidebar";
import { FilterDrawer } from "./FilterDrawer";
import { QuizCard } from "./QuizCard";
import { EmptyState } from "./EmptyState";
import {
  Quiz,
  QuizFilterState,
  QuizSortOption,
} from "@/types/quiz";
import { QuizFilterMetadata, quizService } from "@/lib/services/quizService";
import { ArrowDown } from "lucide-react";
import { CompetitionSortOption } from "@/types/competition";

interface QuizzesListingClientProps {
  initialQuizzes: Quiz[];
  metadata: QuizFilterMetadata;
}

const DEFAULT_FILTERS: QuizFilterState = {
  search: "",
  category: "All",
  mode: "All",
  location: "All",
  difficulty: "All",
  eligibility: "All",
  feeType: "all",
  status: "All",
};

export function QuizzesListingClient({
  initialQuizzes,
  metadata,
}: QuizzesListingClientProps) {
  const [filters, setFilters] = useState<QuizFilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<QuizSortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // Lazy state initializer for bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("internatlas_quiz_bookmarks");
        if (stored) return JSON.parse(stored);
      } catch {
        // Ignore localStorage error
      }
    }
    return [];
  });

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem(
          "internatlas_quiz_bookmarks",
          JSON.stringify(updated)
        );
      } catch {
        // Ignore localStorage error
      }
      return updated;
    });
  };

  // Derive filtered and sorted quizzes synchronously via pure memoization
  const quizzes = useMemo(() => {
    return quizService.filterAndSort(initialQuizzes, filters, sortBy);
  }, [initialQuizzes, filters, sortBy]);

  // Compute active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== "All") count++;
    if (filters.mode !== "All") count++;
    if (filters.location !== "All") count++;
    if (filters.difficulty !== "All") count++;
    if (filters.eligibility !== "All") count++;
    if (filters.feeType !== "all") count++;
    if (filters.status !== "All") count++;
    if (filters.search.trim() !== "") count++;
    return count;
  }, [filters]);

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setVisibleCount(9);
  };

  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
    setVisibleCount(9);
  };

  const visibleQuizzes = useMemo(() => {
    return quizzes.slice(0, visibleCount);
  }, [quizzes, visibleCount]);

  const hasMore = visibleCount < quizzes.length;

  return (
    <div className="min-h-screen bg-background text-primary">
      {/* 1. Module Sub Navigation with Quizzes active */}
      <SubNav activeModule="quizzes" />

      {/* 2. Quizzes Hero Banner */}
      <HeroBanner
        searchQuery={filters.search}
        onSearchChange={handleSearchChange}
        totalCount={metadata.totalCount}
        badgeText="KNOWLEDGE & SKILLS"
        title={
          <>
            Test Your Knowledge. <br className="hidden sm:inline" />
            <span className="text-cyan">Prove Your Skills.</span>
          </>
        }
        subtitle="Discover quizzes across technology, aptitude, AI, business, and algorithms. Challenge your core concepts, race the countdown clock, and win prizes."
        searchPlaceholder="Search by quiz topic, language, difficulty, organizer, or concept..."
        metric1Label="Active Quizzes"
        metric2Value="₹7L+"
        metric2Label="Cash & Rewards"
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 sm:py-8">
        {/* Listing Controls */}
        <ListingControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
          activeFilterCount={activeFilterCount}
          sortBy={sortBy as CompetitionSortOption}
          onSortChange={(newSort) => setSortBy(newSort as QuizSortOption)}
          totalResults={quizzes.length}
          itemLabel="Quiz"
        />

        {/* Filter Drawer for Mobile & Slide-over */}
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          filters={filters}
          onFilterChange={(newFilters) => {
            setFilters(newFilters as QuizFilterState);
            setVisibleCount(9);
          }}
          onClearFilters={handleClearFilters}
          metadata={metadata}
          totalFilteredCount={quizzes.length}
        />

        {/* Content Layout: Desktop Filter Sidebar + Listings */}
        <div className="mt-6 flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <DesktopFilterSidebar
            filters={filters}
            onFilterChange={(newFilters) => {
              setFilters(newFilters as QuizFilterState);
              setVisibleCount(9);
            }}
            onClearFilters={handleClearFilters}
            metadata={metadata}
            activeFilterCount={activeFilterCount}
          />

          {/* Cards Area */}
          <div className="flex-1 min-w-0">
            {quizzes.length === 0 ? (
              <EmptyState
                title="No quizzes found"
                description="Try changing your search or clearing filters to discover more quizzes."
                onClearFilters={handleClearFilters}
              />
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {visibleQuizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    viewMode="grid"
                    isBookmarked={bookmarkedIds.includes(quiz.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {visibleQuizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    viewMode="list"
                    isBookmarked={bookmarkedIds.includes(quiz.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-2.5 text-xs font-bold text-primary shadow-sm hover:border-blue hover:bg-slate-50 transition-all focus-visible:ring-2 focus-visible:ring-blue"
                >
                  <ArrowDown size={14} />
                  Load More Quizzes ({quizzes.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
