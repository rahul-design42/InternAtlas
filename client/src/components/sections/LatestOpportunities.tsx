import { Link } from "@/lib/next-polyfills";
import { ArrowRight } from "lucide-react";
import { OpportunityCard } from "@/components/ui/OpportunityCard";
import { AnimateInView } from "@/components/ui/AnimateInView";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Opportunity } from "@/lib/types";

interface LatestOpportunitiesProps {
  opportunities: Opportunity[];
}

export function LatestOpportunities({ opportunities }: LatestOpportunitiesProps) {
  return (
    <section id="explore" className="bg-white py-20" aria-label="Latest opportunities">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="Fresh Opportunities"
          title="Latest opportunities"
          subtitle="Handpicked from companies, organizations and campuses."
          action={
            <Link href="#all" className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue transition-all hover:text-blue-hover">
              View all <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />
        <div role="list" aria-label="Opportunity cards" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {opportunities.map((opp, i) => (
            <AnimateInView key={opp.id} delay={i * 80}>
              <OpportunityCard opportunity={opp} />
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  );
}
