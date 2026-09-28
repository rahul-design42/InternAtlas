import { MOCK_HACKATHONS } from "@/data/mock-hackathons";
import {
  Hackathon,
  HackathonFilterState,
  HackathonSortOption,
} from "@/types/hackathon";

export interface HackathonFilterMetadata {
  categories: string[];
  modes: string[];
  locations: string[];
  eligibilities: string[];
  totalCount: number;
}

/**
 * Service abstraction for Hackathons.
 * Decouples the UI components from direct data access so that mock data can
 * seamlessly be swapped with Express/API backend calls in the future.
 */
class HackathonService {
  /**
   * Synchronous filter and sort helper for client components.
   */
  filterAndSort(
    items: Hackathon[],
    filters?: Partial<HackathonFilterState>,
    sort: HackathonSortOption = "newest"
  ): Hackathon[] {
    let results = [...items];

    if (!filters) {
      return this.sortHackathons(results, sort);
    }

    // Search query across title, organizer, category, location, tags, and technologies
    if (filters.search && filters.search.trim() !== "") {
      const q = filters.search.trim().toLowerCase();
      results = results.filter((hack) => {
        return (
          hack.title.toLowerCase().includes(q) ||
          hack.organizerName.toLowerCase().includes(q) ||
          hack.category.toLowerCase().includes(q) ||
          (hack.location && hack.location.toLowerCase().includes(q)) ||
          hack.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          hack.technologies.some((tech) => tech.toLowerCase().includes(q))
        );
      });
    }

    // Category filter
    if (filters.category && filters.category !== "All") {
      results = results.filter(
        (hack) => hack.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    // Mode filter (Online, Offline, Hybrid)
    if (filters.mode && filters.mode !== "All") {
      results = results.filter(
        (hack) => hack.mode.toLowerCase() === filters.mode!.toLowerCase()
      );
    }

    // Location filter
    if (filters.location && filters.location !== "All") {
      results = results.filter(
        (hack) =>
          hack.location &&
          hack.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Eligibility filter
    if (filters.eligibility && filters.eligibility !== "All") {
      results = results.filter((hack) =>
        hack.eligibility
          .toLowerCase()
          .includes(filters.eligibility!.toLowerCase())
      );
    }

    // Fee type filter (all, free, paid)
    if (filters.feeType && filters.feeType !== "all") {
      if (filters.feeType === "free") {
        results = results.filter((hack) => hack.isFree);
      } else if (filters.feeType === "paid") {
        results = results.filter((hack) => !hack.isFree);
      }
    }

    // Status filter
    if (filters.status && filters.status !== "All") {
      results = results.filter(
        (hack) => hack.status.toLowerCase() === filters.status!.toLowerCase()
      );
    }

    return this.sortHackathons(results, sort);
  }

  /**
   * Retrieves all hackathons or applies filtering, searching, and sorting.
   */
  async getHackathons(
    filters?: Partial<HackathonFilterState>,
    sort: HackathonSortOption = "newest"
  ): Promise<Hackathon[]> {
    return this.filterAndSort(MOCK_HACKATHONS, filters, sort);
  }

  /**
   * Retrieves a single hackathon by its unique slug.
   */
  async getHackathonBySlug(slug: string): Promise<Hackathon | null> {
    const normalizedSlug = slug.toLowerCase().trim();
    const found = MOCK_HACKATHONS.find(
      (h) => h.slug.toLowerCase() === normalizedSlug
    );
    return found || null;
  }

  /**
   * Sorts an array of hackathons according to the specified sort criteria.
   */
  sortHackathons(
    hackathons: Hackathon[],
    sort: HackathonSortOption
  ): Hackathon[] {
    const list = [...hackathons];

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
  async getFilterMetadata(): Promise<HackathonFilterMetadata> {
    const categories = Array.from(
      new Set(MOCK_HACKATHONS.map((h) => h.category))
    ).sort();

    const modes = ["Online", "Offline", "Hybrid"];

    const locations = Array.from(
      new Set(
        MOCK_HACKATHONS.map((h) => h.location).filter(Boolean) as string[]
      )
    ).sort();

    const eligibilities = [
      "All Students",
      "Engineering",
      "Polytechnic",
      "Freshers",
      "Open to All",
    ];

    return {
      categories,
      modes,
      locations,
      eligibilities,
      totalCount: MOCK_HACKATHONS.length,
    };
  }
}

export const hackathonService = new HackathonService();
