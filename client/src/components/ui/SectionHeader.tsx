import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  action?: React.ReactNode;
  urgentEyebrow?: boolean;
}

export function SectionHeader({
  eyebrow, title, subtitle, align = "left", className, action, urgentEyebrow = false,
}: SectionHeaderProps) {
  const isCenter = align === "center";
  return (
    <div className={cn("mb-10", isCenter ? "text-center" : "flex items-start justify-between gap-4", className)}>
      <div className={cn("flex flex-col", isCenter && "items-center")}>
        {eyebrow && (
          <span className={cn("mb-3 text-[15px] font-extrabold uppercase tracking-widest", urgentEyebrow ? "text-editorial-red" : "text-blue")}>
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl font-extrabold tracking-tight text-primary leading-tight text-balance">
          {title}
        </h2>
        {subtitle && (
          <p className={cn("mt-1.5 text-[15px] text-text-secondary leading-relaxed", isCenter && "max-w-md")}>
            {subtitle}
          </p>
        )}
      </div>
      {!isCenter && action && <div className="mt-auto flex-shrink-0 pb-0.5">{action}</div>}
    </div>
  );
}
