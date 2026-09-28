import { Link } from "@/lib/next-polyfills";
import {
  ArrowRight,
  GraduationCap,
  MonitorPlay,
  Ticket,
  Music,
  Library,
} from "lucide-react";

const CARDS = [
  {
    id: "c1",
    title: "Scholarships",
    desc: "Fund your dreams",
    href: "/scholarships",
    icon: GraduationCap,
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "c2",
    title: "Workshops",
    desc: "Learn from experts",
    href: "/workshops",
    icon: MonitorPlay,
    img: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "c3",
    title: "College Festivals",
    desc: "Be part of campus life",
    href: "/college-festivals",
    icon: Ticket,
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "c4",
    title: "Cultural Events",
    desc: "Express. Perform. Belong.",
    href: "/cultural-events",
    icon: Music,
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "c5",
    title: "Study Resources",
    desc: "Tools for your growth.",
    href: "/resources",
    icon: Library,
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop",
  },
];

export function BeyondJobs() {
  return (
    <section
      className="bg-transparent pb-0 pt-2 lg:pt-3"
      aria-label="Explore more opportunities"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex flex-col text-center sm:text-left">
            <span className="mb-2 text-[18px] font-bold uppercase tracking-widest text-blue">
              EXPLORE MORE
            </span>

            <h2 className="text-[28px] font-extrabold leading-tight tracking-tight text-primary">
              Opportunities{" "}
              <span className="font-serif font-normal italic text-editorial-red">
                beyond jobs.
              </span>
            </h2>
          </div>

          <Link
            href="/events"
            className="hidden items-center gap-1.5 text-[14px] font-bold text-primary hover:text-blue transition-colors sm:flex"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {CARDS.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.id}
                href={card.href}
                className="group relative flex h-[180px] w-full flex-col justify-end overflow-hidden rounded-2xl border border-border p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-cyan-light hover:shadow-hover"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url("${card.img}")` }}
                  aria-hidden="true"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="relative z-10">
                  <Icon
                    size={20}
                    className="mb-2 text-white"
                    aria-hidden="true"
                  />

                  <h3 className="text-[15px] font-bold leading-snug tracking-tight text-white">
                    {card.title}
                  </h3>

                  <p className="mt-0.5 text-[12px] font-medium leading-tight text-slate-200/90">
                    {card.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}