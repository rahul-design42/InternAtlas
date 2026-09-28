import { MOCK_CONTESTS } from "@/data/mock-contests";
import {
  Contest,
  ContestFilterState,
  ContestSortOption,
} from "@/types/contest";

export interface ContestFilterMetadata {
  categories: string[];
  modes: string[];
  locations: string[];
  eligibilities: string[];
  totalCount: number;
}

/**
 * Service abstraction for Contests.
 * Decouples the UI components from direct data access so that mock data can
 * seamlessly be swapped with Express/API backend calls in the future.
 */
class ContestService {
  /**
   * Synchronous filter and sort helper for client components.
   */
  filterAndSort(
    items: Contest[],
    filters?: Partial<ContestFilterState>,
    sort: ContestSortOption = "newest"
  ): Contest[] {
    let results = [...items];

    if (!filters) {
      return this.sortContests(results, sort);
    }

    // Search query across title, organizer, category, location, tags, and technologies
    if (filters.search && filters.search.trim() !== "") {
      const q = filters.search.trim().toLowerCase();
      results = results.filter((contest) => {
        return (
          contest.title.toLowerCase().includes(q) ||
          contest.organizerName.toLowerCase().includes(q) ||
          contest.category.toLowerCase().includes(q) ||
          (contest.location && contest.location.toLowerCase().includes(q)) ||
          contest.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          (contest.technologies &&
            contest.technologies.some((tech) => tech.toLowerCase().includes(q)))
        );
      });
    }

    // Category filter
    if (filters.category && filters.category !== "All") {
      results = results.filter(
        (contest) => contest.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    // Mode filter (Online, Offline, Hybrid)
    if (filters.mode && filters.mode !== "All") {
      results = results.filter(
        (contest) => contest.mode.toLowerCase() === filters.mode!.toLowerCase()
      );
    }

    // Location filter
    if (filters.location && filters.location !== "All") {
      results = results.filter(
        (contest) =>
          contest.location &&
          contest.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Eligibility filter
    if (filters.eligibility && filters.eligibility !== "All") {
      results = results.filter((contest) =>
        contest.eligibility
          .toLowerCase()
          .includes(filters.eligibility!.toLowerCase())
      );
    }

    // Fee type filter (all, free, paid)
    if (filters.feeType && filters.feeType !== "all") {
      if (filters.feeType === "free") {
        results = results.filter((contest) => contest.isFree);
      } else if (filters.feeType === "paid") {
        results = results.filter((contest) => !contest.isFree);
      }
    }

    // Status filter
    if (filters.status && filters.status !== "All") {
      results = results.filter(
        (contest) => contest.status.toLowerCase() === filters.status!.toLowerCase()
      );
    }

    return this.sortContests(results, sort);
  }

  /**
   * Retrieves all contests or applies filtering, searching, and sorting.
   */
  async getContests(
    filters?: Partial<ContestFilterState>,
    sort: ContestSortOption = "newest"
  ): Promise<Contest[]> {
    return this.filterAndSort(MOCK_CONTESTS, filters, sort);
  }

  /**
   * Retrieves a single contest by its unique slug.
   */
  async getContestBySlug(slug: string): Promise<Contest | null> {
    const normalizedSlug = slug.toLowerCase().trim();
    const found = MOCK_CONTESTS.find(
      (c) => c.slug.toLowerCase() === normalizedSlug
    );
    return found || null;
  }

  /**
   * Sorts an array of contests according to the specified sort criteria.
   */
  sortContests(
    contests: Contest[],
    sort: ContestSortOption
  ): Contest[] {
    const list = [...contests];

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
  async getFilterMetadata(): Promise<ContestFilterMetadata> {
    const categories = Array.from(
      new Set(MOCK_CONTESTS.map((c) => c.category))
    ).sort();

    const modes = ["Online", "Offline", "Hybrid"];

    const locations = Array.from(
      new Set(
        MOCK_CONTESTS.map((c) => c.location).filter(Boolean) as string[]
      )
    ).sort();

    const eligibilities = [
      "All Students",
      "Engineering",
      "Self-taught Developers",
      "Graduates",
      "Open to All",
    ];

    return {
      categories,
      modes,
      locations,
      eligibilities,
      totalCount: MOCK_CONTESTS.length,
    };
  }
}

export const contestService = new ContestService();
