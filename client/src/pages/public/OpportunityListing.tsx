import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// api import removed
import { useAuth } from '../../context/AuthContext';
import ApplyModal from '../../components/candidate/ApplyModal';
import { SEO } from '../../components/SEO';
import { DUMMY_OPPORTUNITIES } from '../../data/dummyData';

interface SkillObj {
  _id: string;
  name: string;
}

interface OpportunityItem {
  _id: string;
  title: string;
  slug: string;
  type: string;
  workMode: string;
  location: string;
  duration?: string;
  stipend?: string | number;
  skills?: (string | SkillObj)[];
  organizationId?: {
    _id: string;
    name: string;
    logo?: string;
    isVerified?: boolean;
    verificationStatus?: string;
    slug?: string;
  };
  organizationName?: string;
  createdAt: string;
  deadline?: string;
  isVerified?: boolean;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const QUICK_CHIPS = [
  'Remote',
  'Hybrid',
  'On-site',
  'Paid Stipend',
  'Latest',
  'AI & ML',
  'Web Development',
  'Data Science',
];

const OpportunityListing = ({ type = 'internship' }: { type?: string }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [opps, setOpps] = useState<OpportunityItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');
  const [locationKeyword, setLocationKeyword] = useState(searchParams.get('location') || '');
  const [workModes, setWorkModes] = useState<string[]>(searchParams.getAll('workMode').length ? searchParams.getAll('workMode') : ['Remote', 'Hybrid']);
  const [minStipend, setMinStipend] = useState(Number(searchParams.get('minStipend')) || 15000);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(searchParams.getAll('skills').length ? searchParams.getAll('skills') : ['React', 'Python', 'TypeScript']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [selectedDurations, setSelectedDurations] = useState<string[]>(searchParams.getAll('duration').length ? searchParams.getAll('duration') : ['1-3 Months', '3-6 Months']);
  const [sortBy, setSortBy] = useState('Recommended (AI Match)');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [activeQuickChip, setActiveQuickChip] = useState<string>('Remote');

  // Bookmarking
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Apply Modal state
  const [selectedOppForApply, setSelectedOppForApply] = useState<{ id: string; title: string } | null>(null);

  const addSkillRef = useRef<HTMLInputElement>(null);

  // Sync URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.set('search', searchKeyword.trim());
    if (locationKeyword.trim()) params.set('location', locationKeyword.trim());
    workModes.forEach(wm => params.append('workMode', wm));
    selectedDurations.forEach(d => params.append('duration', d));
    selectedSkills.forEach(s => params.append('skills', s));
    if (minStipend !== 15000) params.set('minStipend', String(minStipend));
    if (page > 1) params.set('page', String(page));
    setSearchParams(params, { replace: true });
  }, [searchKeyword, locationKeyword, workModes, selectedDurations, selectedSkills, minStipend, page, setSearchParams]);

  // Reset filters when route/type changes
  useEffect(() => {
    setSearchKeyword('');
    setLocationKeyword('');
    setWorkModes(['Remote', 'Hybrid']);
    setSelectedDurations(['1-3 Months', '3-6 Months']);
    setSelectedSkills(['React', 'Python', 'TypeScript']);
    setMinStipend(15000);
    setPage(1);
  }, [type]);

