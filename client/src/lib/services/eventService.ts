import { MOCK_EVENTS } from "@/data/mock-events";
import {
  Event,
  EventFilterState,
  EventSortOption,
} from "@/types/event";

export interface EventFilterMetadata {
  categories: string[];
  eventTypes: string[];
  modes: string[];
  locations: string[];
  eligibilities: string[];
  totalCount: number;
}

/**
 * Service abstraction for Events.
 * Decouples the UI components from direct data access so that mock data can
 * seamlessly be swapped with Express/API backend calls in the future.
 */
class EventService {
  /**
   * Synchronous filter and sort helper for client components.
   */
  filterAndSort(
    items: Event[],
    filters?: Partial<EventFilterState>,
    sort: EventSortOption = "newest"
  ): Event[] {
    let results = [...items];

    if (!filters) {
      return this.sortEvents(results, sort);
    }

    // Search query across title, organizer, category, eventType, location, venue, tags, and technologies
    if (filters.search && filters.search.trim() !== "") {
      const q = filters.search.trim().toLowerCase();
      results = results.filter((event) => {
        return (
          event.title.toLowerCase().includes(q) ||
          event.organizerName.toLowerCase().includes(q) ||
          event.category.toLowerCase().includes(q) ||
          event.eventType.toLowerCase().includes(q) ||
          (event.location && event.location.toLowerCase().includes(q)) ||
          (event.venue && event.venue.toLowerCase().includes(q)) ||
          event.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          (event.technologies &&
            event.technologies.some((tech) => tech.toLowerCase().includes(q)))
        );
      });
    }

    // Event Type filter
    if (filters.eventType && filters.eventType !== "All") {
      results = results.filter(
        (event) => event.eventType.toLowerCase() === filters.eventType!.toLowerCase()
      );
    }

    // Category filter
    if (filters.category && filters.category !== "All") {
      results = results.filter(
        (event) => event.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    // Mode filter (Online, Offline, Hybrid)
    if (filters.mode && filters.mode !== "All") {
      results = results.filter(
        (event) => event.mode.toLowerCase() === filters.mode!.toLowerCase()
      );
    }

    // Location filter
    if (filters.location && filters.location !== "All") {
      results = results.filter(
        (event) =>
          event.location &&
          event.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Eligibility filter
    if (filters.eligibility && filters.eligibility !== "All") {
      results = results.filter((event) =>
        event.eligibility
          .toLowerCase()
          .includes(filters.eligibility!.toLowerCase())
      );
    }

    // Fee type filter (all, free, paid)
    if (filters.feeType && filters.feeType !== "all") {
      if (filters.feeType === "free") {
        results = results.filter((event) => event.isFree);
      } else if (filters.feeType === "paid") {
        results = results.filter((event) => !event.isFree);
      }
    }

    // Status filter
    if (filters.status && filters.status !== "All") {
      results = results.filter(
        (event) => event.status.toLowerCase() === filters.status!.toLowerCase()
      );
    }

    return this.sortEvents(results, sort);
  }

  /**
   * Retrieves all events or applies filtering, searching, and sorting.
   */
  async getEvents(
    filters?: Partial<EventFilterState>,
    sort: EventSortOption = "newest"
  ): Promise<Event[]> {
    return this.filterAndSort(MOCK_EVENTS, filters, sort);
  }

  /**
   * Retrieves a single event by its unique slug.
   */
  async getEventBySlug(slug: string): Promise<Event | null> {
    const normalizedSlug = slug.toLowerCase().trim();
    const found = MOCK_EVENTS.find(
      (e) => e.slug.toLowerCase() === normalizedSlug
    );
    return found || null;
  }

  /**
   * Sorts an array of events according to the specified sort criteria immutably.
   */
  sortEvents(
    events: Event[],
    sort: EventSortOption
  ): Event[] {
    const list = [...events];

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
      case "event_date_soon":
        return list.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      case "most_registered":
        return list.sort((a, b) => b.participantCount - a.participantCount);
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
  async getFilterMetadata(): Promise<EventFilterMetadata> {
    const categories = Array.from(
      new Set(MOCK_EVENTS.map((e) => e.category))
    ).sort();

    const eventTypes = Array.from(
      new Set(MOCK_EVENTS.map((e) => e.eventType))
    ).sort();

    const modes = ["Online", "Offline", "Hybrid"];

    const locations = Array.from(
      new Set(
        MOCK_EVENTS.map((e) => e.location).filter(Boolean) as string[]
      )
    ).sort();

    const eligibilities = Array.from(
      new Set(MOCK_EVENTS.map((e) => e.eligibility))
    ).sort();

    return {
      categories,
      eventTypes,
      modes,
      locations,
      eligibilities,
      totalCount: MOCK_EVENTS.length,
    };
  }
}

export const eventService = new EventService();
