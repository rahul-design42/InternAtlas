

import { useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  className,
  placeholder = "Search opportunities, skills, companies or keywords...",
  onSearch,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  const handleSubmit = () => {
    const query = inputRef.current?.value.trim() ?? "";
    if (query) {
      onSearch?.(query);
      document.getElementById("explore")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") inputRef.current?.blur();
  };

  return (
    <div className={cn("group flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-1.5 shadow-sm transition-all duration-200 focus-within:border-cyan focus-within:shadow-hover focus-within:ring-2 focus-within:ring-cyan-light", className)}>
      <Search size={17} className="flex-shrink-0 text-text-muted transition-colors group-focus-within:text-cyan" aria-hidden="true" />
      <Input
        ref={inputRef} id="hero-search" type="text" placeholder={placeholder} onKeyDown={handleKeyDown} aria-label="Search opportunities"
        className="h-10 flex-1 border-0 bg-transparent p-0 text-[15px] text-primary shadow-none placeholder:text-text-muted focus-visible:ring-0"
      />
      <Button id="search-btn" onClick={handleSubmit} size="sm" className="h-9 flex-shrink-0 rounded-xl px-5 text-sm" aria-label="Search">
        Search
      </Button>
    </div>
  );
}
