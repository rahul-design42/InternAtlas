import { MOCK_COMPETITIONS } from "@/data/mock-competitions";
import {
  Competition,
  CompetitionFilterState,
  CompetitionSortOption,
} from "@/types/competition";

export interface CompetitionFilterMetadata {
  categories: string[];
  modes: string[];
  locations: string[];
  eligibilities: string[];
  totalCount: number;
}

/**
 * Service abstraction for Competitions.
 * Decouples the UI components from direct data access so that mock data can
 * seamlessly be swapped with Express/API backend calls in the future.
 */
class CompetitionService {
  /**
   * Synchronous filter and sort helper for client components.
   */
  filterAndSort(
    items: Competition[],
    filters?: Partial<CompetitionFilterState>,
    sort: CompetitionSortOption = "newest"
  ): Competition[] {
    let results = [...items];

    if (!filters) {
      return this.sortCompetitions(results, sort);
    }

    // Search query across title, organizer, category, location, and tags
    if (filters.search && filters.search.trim() !== "") {
      const q = filters.search.trim().toLowerCase();
      results = results.filter((comp) => {
        return (
          comp.title.toLowerCase().includes(q) ||
          comp.organizerName.toLowerCase().includes(q) ||
          comp.category.toLowerCase().includes(q) ||
          (comp.location && comp.location.toLowerCase().includes(q)) ||
          comp.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      });
    }

    // Category filter
    if (filters.category && filters.category !== "All") {
      results = results.filter(
        (comp) => comp.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    // Mode filter (Online, Offline, Hybrid)
    if (filters.mode && filters.mode !== "All") {
      results = results.filter(
        (comp) => comp.mode.toLowerCase() === filters.mode!.toLowerCase()
      );
    }

    // Location filter
    if (filters.location && filters.location !== "All") {
      results = results.filter(
        (comp) =>
          comp.location &&
          comp.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Eligibility filter
    if (filters.eligibility && filters.eligibility !== "All") {
      results = results.filter((comp) =>
        comp.eligibility
          .toLowerCase()
          .includes(filters.eligibility!.toLowerCase())
      );
    }

    // Fee type filter (all, free, paid)
    if (filters.feeType && filters.feeType !== "all") {
      if (filters.feeType === "free") {
        results = results.filter((comp) => comp.isFree);
      } else if (filters.feeType === "paid") {
        results = results.filter((comp) => !comp.isFree);
      }
    }

    // Status filter
    if (filters.status && filters.status !== "All") {
      results = results.filter(
        (comp) => comp.status.toLowerCase() === filters.status!.toLowerCase()
      );
    }

    return this.sortCompetitions(results, sort);
  }

  /**
   * Retrieves all competitions or applies filtering, searching, and sorting.
   */
  async getCompetitions(
    filters?: Partial<CompetitionFilterState>,
    sort: CompetitionSortOption = "newest"
  ): Promise<Competition[]> {
    return this.filterAndSort(MOCK_COMPETITIONS, filters, sort);
  }

  /**
   * Retrieves a single competition by its unique slug.
   */
  async getCompetitionBySlug(slug: string): Promise<Competition | null> {
    const normalizedSlug = slug.toLowerCase().trim();
    const found = MOCK_COMPETITIONS.find(
      (c) => c.slug.toLowerCase() === normalizedSlug
    );
    return found || null;
  }

  /**
   * Sorts an array of competitions according to the specified sort criteria.
   */
  sortCompetitions(
    competitions: Competition[],
    sort: CompetitionSortOption
  ): Competition[] {
    const list = [...competitions];

    switch (sort) {
      case "deadline_soon":
        return list.sort(
          (a, b) =>
            new Date(a.registrationDeadline).getTime() -
            new Date(b.registrationDeadline).getTime()
        );
      case "deadline_later":
        return list.sort(
          (a, b) =>
            new Date(b.registrationDeadline).getTime() -
            new Date(a.registrationDeadline).getTime()
        );
      case "most_registered":
        return list.sort((a, b) => b.registeredCount - a.registeredCount);
      case "alphabetical":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case "newest":
      default:
        return list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }

  /**
   * Retrieves dynamic filter metadata based on existing dataset.
   */
  async getFilterMetadata(): Promise<CompetitionFilterMetadata> {
    const categories = Array.from(
      new Set(MOCK_COMPETITIONS.map((c) => c.category))
    ).sort();

    const modes = ["Online", "Offline", "Hybrid"];

    const locations = Array.from(
      new Set(
        MOCK_COMPETITIONS.map((c) => c.location).filter(Boolean) as string[]
      )
    ).sort();

    const eligibilities = [
      "All Students",
      "Engineering",
      "MBA",
      "Design & Arts",
      "Life Sciences",
    ];

    return {
      categories,
      modes,
      locations,
      eligibilities,
      totalCount: MOCK_COMPETITIONS.length,
    };
  }
}

export const competitionService = new CompetitionService();
