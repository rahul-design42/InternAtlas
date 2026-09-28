import { Link } from "@/lib/next-polyfills";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HackathonsBanner() {
  return (
    <section
      id="hackathons"
      className="scroll-mt-24 bg-transparent pt-0 pb-2 lg:pb-3"
      aria-label="Hackathons"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[20px] bg-[linear-gradient(to_right,var(--color-blue-surface),var(--color-white))] p-6 lg:py-5 lg:px-10 lg:flex-row xl:px-12 border border-border shadow-card">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/30 blur-[60px]" />

            <div className="absolute left-[40%] top-[10%] opacity-10">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </div>
          </div>

          {/* Left */}
          <div className="relative z-10 flex w-full max-w-[360px] flex-col justify-center">
            <span className="mb-3 text-[18px] font-bold uppercase tracking-widest text-cyan">
              HACKATHONS
            </span>

            <h2 className="mb-4 text-[34px] font-extrabold leading-[1.1] tracking-tight text-primary md:text-[38px]">
              Build today <br />
              for a brighter{" "}
              <span className="font-serif italic font-normal text-editorial-red">
                tomorrow.
              </span>
            </h2>

            <p className="mb-8 text-[14.5px] leading-relaxed text-text-secondary max-w-[340px]">
              Turn your ideas into impact. Join hackathons, work with amazing
              peers, and solve real-world problems.
            </p>

            <Button asChild className="w-max px-6 h-10 text-[13px] rounded-full">
              <Link href="/hackathons">
                Explore hackathons
                <ArrowRight size={14} className="ml-1.5" />
              </Link>
            </Button>
          </div>

          {/* Middle */}
          <div className="relative z-10 hidden w-[300px] shrink-0 lg:flex items-center justify-center">
            
            {/* The Lightbulb */}
            <div className="absolute top-[-20px] left-1/2 z-30 -translate-x-1/2 flex flex-col items-center">
              {/* Glowing Aura */}
              <div className="absolute top-1/2 left-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[20px]" />
              
              {/* Bulb Glass */}
              <div className="relative z-10 h-[70px] w-[46px] rounded-t-[40px] rounded-b-[24px] bg-gradient-to-b from-white to-blue-50 shadow-[0_0_20px_rgba(255,255,255,0.8),inset_0_0_15px_rgba(59,130,246,0.15)] border border-white flex justify-center items-start pt-2">
                 {/* Internal filament/reflection hint */}
                 <div className="h-6 w-3 rounded-full border-[1.5px] border-blue-200/50" />
              </div>
              
              {/* Bulb Base */}
              <div className="relative z-10 mt-[-2px] flex flex-col items-center">
                <div className="h-3 w-6 bg-[#1a2332] rounded-t-[2px]" />
                <div className="h-2 w-4 bg-[#0f172a] rounded-b-[6px]" />
              </div>
            </div>

            {/* The Laptop */}
            <div className="relative mt-20 z-10 flex flex-col items-center">
              {/* Screen */}
              <div className="h-[110px] w-[170px] rounded-t-[8px] border-[3px] border-[#cbd5e1] bg-white relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]">
                 {/* Subtle screen reflection */}
                 <div className="absolute right-[-20px] top-[-20px] h-[150px] w-[50px] rotate-45 bg-white/40 blur-[1px]" />
              </div>
              
              {/* Base / Keyboard part */}
              <div className="h-[6px] w-[210px] rounded-t-sm rounded-b-[6px] bg-[#94a3b8] shadow-lg relative">
                 {/* Trackpad notch */}
                 <div className="absolute top-0 left-1/2 h-[2px] w-[30px] -translate-x-1/2 bg-[#cbd5e1] rounded-b-sm" />
              </div>
            </div>

            {/* Sticky Notes */}
            <div className="absolute left-[-20px] top-[10px] z-40 rotate-[-12deg] rounded-[8px] bg-white px-3 py-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-gray-200">
              <span className="font-hand text-blue-800 text-[18px] font-medium leading-none tracking-tight">
                Innovate
              </span>
              {/* Arrow pointing up towards bulb */}
              <div className="absolute right-[-20px] top-[-20px] text-blue-200/70 rotate-[20deg]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
              </div>
            </div>

            <div className="absolute right-[0px] top-[40px] z-40 rotate-[6deg] rounded-[8px] bg-white px-3 py-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-gray-200">
              <span className="font-hand text-blue-800 text-[18px] font-medium leading-none tracking-tight">
                Collaborate
              </span>
            </div>

            <div className="absolute right-[10px] bottom-[10px] z-40 rotate-[-4deg] rounded-[8px] bg-white px-3 py-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-gray-200">
              <span className="font-hand text-blue-800 text-[18px] font-medium leading-tight block text-center tracking-tight">
                Create <br /> Impact
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="relative z-10 mt-10 flex w-full flex-col justify-center lg:mt-0 lg:w-[420px] xl:w-[460px]">
            <div className="mb-4 flex items-center justify-end gap-4">
              <Link
                href="/hackathons"
                className="text-primary font-bold text-[13px] flex items-center gap-1 cursor-pointer hover:text-blue transition-colors"
              >
                View all hackathons
                <ArrowRight size={14} className="mt-0.5" />
              </Link>

              <div className="flex gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-text-secondary hover:bg-background transition-colors shadow-sm">
                  <ChevronLeft size={16} />
                </button>

                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-text-secondary hover:bg-background transition-colors shadow-sm">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {/* SIH */}
                <Link
                  href="/hackathons"
                  className="flex flex-col justify-between rounded-2xl bg-white p-4 shadow-card border border-border flex-[1.2] cursor-pointer hover:shadow-hover hover:border-cyan-light transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3 relative">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                          fill="#4ADE80"
                        />
                        <path
                          d="M12 6v6l4.25 2.5"
                          stroke="#F97316"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>

                    <div className="flex flex-col pr-4">
                      <span className="text-[13px] font-bold text-text-primary leading-tight mb-0.5">
                        Smart India Hackathon
                      </span>

                      <span className="text-[11px] text-text-secondary mb-0.5">
                        Government of India
                      </span>

                      <span className="text-[11px] text-text-secondary">
                        Sep 19 – 23, 2025
                      </span>
                    </div>

                    <ChevronRight
                      size={14}
                      className="text-blue absolute right-0 top-1"
                    />
                  </div>

                  <div className="flex gap-1.5 mt-3">
                    <span className="rounded-full border border-border-light bg-background px-2 py-0.5 text-[10px] font-semibold text-blue">
                      Hardware
                    </span>

                    <span className="rounded-full border border-border-light bg-background px-2 py-0.5 text-[10px] font-semibold text-blue">
                      Software
                    </span>
                  </div>
                </Link>

                {/* Microsoft */}
                <Link
                  href="/hackathons"
                  className="flex flex-col justify-between rounded-2xl bg-white p-4 shadow-card border border-border flex-1 cursor-pointer hover:shadow-hover hover:border-cyan-light transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3 relative">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                      <span className="text-[20px] font-bold text-[#00A4EF]">
                        M
                      </span>
                    </div>

                    <div className="flex flex-col pr-4">
                      <span className="text-[13px] font-bold text-text-primary leading-tight mb-0.5">
                        Microsoft Build
                      </span>

                      <span className="text-[11px] text-text-secondary mb-0.5">
                        Microsoft
                      </span>

                      <span className="text-[11px] text-text-secondary">
                        Oct 10 – 12, 2025
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-3">
                    <div className="flex gap-1.5">
                      <span className="rounded-full border border-border-light bg-background px-2 py-0.5 text-[10px] font-semibold text-blue">
                        AI/ML
                      </span>

                      <span className="rounded-full border border-border-light bg-background px-2 py-0.5 text-[10px] font-semibold text-blue">
                        Cloud
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Devfolio */}
              <Link
                href="/hackathons"
                className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-card border border-border w-full cursor-pointer hover:shadow-hover hover:border-cyan-light transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6366F1]">
                    <span className="text-white font-bold text-[16px]">D</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-text-primary leading-tight mb-0.5">
                      Devfolio Hackathon
                    </span>

                    <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                      <span>Devfolio</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>Oct 17 – 19, 2025</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex gap-1.5">
                    <span className="rounded-full border border-border-light bg-background px-2 py-1 text-[11px] font-semibold text-blue">
                      Web3
                    </span>

                    <span className="rounded-full border border-border-light bg-background px-2 py-1 text-[11px] font-semibold text-blue">
                      Product
                    </span>
                  </div>

                  <ChevronRight size={16} className="text-blue" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}