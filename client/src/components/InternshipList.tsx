

import { FormEvent, useMemo, useState } from "react";
import { Link } from "@/lib/next-polyfills";
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Clock3,
  Filter,
  MapPin,
  Search,
  Sparkles,
  WalletCards,
} from "lucide-react";

import type { Internship } from "@/data/internships";

function safeValue(value: string | null | undefined, fallback = "Not specified") {
  const cleaned = value?.trim();
  return cleaned ? cleaned : fallback;
}

export default function InternshipList({
  internships,
}: {
  internships: Internship[];
}) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [workModes, setWorkModes] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  const availableCategories = useMemo(() => {
    return Array.from(
      new Set(
        internships
          .map((internship) => internship.category?.trim())
          .filter((category): category is string => Boolean(category)),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [internships]);

  const availableWorkModes = useMemo(() => {
    return Array.from(
      new Set(
        internships
          .map((internship) => internship.workMode?.trim())
          .filter((mode): mode is string => Boolean(mode)),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [internships]);

  const quickCategories = availableCategories.slice(0, 6);

  const filteredInternships = useMemo(() => {
    const query = search.trim().toLowerCase();
    const locationQuery = location.trim().toLowerCase();
    const categoryQuery = selectedCategory.trim().toLowerCase();

    return internships.filter((internship) => {
      const title = safeValue(internship.title, "").toLowerCase();
      const company = safeValue(internship.company, "").toLowerCase();
      const internshipLocation = safeValue(
        internship.location,
        "",
      ).toLowerCase();
      const workMode = safeValue(internship.workMode, "").toLowerCase();
      const category = safeValue(internship.category, "").toLowerCase();
      const description = safeValue(
        internship.description,
        "",
      ).toLowerCase();

      const skills = (internship.skills ?? []).map((skill) =>
        skill.toLowerCase(),
      );

      const searchableText = [
        title,
        company,
        internshipLocation,
        workMode,
        category,
        description,
        ...skills,
      ].join(" ");

      const matchesSearch = !query || searchableText.includes(query);

      const matchesLocation =
        !locationQuery ||
        internshipLocation.includes(locationQuery) ||
        workMode.includes(locationQuery);

      const matchesCategory =
        !categoryQuery || category.includes(categoryQuery);

      const matchesWorkMode =
        workModes.length === 0 ||
        workModes.some(
          (mode) => mode.toLowerCase() === workMode.toLowerCase(),
        );

      return (
        matchesSearch &&
        matchesLocation &&
        matchesCategory &&
        matchesWorkMode
      );
    });
  }, [internships, search, location, selectedCategory, workModes]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    location.trim().length > 0 ||
    selectedCategory.length > 0 ||
    workModes.length > 0;

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function toggleWorkMode(mode: string) {
    setWorkModes((current) =>
      current.includes(mode)
        ? current.filter((item) => item !== mode)
        : [...current, mode],
    );
  }

  function toggleSaved(id: number) {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function clearFilters() {
    setSearch("");
    setLocation("");
    setSelectedCategory("");
    setWorkModes([]);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-[#f3f7ff] via-white to-[#fff4f7]">
        <div className="absolute -right-20 top-0 size-56 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute left-1/3 top-0 size-56 rounded-full bg-blue-200/25 blur-3xl" />

        <div className="relative mx-auto max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-blue-600">
              Internships for students
            </p>

            <h1 className="mt-2 text-3xl font-black leading-tight tracking-[-0.035em] text-[#071c46] md:text-4xl">
              Find internships that{" "}
              <span className="font-serif italic text-[#c63845]">
                match your goals
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Search internship opportunities by profile, company, skills,
              location and work mode.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-7 grid overflow-hidden rounded-2xl border border-blue-100 bg-white p-1.5 shadow-lg shadow-blue-100/40 md:grid-cols-[1fr_260px_auto]"
          >
            <label className="flex min-w-0 items-center gap-3 px-4">
              <Search size={19} className="shrink-0 text-blue-600" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search profile, company or skills"
                className="min-w-0 flex-1 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="flex min-w-0 items-center gap-3 border-t border-slate-100 px-4 md:border-l md:border-t-0">
              <MapPin size={18} className="shrink-0 text-blue-600" />

              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Location or Remote"
                className="min-w-0 flex-1 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>

            <button
              type="submit"
              className="rounded-xl bg-[#06275b] px-8 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          {quickCategories.length > 0 && (
            <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="shrink-0 text-xs font-semibold text-slate-500">
                Popular:
              </span>

              {quickCategories.map((category) => {
                const selected = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setSelectedCategory((current) =>
                        current === category ? "" : category,
                      )
                    }
                    className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition ${
                      selected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-blue-200 bg-white text-[#173768] hover:border-blue-500"
                    }`}
                  >
                    <Sparkles size={13} />
                    {category}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <main className="min-h-[600px] bg-[#f8fafc] text-[#071c46]">
        <div className="mx-auto grid max-w-[1100px] gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)_245px] lg:px-8">
          {/* Filters */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Filter size={17} className="text-blue-600" />
                <h2 className="text-sm font-extrabold">Filters</h2>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              )}
            </div>

            <FilterInput
              label="Profile"
              value={search}
              placeholder="e.g. Software Development"
              onChange={setSearch}
            />

            <FilterInput
              label="Location"
              value={location}
              placeholder="e.g. Pune, Mumbai, Remote"
              onChange={setLocation}
            />

            {availableWorkModes.length > 0 && (
              <FilterSection title="Work mode">
                {availableWorkModes.map((mode) => (
                  <FilterCheckbox
                    key={mode}
                    label={mode === "Remote" ? "Work from home" : mode}
                    checked={workModes.includes(mode)}
                    onChange={() => toggleWorkMode(mode)}
                  />
                ))}
              </FilterSection>
            )}

            {availableCategories.length > 0 && (
              <FilterSection title="Category">
                {availableCategories.map((category) => (
                  <FilterCheckbox
                    key={category}
                    label={category}
                    checked={selectedCategory === category}
                    onChange={() =>
                      setSelectedCategory((current) =>
                        current === category ? "" : category,
                      )
                    }
                  />
                ))}
              </FilterSection>
            )}
          </aside>

          {/* Internship cards */}
          <section className="min-w-0">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Opportunities
                </p>

                <h2 className="mt-1 text-xl font-black tracking-[-0.02em] text-[#071c46]">
                  {filteredInternships.length}{" "}
                  {filteredInternships.length === 1
                    ? "Internship"
                    : "Internships"}
                </h2>
              </div>

              {hasActiveFilters && (
                <p className="text-xs text-slate-500">
                  Showing filtered results
                </p>
              )}
            </div>

            <div className="space-y-4">
              {filteredInternships.map((internship) => {
                const saved = savedIds.includes(internship.id);

                const title = safeValue(
                  internship.title,
                  "Internship opportunity",
                );

                const company = safeValue(
                  internship.company,
                  "Company not specified",
                );

                const locationValue = safeValue(internship.location);
                const workModeValue = safeValue(internship.workMode);
                const durationValue = safeValue(internship.duration);
                const stipendValue = safeValue(internship.stipend);
                const applyByValue = safeValue(internship.applyBy);
                const categoryValue = safeValue(internship.category, "");
                const postedValue = safeValue(internship.posted, "");
                const description = safeValue(internship.description, "");

                const skills = internship.skills ?? [];

                return (
                  <article
                    key={internship.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                  >
                    {/* Makes the entire card clickable */}
                    <Link
                      href={`/internships/${internship.slug}`}
                      aria-label={`View ${title} at ${company}`}
                      className="absolute inset-0 z-10"
                    />

                    <div className="relative z-20 pointer-events-none">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 gap-3">
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-lg font-black uppercase text-blue-700">
                            {company.charAt(0)}
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-base font-extrabold leading-6 text-[#071c46] transition group-hover:text-blue-600">
                              {title}
                            </h3>

                            <p className="mt-0.5 text-sm font-medium text-slate-600">
                              {company}
                            </p>

                            {categoryValue && (
                              <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                                {categoryValue}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          aria-label={
                            saved ? "Remove saved internship" : "Save internship"
                          }
                          onClick={() => toggleSaved(internship.id)}
                          className={`pointer-events-auto relative z-30 flex size-9 shrink-0 items-center justify-center rounded-full border transition ${
                            saved
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-white text-slate-500 hover:border-blue-400 hover:text-blue-600"
                          }`}
                        >
                          <Bookmark
                            size={17}
                            className={saved ? "fill-current" : ""}
                          />
                        </button>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <MetaItem
                          icon={<MapPin size={15} />}
                          label="Location"
                          value={locationValue}
                        />

                        <MetaItem
                          icon={<BriefcaseBusiness size={15} />}
                          label="Work mode"
                          value={workModeValue}
                        />

                        <MetaItem
                          icon={<Clock3 size={15} />}
                          label="Duration"
                          value={durationValue}
                        />

                        <MetaItem
                          icon={<WalletCards size={15} />}
                          label="Stipend"
                          value={stipendValue}
                        />
                      </div>

                      {description && (
                        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
                          {description}
                        </p>
                      )}

                      {skills.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}

                          {skills.length > 4 && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
                              +{skills.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                          {postedValue && (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock3 size={13} />
                              Posted {postedValue}
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={13} />
                            Apply by {applyByValue}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600">
                          View details
                          <ArrowRight
                            size={14}
                            className="transition group-hover:translate-x-0.5"
                          />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}

              {filteredInternships.length === 0 && (
                <div className="rounded-2xl border border-dashed border-blue-200 bg-white px-6 py-14 text-center shadow-sm">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-50">
                    <Search size={24} className="text-blue-500" />
                  </div>

                  <h3 className="mt-4 text-lg font-extrabold text-[#071c46]">
                    No internships found
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    We couldn&apos;t find an internship matching your current
                    search and filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Useful sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                How it works
              </p>

              <h2 className="mt-2 text-lg font-black leading-6 text-[#071c46]">
                Find and apply in a few simple steps
              </h2>

              <div className="mt-5 space-y-4">
                <StepItem
                  number="1"
                  title="Find an internship"
                  description="Search by profile, skills, location or work mode."
                />

                <StepItem
                  number="2"
                  title="Review the details"
                  description="Check the role, company, stipend, duration and requirements."
                />

                <StepItem
                  number="3"
                  title="Apply"
                  description="Complete your details, answer the application question and review before submitting."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
              <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold uppercase text-blue-700">
                For employers
              </span>

              <h2 className="mt-3 text-lg font-black leading-6 text-[#071c46]">
                Looking for talented interns?
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                Create an internship opportunity and start receiving
                applications from students.
              </p>

              <Link
                href="/employer/internships/new"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#06275b] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
              >
                Post an internship
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
              <div className="flex gap-2">
                <Check size={17} className="mt-0.5 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-sm font-extrabold text-slate-800">
                    No application fee
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Students can review internship details before submitting
                    their application.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-slate-400">{icon}</span>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-xs font-semibold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

function FilterInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-5 block">
      <span className="text-xs font-extrabold text-[#071c46]">{label}</span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 border-t border-slate-100 pt-5">
      <h3 className="text-xs font-extrabold text-[#071c46]">{title}</h3>

      <div className="mt-3 space-y-2.5">{children}</div>
    </section>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 rounded border-slate-300 accent-blue-600"
      />

      <span>{label}</span>
    </label>
  );
}

function StepItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
        {number}
      </span>

      <div>
        <p className="text-xs font-extrabold text-[#071c46]">{title}</p>

        <p className="mt-1 text-[11px] leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}