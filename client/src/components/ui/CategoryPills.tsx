

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { OpportunityType } from "@/lib/types";

type PillItem = { id: string; label: string; type: OpportunityType | "all" };

const PILLS: PillItem[] = [
  { id: "all",          label: "All",          type: "all"         },
  { id: "internships",  label: "Internships",  type: "internship"  },
  { id: "jobs",         label: "Jobs",         type: "job"         },
  { id: "hackathons",   label: "Hackathons",   type: "hackathon"   },
  { id: "competitions", label: "Competitions", type: "competition" },
  { id: "scholarships", label: "Scholarships", type: "scholarship" },
  { id: "events",       label: "Events",       type: "event"       },
];

interface CategoryPillsProps {
  className?: string;
  onSelect?: (type: OpportunityType | "all") => void;
}

export function CategoryPills({ className, onSelect }: CategoryPillsProps) {
  const [active, setActive] = useState<string>("all");

  const handleSelect = (pill: PillItem) => {
    setActive(pill.id);
    onSelect?.(pill.type);
  };

  return (
    <div role="group" aria-label="Browse by category" className={cn("flex gap-2 overflow-x-auto scrollbar-none pb-1", className)}>
      {PILLS.map((pill) => {
        const isActive = active === pill.id;
        return (
          <button
            key={pill.id} onClick={() => handleSelect(pill)} aria-pressed={isActive}
            className={cn(
              "flex-shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-1",
              isActive ? "border-blue bg-blue text-white shadow-sm" : "border-border bg-white text-text-secondary hover:border-blue-hover hover:text-blue-hover hover:bg-background"
            )}
          >
            {pill.label}
          </button>
        );
      })}
    </div>
  );
}
