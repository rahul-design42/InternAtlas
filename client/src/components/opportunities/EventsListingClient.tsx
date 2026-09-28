

import { useState, useMemo } from "react";
import { SubNav } from "./SubNav";
import { HeroBanner } from "./HeroBanner";
import { ListingControls } from "./ListingControls";
import { DesktopFilterSidebar } from "./DesktopFilterSidebar";
import { FilterDrawer } from "./FilterDrawer";
import { EventCard } from "./EventCard";
import { EmptyState } from "./EmptyState";
import {
  Event,
  EventFilterState,
  EventSortOption,
} from "@/types/event";
import { EventFilterMetadata, eventService } from "@/lib/services/eventService";
import { ArrowDown } from "lucide-react";
import { CompetitionSortOption } from "@/types/competition";

interface EventsListingClientProps {
  initialEvents: Event[];
  metadata: EventFilterMetadata;
}

const DEFAULT_FILTERS: EventFilterState = {
  search: "",
  category: "All",
  eventType: "All",
  mode: "All",
  location: "All",
  eligibility: "All",
  feeType: "all",
  status: "All",
};

export function EventsListingClient({
  initialEvents,
  metadata,
}: EventsListingClientProps) {
  const [filters, setFilters] = useState<EventFilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<EventSortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // Lazy state initializer for bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("internatlas_event_bookmarks");
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
          "internatlas_event_bookmarks",
          JSON.stringify(updated)
        );
      } catch {
        // Ignore localStorage error
      }
      return updated;
    });
  };

  // Derive filtered and sorted events synchronously via pure memoization
  const events = useMemo(() => {
    return eventService.filterAndSort(initialEvents, filters, sortBy);
  }, [initialEvents, filters, sortBy]);

  // Compute active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== "All") count++;
    if (filters.eventType !== "All") count++;
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

  const visibleEvents = useMemo(() => {
    return events.slice(0, visibleCount);
  }, [events, visibleCount]);

  const hasMore = visibleCount < events.length;

  return (
    <div className="min-h-screen bg-background text-primary">
      {/* 1. Module Sub Navigation with Events active */}
      <SubNav activeModule="events" />

      {/* 2. Events Hero Banner */}
      <HeroBanner
        searchQuery={filters.search}
        onSearchChange={handleSearchChange}
        totalCount={metadata.totalCount}
        badgeText="EVENTS & EXPERIENCES"
        title={
          <>
            Discover Events That <br className="hidden sm:inline" />
            <span className="text-cyan">Move You Forward.</span>
          </>
        }
        subtitle="Explore conferences, workshops, meetups, webinars, career events, and industry experiences. Network with leaders, learn cutting-edge skills, and accelerate your journey."
        searchPlaceholder="Search by event name, speaker, topic, city, venue, or format..."
        metric1Label="Active Events"
        metric2Value={`${metadata.categories.length}+`}
        metric2Label="Categories"
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
          onSortChange={(newSort) => setSortBy(newSort as EventSortOption)}
          totalResults={events.length}
          itemLabel="Event"
        />

        {/* Filter Drawer for Mobile & Slide-over */}
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          filters={filters}
          onFilterChange={(newFilters) => {
            setFilters(newFilters as EventFilterState);
            setVisibleCount(9);
          }}
          onClearFilters={handleClearFilters}
          metadata={metadata}
          totalFilteredCount={events.length}
        />

        {/* Content Layout: Desktop Filter Sidebar + Listings */}
        <div className="mt-6 flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <DesktopFilterSidebar
            filters={filters}
            onFilterChange={(newFilters) => {
              setFilters(newFilters as EventFilterState);
              setVisibleCount(9);
            }}
            onClearFilters={handleClearFilters}
            metadata={metadata}
            activeFilterCount={activeFilterCount}
          />

          {/* Cards Area */}
          <div className="flex-1 min-w-0">
            {events.length === 0 ? (
              <EmptyState
                title="No events found"
                description="Try changing your search or clearing filters to discover more events."
                onClearFilters={handleClearFilters}
              />
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {visibleEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    viewMode="grid"
                    isBookmarked={bookmarkedIds.includes(event.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {visibleEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    viewMode="list"
                    isBookmarked={bookmarkedIds.includes(event.id)}
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
                  Load More Events ({events.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
