import { Link } from "@/lib/next-polyfills";
import { ArrowRight } from "lucide-react";

import { HeroVisual } from "@/components/ui/HeroVisual";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(135deg,#FFFFFF_0%,#EFF1F9_68%,#FFE2EB_100%)] pb-2 pt-0 md:pb-2 md:pt-0"
      aria-label="Hero section"
    >
      <div className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-surface/50 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-[600px] w-[600px] translate-x-1/3 rounded-full bg-pink-soft/50 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="z-10 flex flex-col">
            <span className="mb-1 text-[12px] font-bold uppercase tracking-widest text-blue sm:text-[13px]">
              FOR INDIA&apos;S NEXT GENERATION
            </span>

            <h1 className="mb-2 text-[clamp(28px,5vw,52px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-primary">
              Real <br className="hidden sm:block" />
              opportunities. <br />
              <span className="font-serif font-normal italic text-editorial-red">
                A brighter you.
              </span>
            </h1>

            <p className="mb-4 max-w-[460px] text-[13px] leading-tight text-text-secondary md:text-[14px]">
              Internships, jobs, competitions, scholarships, workshops, college festivals and more &mdash; all in one place for India&apos;s students.
            </p>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="h-10 w-full px-6 text-[14px] sm:w-auto rounded-full"
              >
                <Link href="/signup">
                  Get started for free
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-10 w-full px-6 text-[14px] sm:w-auto rounded-full"
              >
                <Link href="/opportunities">Explore opportunities</Link>
              </Button>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex -space-x-2">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Student" className="w-8 h-8 rounded-full border-2 border-white object-cover bg-gray-200" />
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Student" className="w-8 h-8 rounded-full border-2 border-white object-cover bg-gray-200" />
                <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="Student" className="w-8 h-8 rounded-full border-2 border-white object-cover bg-gray-200" />
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Student" className="w-8 h-8 rounded-full border-2 border-white object-cover bg-gray-200" />
              </div>
              <div className="text-[12px] leading-tight">
                <span className="font-bold text-primary block">60,000+ students</span>
                <span className="text-text-secondary">already exploring opportunities on InternAtlas</span>
              </div>
            </div>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}