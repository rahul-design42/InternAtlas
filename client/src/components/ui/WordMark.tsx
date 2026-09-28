import { cn } from "@/lib/utils";

interface WordMarkProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function WordMark({ className, iconSize = 22, textSize = "text-[17px]" }: WordMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="9.5" stroke="var(--color-blue)" strokeWidth="1.5" />
        <path d="M11 1.5C11 1.5 7 6 7 11C7 16 11 20.5 11 20.5" stroke="var(--color-blue)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M11 1.5C11 1.5 15 6 15 11C15 16 11 20.5 11 20.5" stroke="var(--color-blue)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M1.5 11H20.5" stroke="var(--color-blue)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M2.5 7.5H19.5" stroke="var(--color-blue)" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
        <path d="M2.5 14.5H19.5" stroke="var(--color-blue)" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
      </svg>
      <span className={cn("font-bold tracking-tight text-primary", textSize)}>InternAtlas</span>
    </span>
  );
}
