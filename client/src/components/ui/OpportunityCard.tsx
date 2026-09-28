// icons removed
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/lib/types";

interface OpportunityCardProps {
  opportunity: Opportunity;
  className?: string;
}

export function OpportunityCard({ opportunity, className }: OpportunityCardProps) {
  const { title, organization, location, badges, timeLabel, logoVariant } = opportunity;

  // Generic logo colored backgrounds
  const getLogoBg = (variant: string) => {
    if (variant.includes("yellow")) return "bg-pink text-white";
    if (variant.includes("orange")) return "bg-cyan text-primary";
    if (variant.includes("blue")) return "bg-blue text-white";
    if (variant.includes("red")) return "bg-editorial-red text-white";
    if (variant.includes("green")) return "bg-cyan-light text-primary";
    if (variant.includes("purple") || variant.includes("pink")) return "bg-pink-soft text-pink";
    return "bg-deep-navy text-white";
  };

  // Real logos for known companies
  const renderLogo = () => {
    const org = organization.toLowerCase();

    if (org === "google") {
      return (
        <svg viewBox="0 0 24 24" className="h-10 w-10">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      );
    }
    
    if (org === "microsoft") {
      return (
        <svg viewBox="0 0 24 24" className="h-9 w-9">
          <path fill="#F25022" d="M1 1h10.5v10.5H1z"/><path fill="#7FBA00" d="M12.5 1H23v10.5H12.5z"/><path fill="#00A4EF" d="M1 12.5h10.5V23H1z"/><path fill="#FFB900" d="M12.5 12.5H23V23H12.5z"/>
        </svg>
      );
    }

    if (org === "airbnb") {
      return (
        <svg viewBox="0 0 24 24" fill="#FF5A5F" className="h-10 w-10">
          <path d="M12.015 1.636C8.826 1.636 1.5 6.726 1.5 12.871c0 3.36 2.769 6.088 6.179 6.088 1.933 0 3.738-1.071 4.793-2.868l-.837-.872c-.808 1.41-2.26 2.23-3.956 2.23-2.671 0-4.839-2.128-4.839-4.747 0-4.664 5.922-8.583 9.175-8.583 3.251 0 9.173 3.918 9.173 8.583 0 2.62-2.169 4.747-4.84 4.747-1.696 0-3.148-.82-3.956-2.23l-.838.872c1.056 1.797 2.861 2.868 4.794 2.868 3.409 0 6.178-2.729 6.178-6.088 0-6.145-7.324-11.235-10.511-11.235z"/>
          <path fill="white" d="M12.015 6.375c-1.393 0-2.617 1.258-2.617 2.87 0 1.611 1.224 2.871 2.617 2.871 1.392 0 2.616-1.26 2.616-2.871 0-1.612-1.224-2.87-2.616-2.87z"/>
        </svg>
      );
    }

    if (org === "swiggy") {
      return (
        <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#FC8019] overflow-hidden">
          <svg viewBox="0 0 40 40" className="h-8 w-8">
            <path fill="white" d="M20 2C10 2 2 10 2 20c0 11.5 16 19 17.2 19.8.5.3 1.1.3 1.6 0C22 39 38 31.5 38 20 38 10 30 2 20 2zm-2 23c-3 0-5-2.2-5-5s2-5 5-5h1c.6 0 1-.4 1-1s-.4-1-1-1h-4v-2h4c2.8 0 5 2.2 5 5s-2.2 5-5 5h-1c-.6 0-1 .4-1 1s.4 1 1 1h4v2h-4c-2.8 0-5-2.2-5-5v-1h-1z"/>
          </svg>
        </div>
      );
    }

    if (org === "zomato") {
      return (
        <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#E23744]">
          <span className="font-bold italic text-white text-[12px] tracking-tight">zomato</span>
        </div>
      );
    }
    
    if (org === "flipkart") {
      return (
        <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#FFC200]">
          <svg viewBox="0 0 40 40" className="h-7 w-7">
            <path fill="#2874F0" d="M12.5 7.5L25 5l-2.5 10-10 2.5z" />
            <path fill="#2874F0" d="M27.5 17.5L22.5 35l-7.5-2.5 5-15z" />
            <circle cx="15" cy="35" r="3" fill="#2874F0" />
            <circle cx="27" cy="35" r="3" fill="#2874F0" />
            <path fill="#2874F0" d="M5 10h10v5H5z" />
          </svg>
        </div>
      );
    }

    if (org === "deloitte") {
      return (
        <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-black">
          <span className="font-extrabold text-white text-[9px] tracking-tight">Deloitte<span className="text-[#86BC25]">.</span></span>
        </div>
      );
    }

    if (org === "razorpay") {
      return (
        <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#02042B]">
          <svg viewBox="0 0 24 24" className="h-6 w-6">
            <path fill="#3395FF" d="M5 21h14L10 3H5l5 9-5 9z" />
            <path fill="#3395FF" d="M14.5 12l-2.5 4.5h5l2.5-4.5h-5z" />
          </svg>
        </div>
      );
    }

    if (org === "jio") {
      return (
        <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-white border border-slate-200 shadow-sm p-[3px]">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0F3082]">
             <span className="font-bold text-[#E31837] text-[13px]">Jio</span>
          </div>
        </div>
      );
    }

    if (org === "oyo") {
      return (
        <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#EC1F27]">
           <span className="font-extrabold text-white text-[16px] tracking-tighter">OYO</span>
        </div>
      );
    }

    // Generic fallback for unknown companies
    const bg = getLogoBg(logoVariant);
    return (
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl font-bold text-lg", bg)}>
        {logoVariant.split("-")[1]?.charAt(0).toUpperCase() || title.charAt(0)}
      </div>
    );
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-border bg-white p-4 shadow-card",
        "transition-all duration-200 cursor-pointer",
        "hover:-translate-y-1 hover:border-cyan-light hover:shadow-hover",
        className
      )}
      tabIndex={0}
    >
      <div className="flex flex-col gap-3">
        {/* Logo */}
        <div className="flex h-10 w-10 items-center justify-center">
          {renderLogo()}
        </div>

        {/* Title & Org */}
        <div className="flex flex-col mt-1">
          <h3 className="text-[15px] font-bold leading-snug text-text-primary">{title}</h3>
          <p className="mt-0.5 text-[12.5px] font-medium text-text-secondary">{organization}</p>
          <div className="flex items-center gap-1.5 mt-1.5 text-text-secondary">
            <span className="material-symbols-outlined text-[13px]">location_on</span>
            <span className="text-[11.5px] font-medium">{location}</span>
          </div>
        </div>

        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {badges.map((b) => (
              <span key={b} className="rounded-full border border-border-light bg-background px-2.5 py-0.5 text-[10px] font-bold text-blue">
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-border-light pt-3">
        <span className="text-[11.5px] font-semibold text-text-muted">{timeLabel}</span>
        <button className="text-text-muted transition-colors hover:text-blue" aria-label="Save opportunity">
          <span className="material-symbols-outlined text-[15px]">bookmark</span>
        </button>
      </div>
    </article>
  );
}
