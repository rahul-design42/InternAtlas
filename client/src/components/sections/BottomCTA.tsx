import { Link } from "@/lib/next-polyfills";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BottomCTA() {
  return (
    <section
      className="relative w-full overflow-hidden border-t border-[#2a3f6a] bg-[#1a2d53]"
      aria-label="Call to action"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <svg
          className="absolute inset-0 h-full w-full opacity-30 mix-blend-overlay"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="realistic-brick-full"
              width="80"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <rect
                width="80"
                height="40"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
              />
              <line
                x1="40"
                y1="20"
                x2="40"
                y2="40"
                stroke="#000000"
                strokeWidth="2"
              />
              <line
                x1="0"
                y1="20"
                x2="80"
                y2="20"
                stroke="#000000"
                strokeWidth="2"
              />
              <line
                x1="1"
                y1="1"
                x2="79"
                y2="1"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              <line
                x1="1"
                y1="21"
                x2="39"
                y2="21"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              <line
                x1="41"
                y1="21"
                x2="79"
                y2="21"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <rect
            width="100%"
            height="100%"
            fill="url(#realistic-brick-full)"
          />
        </svg>

        <div className="absolute inset-0 bg-gradient-to-r from-[#1a2d53] via-[#1a2d53]/80 to-[#1a2d53]/40" />

        <div className="absolute bottom-0 right-[25%] h-[400px] w-[500px] translate-x-1/2 translate-y-[20%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.25)_0%,transparent_60%)] mix-blend-screen lg:right-[35%]" />
      </div>

      <div className="relative mx-auto flex min-h-[200px] max-w-[1400px] flex-col items-center px-6 md:flex-row">
        {/* Left content */}
        <div className="relative z-10 flex w-full flex-col items-start justify-center py-10 text-left lg:w-[60%] xl:w-[50%]">
          <span className="mb-2 text-[13px] font-bold uppercase tracking-widest text-[#3b82f6]">
            YOUR NEXT CHAPTER STARTS HERE
          </span>

          <h2 className="mb-3 text-[28px] font-bold leading-tight tracking-tight text-white md:text-[34px] lg:text-[38px]">
            Turn your potential <span className="text-cyan-400">into progress.</span>
          </h2>

          <p className="mb-8 max-w-[480px] text-[15px] leading-relaxed text-blue-100/80">
            Join thousands of students discovering opportunities, learning new skills, and building a brighter future.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              asChild
              className="h-11 rounded-full border-none bg-blue-600 px-8 text-[14px] text-white shadow-md hover:bg-blue-700"
            >
              <Link href="/signup">
                Create your account
                <ArrowRight size={16} className="ml-1.5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-white/20 bg-[#0f284e]/40 backdrop-blur-sm px-8 text-[14px] text-white transition-all hover:border-white/40 hover:bg-[#0f284e]/60 hover:text-white"
            >
              <Link href="/employers">For colleges & employers</Link>
            </Button>
          </div>
        </div>

        {/* Doorway graphic */}
        <div className="pointer-events-none absolute bottom-0 right-[15%] hidden h-[280px] w-[180px] items-end justify-center md:flex lg:right-[30%]">
          <div className="relative h-full w-full overflow-hidden rounded-t-[90px] border-x-[14px] border-t-[14px] border-[#0a1835] bg-[#f8fafc] shadow-[0_0_80px_rgba(255,255,255,0.7),inset_0_20px_40px_rgba(0,0,0,0.1)] ring-1 ring-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,rgba(255,255,255,1)_0%,rgba(241,245,249,0.9)_50%,rgba(226,232,240,0.7)_100%)]" />

            <div className="absolute bottom-0 right-[-10px] flex flex-col items-end">
              <div className="relative h-[24px] w-[60px] border-t border-[#e2e8f0] bg-[#f8fafc] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]" />
              <div className="relative h-[24px] w-[90px] border-t border-[#cbd5e1] bg-[#f1f5f9] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]" />
              <div className="relative h-[24px] w-[120px] border-t border-[#94a3b8] bg-[#e2e8f0] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]" />
              <div className="relative h-[24px] w-[150px] border-t border-[#64748b] bg-[#cbd5e1] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]" />
              <div className="relative h-[24px] w-[180px] border-t border-[#475569] bg-[#94a3b8] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]" />
            </div>

            <div className="absolute top-[60%] left-[30%] h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-[25px]" />
          </div>

          <div className="absolute bottom-0 h-[20px] w-[260px] rounded-[100%] bg-white blur-[15px]" />
          <div className="absolute bottom-[-15px] h-[40px] w-[350px] rounded-[100%] bg-blue-400/40 blur-[25px]" />
          <div className="absolute bottom-[-20px] h-[60px] w-[450px] rounded-[100%] bg-blue-600/30 blur-[40px]" />
        </div>

        {/* Right text */}
        <div className="absolute right-0 top-[30%] z-30 hidden -rotate-[6deg] flex-col items-start drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] md:flex lg:-right-4 xl:-right-8">
          <span className="font-hand text-[24px] font-medium leading-tight text-white lg:text-[28px]">
            Curious minds. <br />
            Brighter tomorrows.
          </span>

          <svg
            width="120"
            height="20"
            viewBox="0 0 140 24"
            fill="none"
            className="ml-2 mt-1"
          >
            <path
              d="M5 5 Q 40 0, 130 5"
              stroke="#22d3ee"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M25 15 Q 70 11, 115 15"
              stroke="#22d3ee"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}