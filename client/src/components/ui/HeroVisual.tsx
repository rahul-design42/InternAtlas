

import { cn } from "@/lib/utils";

const CustomIcons = {
  AI: () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="16" width="3" height="4" fill="var(--color-blue)" />
      <rect x="8" y="10" width="3" height="10" fill="var(--color-blue)" />
      <rect x="13" y="13" width="3" height="7" fill="var(--color-blue)" />
      <rect x="18" y="6" width="3" height="14" fill="var(--color-blue)" />
      <path d="M1 21H23" stroke="var(--color-blue)" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 15L7 9L12 12L19 4" stroke="var(--color-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Business: () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      <path d="M21 8.5c0 1.66-4 3-9 3s-9-1.34-9-3" />
    </svg>
  ),
  Design: () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 18" stroke="var(--color-cyan)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 2L20 18" stroke="var(--color-blue)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M5 16H19" stroke="var(--color-pink)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Little overlapping accents */}
      <circle cx="12" cy="2" r="1.5" fill="var(--color-pink)" />
      <circle cx="4" cy="18" r="1.5" fill="var(--color-blue)" />
      <circle cx="20" cy="18" r="1.5" fill="var(--color-cyan)" />
    </svg>
  ),
  DataScience: () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
      <rect x="15" y="14" width="2" height="2.5" fill="var(--color-primary)" stroke="none" />
    </svg>
  ),
  Product: () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#prodGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <rect x="8" y="13" width="8" height="2" fill="url(#prodGrad)" stroke="none" />
      <rect x="8" y="17" width="4" height="2" fill="url(#prodGrad)" stroke="none" />
      <defs>
        <linearGradient id="prodGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-pink)" />
          <stop offset="100%" stopColor="var(--color-cyan)" />
        </linearGradient>
      </defs>
    </svg>
  ),
  Sales: () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#salesGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <circle cx="12" cy="8" r="2.5" />
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
      <defs>
        <linearGradient id="salesGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-cyan)" />
          <stop offset="100%" stopColor="var(--color-blue)" />
        </linearGradient>
      </defs>
    </svg>
  ),
};

const CARDS = [
  { id: 1, label: "AI & ML", icon: CustomIcons.AI, pos: "top-[5%] left-[38%]" },
  { id: 2, label: "Business", icon: CustomIcons.Business, pos: "top-[5%] right-[10%]" },
  { id: 3, label: "Design", icon: CustomIcons.Design, pos: "top-[42%] left-[15%]" },
  { id: 4, label: "Data Science", icon: CustomIcons.DataScience, pos: "top-[38%] left-[52%] -translate-x-1/2" },
  { id: 5, label: "Product", icon: CustomIcons.Product, pos: "top-[72%] left-[32%]" },
  { id: 6, label: "Sales & Marketing", icon: CustomIcons.Sales, pos: "top-[64%] right-[22%]" },
];

export function HeroVisual() {
  return (
    <div className="relative hidden lg:block h-[180px] w-full" aria-hidden="true">
      
      {/* Decorative text 1 (Top Left) */}
      <div className="absolute top-[12%] left-[-2%] -rotate-6 font-hand text-[20px] text-primary leading-[1.1] z-20">
        Explore <br /> opportunities <br /> in your interest.
        <svg className="absolute -bottom-6 right-[5px] text-cyan" width="20" height="20" viewBox="0 0 100 100" fill="none">
          <path d="M10 10 Q 30 50, 70 80" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M50 85 L 70 80 L 60 65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>

      {/* Decorative text 2 (Bottom Right) */}
      <div className="absolute bottom-[2%] right-[-5%] -rotate-3 font-hand text-[20px] text-primary z-20 leading-[1.1]">
        Skills <br /> today. <br /> Opportunities <br /> tomorrow.
        <svg className="absolute -bottom-4 right-8 lg:right-12 xl:right-16 text-cyan" width="50" height="10" viewBox="0 0 100 20" fill="none">
          <path d="M5 8 Q 45 2, 95 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M20 18 Q 55 12, 85 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Floating Cards */}
      <div className="relative h-full w-full">
        {CARDS.map((card) => (
          <div
            key={card.id}
            className={cn(
              "absolute flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white p-2 border border-border shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-hover hover:border-cyan-light",
              "w-[86px] h-[86px]",
              card.pos
            )}
          >
            <div className="scale-75 origin-center"><card.icon /></div>
            <span className="text-[10px] font-bold text-primary text-center leading-[1.1] whitespace-pre-wrap">{card.label.replace(' & ', ' &\n')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
