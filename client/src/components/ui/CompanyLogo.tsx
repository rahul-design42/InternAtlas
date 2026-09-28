import { cn } from "@/lib/utils";
import type { LogoVariant } from "@/lib/types";

interface CompanyLogoProps {
  variant: LogoVariant;
  name: string;
  size?: number;
  className?: string;
}

export function CompanyLogo({ variant, name, size = 38, className }: CompanyLogoProps) {
  const wrapClass = cn("flex items-center justify-center rounded-lg border border-border bg-white flex-shrink-0", className);
  const style = { width: size, height: size };

  switch (variant) {
    case "google":
      return (
        <div className={wrapClass} style={style} aria-label="Google">
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <path d="M19.6 10.23c0-.68-.06-1.36-.16-2H10v3.78h5.4a4.63 4.63 0 01-2 3.04v2.52h3.24c1.9-1.74 3-4.3 3-7.34z" fill="#4285F4"/>
            <path d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.24-2.52c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.6-4.12H1.04v2.6A10 10 0 0010 20z" fill="#34A853"/>
            <path d="M4.4 11.89A5.93 5.93 0 014.1 10c0-.66.1-1.3.3-1.89V5.5H1.04A10 10 0 000 10c0 1.6.38 3.13 1.04 4.5l3.36-2.61z" fill="#FBBC05"/>
            <path d="M10 3.98c1.47 0 2.78.5 3.82 1.5l2.86-2.86C14.95.9 12.7 0 10 0A10 10 0 001.04 5.5L4.4 8.11C5.2 5.76 7.4 3.98 10 3.98z" fill="#EA4335"/>
          </svg>
        </div>
      );
    case "microsoft":
      return (
        <div className={wrapClass} style={style} aria-label="Microsoft">
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <rect x="1"    y="1"    width="8.5" height="8.5" fill="#F25022"/>
            <rect x="10.5" y="1"    width="8.5" height="8.5" fill="#7FBA00"/>
            <rect x="1"    y="10.5" width="8.5" height="8.5" fill="#00A4EF"/>
            <rect x="10.5" y="10.5" width="8.5" height="8.5" fill="#FFB900"/>
          </svg>
        </div>
      );
    case "unstop":
      return (
        <div className={wrapClass} style={style} aria-label="Unstop">
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <rect width="20" height="20" rx="6" fill="#7C3AED"/>
            <path d="M5 13V7L10 4L15 7V13L10 16L5 13Z" stroke="white" strokeWidth="1.3" fill="none"/>
          </svg>
        </div>
      );
    case "tata":
      return (
        <div className={wrapClass} style={style} aria-label="Tata Trusts">
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <rect width="20" height="20" rx="6" fill="#0F172A"/>
            <path d="M4 7H16M10 7V15" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
      );
    case "isro":
      return (
        <div className={wrapClass} style={style} aria-label="ISRO">
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <rect width="20" height="20" rx="6" fill="#1E40AF"/>
            <circle cx="10" cy="10" r="5" stroke="white" strokeWidth="1.3" fill="none"/>
            <path d="M10 5V3M10 17V15M5 10H3M17 10H15" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </div>
      );
    case "adobe":
      return (
        <div className={wrapClass} style={style} aria-label="Adobe">
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <rect width="20" height="20" rx="6" fill="#FA0F00"/>
            <path d="M5 15L10 5L15 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M7.5 11H12.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
      );
    case "hackerearth":
      return (
        <div className={wrapClass} style={style} aria-label="HackerEarth">
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <rect width="20" height="20" rx="6" fill="#2C3E50"/>
            <path d="M5 7H9M11 7H15M7 10H13M5 13H9M11 13H15" stroke="#2196F3" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
      );
    default:
      return (
        <div className={cn(wrapClass, "bg-background font-bold text-text-secondary text-sm")} style={style} aria-label={name}>
          {name.charAt(0).toUpperCase()}
        </div>
      );
  }
}
