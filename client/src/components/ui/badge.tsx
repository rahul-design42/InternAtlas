import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { OpportunityType } from "@/lib/types";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide leading-none",
  {
    variants: {
      variant: {
        internship:  "bg-background text-blue border border-border-light",
        job:         "bg-background text-blue border border-border-light",
        hackathon:   "bg-background text-blue border border-border-light",
        competition: "bg-background text-blue border border-border-light",
        scholarship: "bg-background text-blue border border-border-light",
        event:       "bg-background text-blue border border-border-light",
        contest:     "bg-background text-blue border border-border-light",
        quiz:        "bg-background text-blue border border-border-light",
        workshops:   "bg-background text-blue border border-border-light",
        college_fest:"bg-background text-blue border border-border-light",
        cultural:    "bg-background text-blue border border-border-light",
        default:     "bg-background text-blue border border-border-light",
        highlighted: "bg-pink-soft text-pink border border-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const OPPORTUNITY_LABEL: Record<OpportunityType, string> = {
  internship:  "Internship",
  job:         "Job",
  hackathon:   "Hackathon",
  competition: "Competition",
  scholarship: "Scholarship",
  event:       "Event",
  contest:     "Contest",
  quiz:        "Quiz",
  workshops:   "Workshops",
  college_fest:"College Fest",
  cultural:    "Cultural",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  opportunityType?: OpportunityType;
}

function Badge({ className, variant, opportunityType, children, ...props }: BadgeProps) {
  const resolvedVariant = opportunityType ? (opportunityType as VariantProps<typeof badgeVariants>["variant"]) : variant;
  const label = opportunityType ? OPPORTUNITY_LABEL[opportunityType] : children;
  return (
    <span className={cn(badgeVariants({ variant: resolvedVariant }), className)} {...props}>
      {label}
    </span>
  );
}

export { Badge, badgeVariants };
