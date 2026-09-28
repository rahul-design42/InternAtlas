

import { useState, useMemo } from "react";
import { SubNav } from "./SubNav";
import { HeroBanner } from "./HeroBanner";
import { ListingControls } from "./ListingControls";
import { DesktopFilterSidebar } from "./DesktopFilterSidebar";
import { FilterDrawer } from "./FilterDrawer";
import { CompetitionCard } from "./CompetitionCard";
import { EmptyState } from "./EmptyState";
import {
  Competition,
  CompetitionFilterState,
  CompetitionSortOption,
} from "@/types/competition";
import { CompetitionFilterMetadata } from "@/lib/services/competitionService";
import { competitionService } from "@/lib/services/competitionService";
import { ArrowDown } from "lucide-react";

interface CompetitionsListingClientProps {
  initialCompetitions: Competition[];
  metadata: CompetitionFilterMetadata;
}

const DEFAULT_FILTERS: CompetitionFilterState = {
  search: "",
  category: "All",
  mode: "All",
  location: "All",
  eligibility: "All",
  feeType: "all",
  status: "All",
};

export function CompetitionsListingClient({
  initialCompetitions,
  metadata,
}: CompetitionsListingClientProps) {
  const [filters, setFilters] = useState<CompetitionFilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<CompetitionSortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // Lazy state initializer for bookmarks without causing effect setState cascades
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("internatlas_competition_bookmarks");
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
          "internatlas_competition_bookmarks",
          JSON.stringify(updated)
        );
      } catch {
        // Ignore localStorage error
      }
      return updated;
    });
  };

  // Derive filtered and sorted competitions synchronously via memoization
  const competitions = useMemo(() => {
    return competitionService.filterAndSort(initialCompetitions, filters, sortBy);
  }, [initialCompetitions, filters, sortBy]);

  // Compute active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== "All") count++;
    if (filters.mode !== "All") count++;
    if (filters.location !== "All") count++;
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

  const visibleCompetitions = useMemo(() => {
    return competitions.slice(0, visibleCount);
  }, [competitions, visibleCount]);

  const hasMore = visibleCount < competitions.length;

  return (
    <div className="min-h-screen bg-background text-primary">
      {/* 1. Module Sub Navigation */}
      <SubNav activeModule="competitions" />

      {/* 2. Competition Hero Section with Search */}
      <HeroBanner
        searchQuery={filters.search}
        onSearchChange={handleSearchChange}
        totalCount={metadata.totalCount}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 sm:py-8">
        {/* Listing Controls */}
        <ListingControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
          activeFilterCount={activeFilterCount}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={competitions.length}
        />

        {/* Filter Drawer for Mobile & Slide-over */}
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          filters={filters}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            setVisibleCount(9);
          }}
          onClearFilters={handleClearFilters}
          metadata={metadata}
          totalFilteredCount={competitions.length}
        />

        {/* Content Layout: Desktop Filter Sidebar + Listings */}
        <div className="mt-6 flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <DesktopFilterSidebar
            filters={filters}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setVisibleCount(9);
            }}
            onClearFilters={handleClearFilters}
            metadata={metadata}
            activeFilterCount={activeFilterCount}
          />

          {/* Cards Area */}
          <div className="flex-1 min-w-0">
            {competitions.length === 0 ? (
              <EmptyState onClearFilters={handleClearFilters} />
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {visibleCompetitions.map((comp) => (
                  <CompetitionCard
                    key={comp.id}
                    competition={comp}
                    viewMode="grid"
                    isBookmarked={bookmarkedIds.includes(comp.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {visibleCompetitions.map((comp) => (
                  <CompetitionCard
                    key={comp.id}
                    competition={comp}
                    viewMode="list"
                    isBookmarked={bookmarkedIds.includes(comp.id)}
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
                  Load More Competitions ({competitions.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
