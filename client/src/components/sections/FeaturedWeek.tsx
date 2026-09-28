import { Link } from "@/lib/next-polyfills";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURED = [
  { id: "f1", type: "National Competition", title: "Tech for Bharat Challenge 2026", desc: "Innovate. Solve. Create real impact.", bg: "from-blue-900 to-slate-900", accent: "bg-blue-600/20" },
  { id: "f2", type: "Contest", title: "Creative Minds Contest", desc: "Showcase your creativity to the nation.", bg: "from-slate-800 to-[#0F172A]", accent: "bg-teal-500/10" },
  { id: "f3", type: "Event", title: "Future Leaders Summit", desc: "Learn. Network. Get inspired.", bg: "from-indigo-900 to-[#0B1120]", accent: "bg-indigo-500/20" },
  { id: "f4", type: "Hackathon", title: "Build with Purpose Hackathon", desc: "Ideas today. Impact tomorrow.", bg: "from-[#1e1b4b] to-[#0f172a]", accent: "bg-pink-500/20" },
];

export function FeaturedWeek() {
  return (
    <section className="bg-white py-12" aria-label="Featured this week">
      <div className="mx-auto max-w-[1400px] px-6">
        
        {/* Section Header */}
        <div className="mb-6 flex items-end justify-between">
          <div className="flex items-baseline gap-3">
            <h2 className="text-[28px] md:text-[32px] tracking-tight font-extrabold text-primary">Featured this week</h2>
            <p className="hidden text-[14px] text-text-secondary sm:block">Curated opportunities, events and stories — handpicked for you.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted hover:border-cyan-light hover:bg-background transition-colors"><ArrowLeft size={14} /></button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-primary hover:border-cyan-light hover:bg-background transition-colors"><ArrowRight size={14} /></button>
            </div>
            <Link href="#featured" className="group flex items-center gap-1 text-[13px] font-semibold text-blue hover:text-blue-hover">
              View all <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Horizontal Card List */}
        <div className="flex gap-5 overflow-x-auto -mt-4 py-4 scrollbar-none snap-x snap-mandatory">
          {FEATURED.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group relative flex h-[280px] min-w-[300px] max-w-[320px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[24px] bg-gradient-to-br p-6 shadow-card transition-transform hover:-translate-y-1 hover:shadow-hover border border-border/10",
                item.bg
              )}
            >
              {/* Abstract blob for styling */}
              <div className={cn("absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125", item.accent)} />
              <div className={cn("absolute -bottom-10 -right-10 h-32 w-32 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-150", item.accent)} />
              
              <div className="relative z-10 flex flex-col gap-4">
                <span className="w-max rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-border backdrop-blur-sm">
                  {item.type}
                </span>
                <h3 className="text-2xl font-bold leading-tight text-white">{item.title}</h3>
              </div>

              <div className="relative z-10 mt-auto flex items-end justify-between">
                <p className="text-[13px] font-medium text-border max-w-[180px] leading-snug">{item.desc}</p>
                <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-primary transition-transform group-hover:scale-110">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