  // Fetch opportunities from real API
  useEffect(() => {
    let cancelled = false;

    const fetchOpps = async () => {
      setLoading(true);
        // Use dummy data directly as requested
        const typeUpper = type.toUpperCase();
        let filtered = DUMMY_OPPORTUNITIES.filter(opp => opp.type === (typeUpper === 'INTERNSHIP' || typeUpper === 'JOB' || typeUpper === 'HACKATHON' || typeUpper === 'COMPETITION' ? typeUpper : 'INTERNSHIP'));
        
        if (searchKeyword.trim()) {
          const lower = searchKeyword.toLowerCase();
          filtered = filtered.filter(opp => opp.title.toLowerCase().includes(lower) || opp.description.toLowerCase().includes(lower));
        }

        if (locationKeyword.trim()) {
          const lower = locationKeyword.toLowerCase();
          filtered = filtered.filter(opp => opp.location.toLowerCase().includes(lower));
        }

        if (workModes.length > 0) {
          const modeMap: Record<string, string> = { 'Remote': 'REMOTE', 'Hybrid': 'HYBRID', 'On-site': 'ON_SITE' };
          const modes = workModes.map(m => modeMap[m] || m.toUpperCase());
          filtered = filtered.filter(opp => modes.includes(opp.workMode));
        }

        if (selectedDurations.length > 0) {
          filtered = filtered.filter(opp => opp.duration && selectedDurations.some(d => opp.duration?.includes(d) || opp.duration === d));
        }

        if (selectedSkills.length > 0) {
          filtered = filtered.filter(opp => {
            if (!opp.skills) return false;
            const oppSkills = opp.skills.map((s: any) => s.name.toLowerCase());
            return selectedSkills.some(reqSkill => oppSkills.includes(reqSkill.toLowerCase()));
          });
        }

        if (minStipend > 5000) {
          filtered = filtered.filter(opp => (opp as any).stipendAmount && (opp as any).stipendAmount >= minStipend);
        }
        
        if (!cancelled) {
          setOpps(filtered as any[]);
          setPagination({ total: filtered.length, page: 1, limit: 10, totalPages: 1 });
          setLoading(false);
        }
    };

    fetchOpps();
    return () => {
      cancelled = true;
    };
  }, [type, page, searchKeyword, locationKeyword, workModes, selectedDurations, selectedSkills, minStipend]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const toggleWorkMode = (mode: string) => {
    setWorkModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
    setPage(1);
  };

  const toggleDuration = (dur: string) => {
    setSelectedDurations((prev) =>
      prev.includes(dur) ? prev.filter((d) => d !== dur) : [...prev, dur]
    );
  };

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillInput.trim() && !selectedSkills.includes(newSkillInput.trim())) {
      setSelectedSkills((prev) => [...prev, newSkillInput.trim()]);
      setNewSkillInput('');
      setShowAddSkill(false);
    }
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setLocationKeyword('');
    setWorkModes([]);
    setMinStipend(5000);
    setSelectedSkills([]);
    setSelectedDurations([]);
    setActiveQuickChip('');
    setPage(1);
  };

  const handleQuickChip = (chip: string) => {
    setActiveQuickChip(chip);
    if (chip === 'Remote') {
      setWorkModes(['Remote']);
    } else if (chip === 'Hybrid') {
      setWorkModes(['Hybrid']);
    } else if (chip === 'On-site') {
      setWorkModes(['On-site']);
    } else if (chip === 'Paid Stipend') {
      setMinStipend(15000);
    } else {
      setSearchKeyword(chip);
    }
    setPage(1);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApplyClick = (opp: OpportunityItem) => {
    if (!user) {
      navigate(`/login?returnTo=/opportunities/${opp.slug || opp._id}`);
    } else {
      setSelectedOppForApply({ id: opp._id, title: opp.title });
    }
  };

  return (
    <>
      <SEO
        title={`${type.charAt(0).toUpperCase() + type.slice(1)}s — InternAtlas`}
        description={`Discover vetted ${type}s engineered to launch competitive careers.`}
      />

      {selectedOppForApply && (
        <ApplyModal
          opportunityId={selectedOppForApply.id}
          opportunityTitle={selectedOppForApply.title}
          onClose={() => setSelectedOppForApply(null)}
        />
      )}

      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-16rem)]">
        <div className="flex flex-col w-full">
          {/* Subtle Ambient Glow in background */}
          <div className="relative w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg">
            {/* Top Decorative Blur Elements (contained) */}
            <div className="absolute -top-10 right-20 w-80 h-80 rounded-full bg-secondary/5 blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-40 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none -z-10" />

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
              <div className="space-y-space-xs">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-wider">
                    Verified Index
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight capitalize">
                  {type}s
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                  {type === 'internship' && 'Discover vetted internships engineered to launch competitive careers. Filter by verifiable compensation, technical stack, and verified mentorship tracks.'}
                  {type === 'job' && 'Discover full-time roles and fresh graduate opportunities at verified organizations.'}
                  {type === 'hackathon' && 'Participate in top-tier hackathons to build and showcase your engineering skills.'}
                  {type === 'competition' && 'Compete in global contests, coding challenges, and case study competitions.'}
                </p>
              </div>

              {/* Live Counter Pill */}
              <div className="inline-flex items-center gap-2.5 px-space-md py-2.5 rounded-xl bg-surface-container-lowest shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
                </span>
                <span className="font-title-md text-title-md text-primary font-bold">
                  {pagination.total > 0 ? pagination.total.toLocaleString() : (loading ? '...' : '0')}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  active opportunities
                </span>
              </div>
            </div>

            {/* SEARCH & DISCOVERY BAR */}
            <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-md mb-space-md">
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col md:flex-row items-stretch gap-space-sm"
              >
                {/* Keyword input */}
                <div className="flex-1 flex items-center gap-3 px-space-md py-2.5 bg-surface-container-low rounded-lg">
                  <span className="material-symbols-outlined text-outline text-[22px]">search</span>
                  <input
                    className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                    placeholder="Search internships, companies, skills..."
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
                {/* Location input */}
                <div className="md:w-80 flex items-center gap-3 px-space-md py-2.5 bg-surface-container-low rounded-lg">
                  <span className="material-symbols-outlined text-outline text-[20px]">location_on</span>
                  <input
                    className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                    placeholder="Location (e.g. Remote, Bangalore, Delhi)"
                    type="text"
                    value={locationKeyword}
                    onChange={(e) => setLocationKeyword(e.target.value)}
                  />
                </div>
                {/* Search button */}
                <button
                  className="flex items-center justify-center gap-2 px-space-xl py-3 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all font-title-md text-title-md shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
                  type="submit"
                >
                  <span>Search</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>
            </div>

            {/* QUICK PILLS / CHIPS ROW */}
            <div className="flex items-center justify-between gap-space-md mb-space-lg overflow-x-auto pb-1">
              <div className="flex items-center gap-2 min-w-max">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline mr-1">
                  Quick:
                </span>
                {QUICK_CHIPS.map((chip) => {
                  const isActive = activeQuickChip === chip;
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleQuickChip(chip)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-colors shadow-sm cursor-pointer ${
                        isActive
                          ? 'bg-primary text-on-primary'
                          : chip === 'Paid Stipend'
                          ? 'bg-secondary-fixed text-on-secondary-fixed'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {isActive && (
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      )}
                      {chip === 'Paid Stipend' && !isActive && (
                        <span className="material-symbols-outlined text-[16px]">payments</span>
                      )}
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MAIN TWO-COLUMN DISCOVERY CONTAINER */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-lg items-start">
              {/* ============================================ */}
              {/* LEFT COLUMN: Sticky Filter Sidebar */}
              {/* ============================================ */}
              <aside className="md:col-span-4 xl:col-span-3 space-y-space-md md:sticky md:top-20">
                {/* Filter Card */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-md">
                  {/* Filter Header */}
                  <div className="flex items-center justify-between pb-space-sm border-b-0">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                      <span className="font-title-md text-title-md text-on-surface">Filters</span>
                    </div>
                    <button
                      onClick={handleResetFilters}
                      className="font-caption text-caption text-secondary hover:text-primary transition-colors font-semibold uppercase tracking-wider cursor-pointer"
                      type="button"
                    >
                      Reset all
                    </button>
                  </div>

                  {/* Section: Work Mode */}
                  <div className="space-y-space-xs">
                    <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                      Work Mode
                    </label>
                    <div className="space-y-2 pt-1">
                      {[
                        { label: 'Remote', count: '842' },
                        { label: 'Hybrid', count: '290' },
                        { label: 'On-site', count: '115' },
                      ].map((item) => (
                        <label
                          key={item.label}
                          className="flex items-center justify-between cursor-pointer group select-none"
                        >
                          <span className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-surface group-hover:text-primary">
                            <input
                              type="checkbox"
                              checked={workModes.includes(item.label)}
                              onChange={() => toggleWorkMode(item.label)}
                              className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
                            />
                            {item.label}
                          </span>
                          <span className="font-caption text-caption text-outline">{item.count}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Section: Target City / Hub */}
                  <div className="space-y-space-xs">
                    <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                      Target City / Hub
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low">
                      <span className="material-symbols-outlined text-outline text-[18px]">search</span>
                      <input
                        className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
                        placeholder="Search city or country..."
                        type="text"
                        value={locationKeyword}
                        onChange={(e) => setLocationKeyword(e.target.value)}
                      />
                    </div>
                  </div>

                  {type === 'internship' && (<>
                  {/* Section: Stipend Range */}
                  <div className="space-y-space-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                        Monthly Stipend
                      </label>
                      <span className="font-caption text-caption font-semibold text-secondary">
                        INR (₹)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2 rounded-lg bg-surface-container-low">
                        <span className="font-caption text-caption text-outline block mb-0.5">Min</span>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          ₹{minStipend.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-surface-container-low">
                        <span className="font-caption text-caption text-outline block mb-0.5">Max</span>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          ₹50,000+
                        </span>
                      </div>
                    </div>
                    <input
                      className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                      max="60000"
                      min="5000"
                      step="5000"
                      type="range"
                      value={minStipend}
                      onChange={(e) => setMinStipend(Number(e.target.value))}
                    />
                    <div className="flex justify-between font-caption text-caption text-outline px-1">
                      <span>₹5k</span>
                      <span>₹30k</span>
                      <span>₹60k+</span>
                    </div>
                  </div>

                  </>)}
                  {(type === 'internship' || type === 'hackathon') && (<>
                  {/* Section: Duration */}
                  <div className="space-y-space-xs">
                    <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                      Duration
                    </label>
                    <div className="space-y-2 pt-1">
                      {[
                        { label: '1–3 Months', count: '680' },
                        { label: '3–6 Months', count: '492' },
                        { label: '6+ Months (Co-op)', count: '75' },
                      ].map((item) => (
                        <label
                          key={item.label}
                          className="flex items-center justify-between cursor-pointer group select-none"
                        >
                          <span className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-surface group-hover:text-primary">
                            <input
                              type="checkbox"
                              checked={selectedDurations.includes(item.label)}
                              onChange={() => toggleDuration(item.label)}
                              className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
                            />
                            {item.label}
                          </span>
                          <span className="font-caption text-caption text-outline">{item.count}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  </>)}
                  {(type === 'internship' || type === 'job') && (<>
                  {/* Section: Required Skills */}
                  <div className="space-y-space-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                        Skills &amp; Tech
                      </label>
                      <span className="font-caption text-caption text-outline">
                        {selectedSkills.length} selected
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high text-primary font-caption text-caption font-semibold"
                        >
                          {skill}
                          <span
                            onClick={() => removeSkill(skill)}
                            className="material-symbols-outlined text-[14px] cursor-pointer hover:text-error"
                          >
                            close
                          </span>
                        </span>
                      ))}

                      {showAddSkill ? (
                        <form onSubmit={addSkill} className="inline-flex items-center gap-1">
                          <input
                            ref={addSkillRef}
                            type="text"
                            value={newSkillInput}
                            onChange={(e) => setNewSkillInput(e.target.value)}
                            placeholder="Skill..."
                            className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant text-on-surface font-caption text-caption w-20 focus:outline-none"
                            autoFocus
                          />
                          <button type="submit" className="text-primary hover:text-secondary text-xs font-bold">
                            ✓
                          </button>
                        </form>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowAddSkill(true)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-caption text-caption transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">add</span> Add Skill
                        </button>
                      )}
                    </div>
                  </div>

                  </>)}
                  {/* Section: Target Level */}
                  <div className="space-y-space-xs">
                    <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                      Target Level
                    </label>
                    <div className="space-y-2 pt-1">
                      {[
                        { label: 'Beginner / Undergrad', count: '710' },
                        { label: 'Intermediate / Junior', count: '482' },
                        { label: 'Postgrad / Specialized', count: '55' },
                      ].map((item, idx) => (
                        <label
                          key={item.label}
                          className="flex items-center justify-between cursor-pointer group select-none"
                        >
                          <span className="flex items-center gap-2.5 font-body-sm text-body-sm text-on-surface group-hover:text-primary">
                            <input
                              type="checkbox"
                              defaultChecked={idx === 0}
                              className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
                            />
                            {item.label}
                          </span>
                          <span className="font-caption text-caption text-outline">{item.count}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Curated Verified Guarantee Micro-Banner */}
                  <div className="p-3 rounded-lg bg-surface-container-low flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                      verified_user
                    </span>
                    <p className="font-caption text-caption text-on-surface-variant leading-snug">
                      Every listing includes verified compensation guarantees and active student hiring coordinators.
                    </p>
                  </div>
                </div>

                {/* Weekly Digest Callout Card */}
                <div className="bg-primary text-on-primary rounded-xl p-space-md shadow-sm space-y-space-xs relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-secondary-container opacity-30 blur-xl pointer-events-none" />
                  <span className="inline-block px-2 py-0.5 rounded bg-on-primary/10 font-label-sm text-label-sm uppercase tracking-wider">
                    Radar Alert
                  </span>
                  <h2 className="font-title-md text-title-md font-bold text-on-primary">
                    Instant Role Match
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-primary/80">
                    Get pinged on WhatsApp &amp; Slack as soon as Tier-1 startups open applications.
                  </p>
                  <button
                    className="w-full mt-2 py-2 px-3 rounded-lg bg-on-primary text-primary font-label-md text-label-md font-semibold hover:bg-surface-container-low transition-colors cursor-pointer"
                    type="button"
                  >
                    Configure Alerts
                  </button>
                </div>
              </aside>

              {/* ============================================ */}
              {/* RIGHT COLUMN: Results Section */}
              {/* ============================================ */}
              <section className="md:col-span-8 xl:col-span-9 space-y-space-md">
                {/* Top Results & Sort Meta Bar */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-title-md text-title-md text-primary font-bold">
                      {pagination.total} {type}s found
                    </span>
                    <span className="text-outline hidden sm:inline">•</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {workModes.map((wm) => (
                        <span
                          key={wm}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-caption text-caption"
                        >
                          {wm}
                          <span
                            onClick={() => toggleWorkMode(wm)}
                            className="material-symbols-outlined text-[13px] cursor-pointer hover:text-error"
                          >
                            close
                          </span>
                        </span>
                      ))}
                      {minStipend > 5000 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-caption text-caption">
                          {`₹${(minStipend/1000).toFixed(0)}k+`}
                          <span onClick={() => setMinStipend(5000)} className="material-symbols-outlined text-[13px] cursor-pointer hover:text-error">
                            close
                          </span>
                        </span>
                      )}
                      {selectedDurations.map((dur) => (
                        <span key={dur} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-caption text-caption">
                          {dur}
                          <span onClick={() => toggleDuration(dur)} className="material-symbols-outlined text-[13px] cursor-pointer hover:text-error">
                            close
                          </span>
                        </span>
                      ))}
                      {selectedSkills.map((skill) => (
                        <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-caption text-caption">
                          {skill}
                          <span onClick={() => removeSkill(skill)} className="material-symbols-outlined text-[13px] cursor-pointer hover:text-error">
                            close
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sort Select */}
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <span className="font-caption text-caption text-on-surface-variant font-medium">
                      Sort by:
                    </span>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-surface-container-low text-on-surface font-label-md text-label-md py-1.5 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none"
                      >
                        <option value="Recommended (AI Match)">Recommended (AI Match)</option>
                        <option value="Latest Posted">Latest Posted</option>
                        <option value="Stipend: High to Low">Stipend: High to Low</option>
                        <option value="Stipend: Low to High">Stipend: Low to High</option>
                        <option value="Application Deadline">Application Deadline</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-2 text-[18px] text-outline pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* SKELETON / LOADING STATE */}
                {loading && (
                  <div className="space-y-space-sm" id="view-skeleton-container">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm animate-pulse space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-surface-container-high" />
                            <div className="space-y-2">
                              <div className="w-32 h-3.5 bg-surface-container rounded" />
                              <div className="w-64 h-5 bg-surface-container-high rounded" />
                              <div className="w-48 h-3.5 bg-surface-container rounded" />
                            </div>
                          </div>
                          <div className="w-16 h-3 bg-surface-container rounded" />
                        </div>
                        <div className="pt-4 flex items-center justify-between">
                          <div className="flex gap-2">
                            <div className="w-16 h-6 bg-surface-container rounded" />
                            <div className="w-20 h-6 bg-surface-container rounded" />
                            <div className="w-14 h-6 bg-surface-container rounded" />
                          </div>
                          <div className="w-28 h-8 bg-surface-container-high rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* EMPTY STATE */}
                {!loading && opps.length === 0 && (
                  <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center shadow-sm" id="view-empty-container">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-primary mx-auto mb-space-md">
                      <span className="material-symbols-outlined text-[36px]">travel_explore</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
                      No opportunities matched your exact filters
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-space-lg">
                      We couldn’t find internships matching the selected criteria. Try removing strict stipend floors or broadening your skill keywords.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-space-sm">
                      <button
                        onClick={handleResetFilters}
                        className="px-space-md py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-md text-label-md shadow-sm cursor-pointer"
                        type="button"
                      >
                        Clear filters
                      </button>
                      <button
                        onClick={handleResetFilters}
                        className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-label-md text-label-md cursor-pointer"
                        type="button"
                      >
                        Browse all internships
                      </button>
                    </div>
                  </div>
                )}

                {/* OPPORTUNITY LIST CONTAINER */}
                {!loading && opps.length > 0 && (
                  <div className="space-y-space-sm" id="view-results-container">
                    {opps.map((opp, index) => {
                      const orgName = opp.organizationId?.name || opp.organizationName || 'NovaTech Labs';
                      const isVerified = opp.organizationId?.verificationStatus === 'VERIFIED' || opp.organizationId?.isVerified || opp.isVerified;
                      const isBookmarked = bookmarkedIds.has(opp._id);

                      // Normalize work mode
                      const wmRaw = (opp.workMode || 'REMOTE').toUpperCase();
                      const workModeDisplay = wmRaw === 'REMOTE' ? 'Remote' : wmRaw === 'HYBRID' ? 'Hybrid' : 'On-site';

                      // Format stipend
                      const stipendText = typeof opp.stipend === 'number'
                        ? `₹${opp.stipend.toLocaleString()} / month`
                        : opp.stipend || '₹20,000 / month';

                      // Extract skill names
                      const skillNames = (opp.skills || []).map((s) => (typeof s === 'string' ? s : s.name));

                      // Relative posted date
                      let postedAgo = 'Posted 2d ago';
                      if (opp.createdAt) {
                        const diffDays = Math.floor((Date.now() - new Date(opp.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                        postedAgo = diffDays === 0 ? 'Posted today' : diffDays === 1 ? 'Posted 1d ago' : `Posted ${diffDays}d ago`;
                      }

                      // Subtle avatar color variation per reference
                      const avatarColors = [
                        'bg-primary-fixed text-primary',
                        'bg-secondary-fixed text-on-secondary-fixed',
                        'bg-tertiary-fixed text-tertiary',
                        'bg-surface-container-highest text-primary',
                        'bg-primary-fixed-dim text-primary',
                        'bg-surface-container text-primary',
                      ];
                      const avatarIcons = ['code_blocks', 'psychology', 'security', 'design_services', 'cloud', 'monitoring'];
                      const avatarBg = avatarColors[index % avatarColors.length];
                      const avatarIcon = avatarIcons[index % avatarIcons.length];

                      return (
                        <article
                          key={opp._id}
                          className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all duration-200 group relative"
                        >
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-space-md">
                            <div className="flex items-start gap-space-md">
                              {/* Org Avatar */}
                              <div
                                className={`w-12 h-12 rounded-xl ${avatarBg} flex items-center justify-center font-bold text-headline-sm shrink-0`}
                              >
                                {opp.organizationId?.logo ? (
                                  <img
                                    src={opp.organizationId.logo}
                                    alt={orgName}
                                    className="w-full h-full object-contain rounded-xl"
                                  />
                                ) : (
                                  <span className="material-symbols-outlined text-[28px]">{avatarIcon}</span>
                                )}
                              </div>

                              {/* Details */}
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                                    {orgName}
                                  </span>
                                  {isVerified && (
                                    <span
                                      className="inline-flex items-center gap-0.5 text-secondary font-caption text-caption font-semibold"
                                      title="InternAtlas Verified Enterprise"
                                    >
                                      <span className="material-symbols-outlined text-[15px]">verified</span>
                                      Verified
                                    </span>
                                  )}
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                                    {index === 2 ? 'Urgent Fill' : index === 4 ? 'High Retention' : `${98 - (index % 5) * 2}% Fit`}
                                  </span>
                                </div>

                                <h3 className="font-title-lg text-title-lg text-on-surface font-bold group-hover:text-primary transition-colors">
                                  {opp.title}
                                </h3>

                                {/* Metadata bar */}
                                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 font-body-sm text-body-sm text-on-surface-variant pt-0.5">
                                  <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px] text-outline">
                                      wifi_tethering
                                    </span>{' '}
                                    {workModeDisplay}
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px] text-outline">
                                      schedule
                                    </span>{' '}
                                    {opp.duration || '3 Months'}
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 font-semibold text-primary">
                                    <span className="material-symbols-outlined text-[16px] text-secondary">
                                      payments
                                    </span>{' '}
                                    {stipendText}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Top Right Meta & Bookmark */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                              <span
                                className={`font-caption text-caption ${
                                  postedAgo === 'Posted today' ? 'text-secondary font-bold' : 'text-outline'
                                }`}
                              >
                                {postedAgo}
                              </span>
                              <button
                                aria-label={`Bookmark ${opp.title}`}
                                onClick={() => toggleBookmark(opp._id)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                                  isBookmarked
                                    ? 'text-primary bg-primary-fixed'
                                    : 'text-outline hover:text-primary hover:bg-surface-container'
                                }`}
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  {isBookmarked ? 'bookmark_added' : 'bookmark'}
                                </span>
                              </button>
                            </div>
                          </div>

                          {/* Skills & Actions Bottom Row */}
                          <div className="mt-space-md pt-space-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-t-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {skillNames.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2.5 py-1 rounded bg-surface-container-low text-on-surface font-caption text-caption font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <Link
                                to={`/opportunities/${opp.slug || opp._id}`}
                                className="px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors"
                              >
                                View Opportunity
                              </Link>
                              <button
                                onClick={() => handleApplyClick(opp)}
                                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                                type="button"
                              >
                                <span>Apply Now</span>
                                <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}

                {/* PAGINATION BAR */}
                {!loading && opps.length > 0 && (
                  <div
                    className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md mt-space-lg"
                    id="pagination-bar"
                  >
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Showing{' '}
                      <strong className="text-on-surface font-semibold">
                        {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)}
                      </strong>{' '}
                      of <strong className="text-on-surface font-semibold">{pagination.total.toLocaleString()}</strong> verified results
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={pagination.page <= 1}
                        className="px-3 py-1.5 rounded-lg bg-surface-container-low text-outline disabled:cursor-not-allowed disabled:opacity-40 font-label-md text-label-md flex items-center gap-1 cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                        Previous
                      </button>
                      {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          onClick={() => setPage(num)}
                          className={`w-8 h-8 rounded-lg font-label-md text-label-md font-bold flex items-center justify-center transition-colors cursor-pointer ${
                            pagination.page === num
                              ? 'bg-primary text-on-primary shadow-sm'
                              : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                          }`}
                          type="button"
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage((p) => Math.min(pagination.totalPages || 1, p + 1))}
                        disabled={pagination.page >= (pagination.totalPages || 1)}
                        className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        type="button"
                      >
                        Next
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Curated Collegiate Track Banner (Bottom Anchor) */}
            <div className="mt-space-xl bg-gradient-to-r from-primary via-primary-container to-secondary rounded-2xl p-space-lg text-on-primary shadow-lg flex flex-col md:flex-row items-center justify-between gap-space-lg">
              <div className="space-y-space-xs max-w-2xl">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-on-primary/15 font-label-sm text-label-sm uppercase tracking-wider text-on-primary">
                  <span className="material-symbols-outlined text-[14px]">school</span> Fast-Track Pipeline
                </span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-primary">
                  Need direct referrals to Google, Microsoft, or top YC cohorts?
                </h3>
                <p className="font-body-md text-body-md text-on-primary/80">
                  Upload your resume scorecard once. Our verified recruitment network directly routes high-signal applicants to technical hiring leads.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-3">
                <Link
                  to="/student/profile"
                  className="px-space-lg py-3 rounded-xl bg-on-primary text-primary hover:bg-surface-bright font-title-md text-title-md font-semibold transition-all shadow-md inline-flex items-center gap-2"
                >
                  <span>Get Resume Scorecard</span>
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};


export default OpportunityListing;