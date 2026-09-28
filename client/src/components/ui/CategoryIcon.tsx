import { cn } from "@/lib/utils";

interface CategoryIconProps {
  iconKey: string;
  className?: string;
}

const CustomIcons: Record<string, React.FC<{ className?: string }>> = {
  briefcase: ({ className }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="3" width="14" height="18" rx="2" fill="currentColor" />
      <path d="M9 7h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 12h8v4H8v-4z" fill="white" />
    </svg>
  ),
  user: ({ className }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="10" r="3" />
      <path d="M12 13l-1.5 4h3l-1.5-4z" fill="currentColor" stroke="none" />
    </svg>
  ),
  trophy: ({ className }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3h8v6c0 2.2-1.8 4-4 4s-4-1.8-4-4V3z" />
      <path d="M4 4h4v4H4z" />
      <path d="M16 4h4v4h-4z" />
      <path d="M12 13v6" />
      <path d="M8 19h8" />
      <path d="M12 6l1 2 2 .5-1.5 1.5.5 2-2-1-2 1 .5-2L9 8.5l2-.5z" fill="currentColor" stroke="none" />
    </svg>
  ),
  zap: ({ className }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M12 22V12" />
      <path d="M3.27 6.96L12 12" />
      <path d="M20.73 6.96L12 12" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M12 12l-2-2" stroke="white" />
    </svg>
  ),
  graduation: ({ className }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 9l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 13v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  clipboard: ({ className }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  users: ({ className }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
      <line x1="3" y1="8" x2="21" y2="8" />
      <path d="M7 8v4l2-2 2 2V8" fill="currentColor" stroke="none" />
      <path d="M13 8v4l2-2 2 2V8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="8" cy="14" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  star: ({ className }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="5" />
      <circle cx="16" cy="15" r="5" />
      <path d="M9 14v4a2 2 0 0 0 2 2h2" />
      <path d="M16 10V6a2 2 0 0 0-2-2h-2" />
      <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  "book-open": ({ className }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  music: ({ className }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  smile: ({ className }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
};

export function CategoryIcon({ iconKey, className }: CategoryIconProps) {
  const Icon = CustomIcons[iconKey] || CustomIcons.briefcase;
  return <Icon className={cn("shrink-0", className)} />;
}
