import { Link } from "@/lib/next-polyfills";
import { ArrowRight } from "lucide-react";
import { ClosingCard } from "@/components/ui/ClosingCard";
import { AnimateInView } from "@/components/ui/AnimateInView";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Opportunity } from "@/lib/types";

interface ClosingSoonProps {
  opportunities: Opportunity[];
}

export function ClosingSoon({ opportunities }: ClosingSoonProps) {
  return (
    <section className="bg-white py-20" aria-label="Closing soon opportunities">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="Hurry Up" urgentEyebrow title="Closing soon" subtitle="Don't miss these opportunities."
          action={
            <Link href="#closing" className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue transition-all hover:text-blue-hover">
              View all <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />
        <div role="list" aria-label="Closing soon opportunity cards" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {opportunities.map((opp, i) => (
            <AnimateInView key={opp.id} delay={i * 80}>
              <ClosingCard opportunity={opp} />
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  );
}
