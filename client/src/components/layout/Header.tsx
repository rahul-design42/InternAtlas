

import { useCallback, useEffect, useState } from "react";
import { Link } from "@/lib/next-polyfills";
import { Menu, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";


const NAV_LINKS = [
  { label: "Opportunities", href: "/opportunities" },
  { label: "Events", href: "/events" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "For Colleges", href: "/colleges" },
  { label: "Resources", href: "/resources" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 4);
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(handleScroll);

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-16 border-b border-border/40 transition-all",
          scrolled
            ? "bg-white/95 shadow-sm backdrop-blur-md"
            : "bg-white",
        )}
      >
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-10">
            <button
              type="button"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              className="flex size-9 items-center justify-center rounded-full border border-border text-primary lg:hidden"
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <Link
              href="/"
              aria-label="InternAtlas home"
              onClick={closeMenu}
              className="text-[22px] font-black tracking-[-0.04em] text-primary"
            >
              Intern<span className="text-blue">Atlas.</span>
            </Link>

            <nav className="hidden items-center gap-7 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] font-semibold text-text-secondary transition hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/search"
              aria-label="Search"
              className="flex size-9 items-center justify-center rounded-full border border-border bg-white text-primary transition hover:border-blue hover:bg-blue-surface"
            >
              <Search size={16} />
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-white px-5 text-[13px] font-semibold text-primary transition hover:bg-surface"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-5 text-[13px] font-semibold text-white transition hover:bg-primary/90"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-x-0 top-14 z-40 border-b border-slate-200 bg-white px-5 pb-5 shadow-lg lg:hidden">
          <nav className="flex flex-col pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="border-b border-slate-100 py-3 text-sm font-semibold text-slate-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}