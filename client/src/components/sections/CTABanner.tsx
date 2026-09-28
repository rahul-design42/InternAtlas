import { ArrowRight } from "lucide-react";

export function CTABanner() {
  return (
    <section className="bg-white py-12 pb-24" aria-label="Call to action">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="flex flex-col items-center justify-between gap-8 rounded-[24px] bg-deep-navy p-10 md:flex-row lg:p-14">
          
          {/* Text content */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold tracking-[0.15em] text-cyan">
              FOR EMPLOYERS • FOR COLLEGES
            </span>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">
          Let&apos;s create more opportunities for India.
            </h2>
            <p className="text-[15px] font-medium text-border">
              Hire talent. Host competitions. Engage with the next generation.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 w-full shrink-0 sm:w-auto sm:flex-row">
            <button className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue px-8 text-[15px] font-semibold text-white transition-colors hover:bg-blue-hover sm:w-auto">
              For Employers
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button className="group flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-8 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 hover:border-white/40 sm:w-auto">
              For Colleges
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
}
