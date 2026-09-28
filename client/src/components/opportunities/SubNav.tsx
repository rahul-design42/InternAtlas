import { useRouter } from '@/lib/next-polyfills';


import { Link } from "@/lib/next-polyfills";
// import from next/navigation removed
import { ArrowLeft, Trophy, Code, Award, HelpCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubNavProps {
  activeModule?: "competitions" | "hackathons" | "contests" | "quizzes" | "events";
  className?: string;
}

export function SubNav({ activeModule = "competitions", className }: SubNavProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const navItems = [
    {
      id: "competitions",
      label: "Competitions",
      href: "/competitions",
      icon: Trophy,
    },
    {
      id: "hackathons",
      label: "Hackathons",
      href: "/hackathons",
      icon: Code,
    },
    {
      id: "contests",
      label: "Contests",
      href: "/contests",
      icon: Award,
    },
    {
      id: "quizzes",
      label: "Quizzes",
      href: "/quizzes",
      icon: HelpCircle,
    },
    {
      id: "events",
      label: "Events",
      href: "/events",
      icon: Calendar,
    },
  ];

  return (
    <nav
      aria-label="Opportunities Sub Navigation"
      className={cn(
        "border-b border-border bg-white/95 backdrop-blur-sm sticky top-14 lg:top-12 z-30 transition-all",
        className
      )}
    >
      <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between px-4 sm:px-6">
        {/* Left: Back Button */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Return to previous page"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:bg-background hover:text-primary focus-visible:ring-2 focus-visible:ring-blue"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Return to previous page</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        {/* Center / Right: Opportunities Module Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
          {navItems.map((item) => {
            const isActive = activeModule === item.id;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-white shadow-sm font-semibold"
                    : "text-text-secondary hover:bg-background hover:text-primary"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={13} className={isActive ? "text-cyan" : "text-text-muted"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

