import { Link } from "@/lib/next-polyfills";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { cn } from "@/lib/utils";
import type { Category, OpportunityType } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
  className?: string;
  variant?: "default" | "highlighted" | "cyan";
}

const categoryLinks: Record<OpportunityType, string> = {
  internship: "/internships",
  job: "/jobs",
  competition: "/competitions",
  hackathon: "/hackathons",
  scholarship: "/scholarships",
  event: "/events",
  contest: "/contests",
  quiz: "/quizzes",
  workshops: "/workshops",
  college_fest: "/college-festivals",
  cultural: "/cultural-events",
};

export function CategoryCard({
  category,
  className,
  variant = "default",
}: CategoryCardProps) {
  const { type, label, description, iconKey, color } = category;
  const href = categoryLinks[type];

  // Map colors to their respective tailwind classes
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    pink: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
    teal: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
  };

  const selectedColor = color && colorMap[color] ? colorMap[color] : { bg: "bg-background", text: "text-primary", border: "border-transparent" };

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-w-[150px] flex-col items-center justify-center gap-4 rounded-2xl p-5 text-center shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-cyan-light hover:shadow-hover",
        variant === "default" && "border border-border bg-white",
        variant === "highlighted" && "border border-pink bg-pink-soft",
        variant === "cyan" && "border border-cyan-light bg-cyan-surface",
        className
      )}
      aria-label={`Explore ${label}`}
    >
      <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl border", selectedColor.bg, selectedColor.text, selectedColor.border)}>
        <CategoryIcon iconKey={iconKey} className="h-7 w-7" />
      </div>

      <div className="flex w-full flex-col gap-1 px-1">
        <h3 className="text-[14px] font-bold text-text-primary">{label}</h3>
        <p className="text-[12px] leading-snug text-text-secondary">
          {description}
        </p>
      </div>
    </Link>
  );
}