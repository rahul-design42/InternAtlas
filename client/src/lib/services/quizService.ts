import { MOCK_QUIZZES } from "@/data/mock-quizzes";
import {
  Quiz,
  QuizFilterState,
  QuizSortOption,
} from "@/types/quiz";

export interface QuizFilterMetadata {
  categories: string[];
  modes: string[];
  locations: string[];
  difficulties: string[];
  eligibilities: string[];
  totalCount: number;
}

/**
 * Service abstraction for Quizzes.
 * Decouples the UI components from direct data access so that mock data can
 * seamlessly be swapped with Express/API backend calls in the future.
 */
class QuizService {
  /**
   * Synchronous filter and sort helper for client components.
   */
  filterAndSort(
    items: Quiz[],
    filters?: Partial<QuizFilterState>,
    sort: QuizSortOption = "newest"
  ): Quiz[] {
    let results = [...items];

    if (!filters) {
      return this.sortQuizzes(results, sort);
    }

    // Search query across title, organizer, category, location, tags, technologies, and difficulty
    if (filters.search && filters.search.trim() !== "") {
      const q = filters.search.trim().toLowerCase();
      results = results.filter((quiz) => {
        return (
          quiz.title.toLowerCase().includes(q) ||
          quiz.organizerName.toLowerCase().includes(q) ||
          quiz.category.toLowerCase().includes(q) ||
          (quiz.location && quiz.location.toLowerCase().includes(q)) ||
          quiz.difficulty.toLowerCase().includes(q) ||
          quiz.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          (quiz.technologies &&
            quiz.technologies.some((tech) => tech.toLowerCase().includes(q)))
        );
      });
    }

    // Category filter
    if (filters.category && filters.category !== "All") {
      results = results.filter(
        (quiz) => quiz.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    // Mode filter (Online, Offline, Hybrid)
    if (filters.mode && filters.mode !== "All") {
      results = results.filter(
        (quiz) => quiz.mode.toLowerCase() === filters.mode!.toLowerCase()
      );
    }

    // Location filter
    if (filters.location && filters.location !== "All") {
      results = results.filter(
        (quiz) =>
          quiz.location &&
          quiz.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Difficulty filter
    if (filters.difficulty && filters.difficulty !== "All") {
      results = results.filter(
        (quiz) => quiz.difficulty.toLowerCase() === filters.difficulty!.toLowerCase()
      );
    }

    // Eligibility filter
    if (filters.eligibility && filters.eligibility !== "All") {
      results = results.filter((quiz) =>
        quiz.eligibility
          .toLowerCase()
          .includes(filters.eligibility!.toLowerCase())
      );
    }

    // Fee type filter (all, free, paid)
    if (filters.feeType && filters.feeType !== "all") {
      if (filters.feeType === "free") {
        results = results.filter((quiz) => quiz.isFree);
      } else if (filters.feeType === "paid") {
        results = results.filter((quiz) => !quiz.isFree);
      }
    }

    // Status filter
    if (filters.status && filters.status !== "All") {
      results = results.filter(
        (quiz) => quiz.status.toLowerCase() === filters.status!.toLowerCase()
      );
    }

    return this.sortQuizzes(results, sort);
  }

  /**
   * Retrieves all quizzes or applies filtering, searching, and sorting.
   */
  async getQuizzes(
    filters?: Partial<QuizFilterState>,
    sort: QuizSortOption = "newest"
  ): Promise<Quiz[]> {
    return this.filterAndSort(MOCK_QUIZZES, filters, sort);
  }

  /**
   * Retrieves a single quiz by its unique slug.
   */
  async getQuizBySlug(slug: string): Promise<Quiz | null> {
    const normalizedSlug = slug.toLowerCase().trim();
    const found = MOCK_QUIZZES.find(
      (q) => q.slug.toLowerCase() === normalizedSlug
    );
    return found || null;
  }

  /**
   * Sorts an array of quizzes according to the specified sort criteria immutably.
   */
  sortQuizzes(
    quizzes: Quiz[],
    sort: QuizSortOption
  ): Quiz[] {
    const list = [...quizzes];

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
  async getFilterMetadata(): Promise<QuizFilterMetadata> {
    const categories = Array.from(
      new Set(MOCK_QUIZZES.map((q) => q.category))
    ).sort();

    const modes = ["Online", "Offline", "Hybrid"];

    const locations = Array.from(
      new Set(
        MOCK_QUIZZES.map((q) => q.location).filter(Boolean) as string[]
      )
    ).sort();

    const difficulties = ["Beginner", "Intermediate", "Advanced"];

    const eligibilities = Array.from(
      new Set(MOCK_QUIZZES.map((q) => q.eligibility))
    ).sort();

    return {
      categories,
      modes,
      locations,
      difficulties,
      eligibilities,
      totalCount: MOCK_QUIZZES.length,
    };
  }
}

export const quizService = new QuizService();
