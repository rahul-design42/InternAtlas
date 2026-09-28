import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ApplyModal from '../../components/candidate/ApplyModal';
import { SEO } from '../../components/SEO';
import { DUMMY_OPPORTUNITIES } from '../../data/dummyData';

interface SkillObj { _id: string; name: string }

interface OpportunityItem {
  _id: string;
  title: string;
  slug: string;
  type: string;
  workMode: string;
  location: string;
  description?: string;
  duration?: string;
  stipend?: string | number;
  skills?: (string | SkillObj)[];
  organizationId?: { _id: string; name: string; logo?: string };
  organizationName?: string;
  createdAt: string;
}

const MAX_STIPEND = 50000;

const CATEGORIES = [
  { icon: 'bar_chart', name: 'Data Analysis', color: 'text-blue-600' },
  { icon: 'grid_view', name: 'Data Science', color: 'text-indigo-600' },
  { icon: 'terminal', name: 'Software Development', color: 'text-blue-600' },
  { icon: 'campaign', name: 'Digital Marketing', color: 'text-blue-600' },
  { icon: 'code', name: 'Web Development', color: 'text-blue-600' },
  { icon: 'palette', name: 'Design', color: 'text-rose-500' },
];

const FEATURED = [
  { title: 'Digital Shram Sankalp', company: 'Government of India', cta: 'Register Now', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png' },
  { title: 'Maruti Suzuki XCElerate 2026', company: 'Maruti Suzuki', cta: 'Register Now', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Maruti_Suzuki_Logo.svg/2048px-Maruti_Suzuki_Logo.svg.png' },
  { title: 'Unlock Unlimited Learning', company: 'Coursera', cta: '₹ 7,499/Year', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/2048px-Coursera-Logo_600x600.svg.png' },
  { title: 'Fund My Crazy (Google Gemini)', company: 'Google', cta: 'Register Now', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png' },
  { title: 'Yuva Yodha Energy Tech Hackathon', company: 'Yuva Yodha', cta: 'Register Now', img: '' },
  { title: 'ET AI Hackathon: Agentic Edition', company: 'The Economic Times', cta: 'Explore Now', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/The_Economic_Times_logo.svg/2560px-The_Economic_Times_logo.svg.png' },
];

const FILTER_GROUPS: { title: string; items: string[]; more?: boolean }[] = [
  { title: 'Experience', items: ['Fresher only', 'No prior experience'] },
  { title: 'Roles', items: ['Engineering', 'Product', 'Design', 'Marketing', 'Operations', 'Human Resources'], more: true },
  { title: 'Eligibility', items: ['Undergraduate', 'Postgraduate', 'MBA', 'High school'] },
  { title: 'Category', items: ['Internships', 'Part-time', 'Virtual', 'Campus Ambassador'] },
];

// Brand tiles for company logos (used when a logo image is missing or fails to load)
const BRANDS: Record<string, { bg: string; fg: string; label: string }> = {
  airbnb: { bg: '#fff', fg: '#ff385c', label: '⌂' },
  swiggy: { bg: '#fc8019', fg: '#fff', label: 'S' },
  zomato: { bg: '#e23744', fg: '#fff', label: 'zomato' },
  groww: { bg: '#fff', fg: '#00d09c', label: '◐' },
  razorpay: { bg: '#fff', fg: '#0c2451', label: 'R' },
  amazon: { bg: '#fff', fg: '#ff9900', label: 'a' },
};

const CompanyLogo = ({ name, logo, size = 'w-14 h-14' }: { name: string; logo?: string; size?: string }) => {
  const [failed, setFailed] = useState(false);
  const key = name.toLowerCase();
  const box = `${size} shrink-0 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 bg-white`;

  if (logo && !failed) {
    return <div className={`${box} p-2`}><img src={logo} alt={name} onError={() => setFailed(true)} className="w-full h-full object-contain" /></div>;
  }
  if (key.includes('google')) {
    return (
      <div className={box}>
        <span className="text-[30px] font-bold leading-none bg-gradient-to-br from-[#4285f4] via-[#ea4335] to-[#34a853] bg-clip-text text-transparent">G</span>
      </div>
    );
  }
  if (key.includes('microsoft')) {
    return (
      <div className={box}>
        <div className="grid grid-cols-2 gap-[3px]">
          <i className="w-[15px] h-[15px] bg-[#f25022]" /><i className="w-[15px] h-[15px] bg-[#7fba00]" />
          <i className="w-[15px] h-[15px] bg-[#00a4ef]" /><i className="w-[15px] h-[15px] bg-[#ffb900]" />
        </div>
      </div>
    );
  }
  const brand = Object.entries(BRANDS).find(([k]) => key.includes(k))?.[1];
  return (
    <div className={box} style={{ background: brand?.bg || '#eff6ff' }}>
      <span
        className={`font-extrabold ${brand && brand.label.length > 2 ? 'text-[12px] italic' : 'text-[24px]'}`}
        style={{ color: brand?.fg || '#3b82f6' }}
      >
        {brand?.label || name.charAt(0)}
      </span>
    </div>
  );
};

const OpportunityListing = ({ type = 'internship' }: { type?: string }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [opps, setOpps] = useState<OpportunityItem[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');
  const [locationKeyword, setLocationKeyword] = useState(searchParams.get('location') || '');
  const [workModes, setWorkModes] = useState<string[]>(searchParams.getAll('workMode'));
  const [minStipend, setMinStipend] = useState(Number(searchParams.get('minStipend')) || 0);
  const [maxStipend, setMaxStipend] = useState(Number(searchParams.get('maxStipend')) || MAX_STIPEND);
  const [selectedDurations, setSelectedDurations] = useState<string[]>(searchParams.getAll('duration'));
  const [checked, setChecked] = useState<string[]>([]);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [selectedOppForApply, setSelectedOppForApply] = useState<{ id: string; title: string } | null>(null);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.set('search', searchKeyword.trim());
    if (locationKeyword.trim()) params.set('location', locationKeyword.trim());
    workModes.forEach((wm) => params.append('workMode', wm));
    selectedDurations.forEach((d) => params.append('duration', d));
    if (minStipend > 0) params.set('minStipend', String(minStipend));
    if (maxStipend < MAX_STIPEND) params.set('maxStipend', String(maxStipend));
    if (page > 1) params.set('page', String(page));
    setSearchParams(params, { replace: true });
  }, [searchKeyword, locationKeyword, workModes, selectedDurations, minStipend, maxStipend, page, setSearchParams]);

  // Reset when type changes
  useEffect(() => {
    setSearchKeyword(''); setLocationKeyword(''); setWorkModes([]); setSelectedDurations([]);
    setMinStipend(0); setMaxStipend(MAX_STIPEND); setPage(1);
  }, [type]);

  // Filter dummy data
  useEffect(() => {
    setLoading(true);
    const t = type.toUpperCase();
    const validType = ['INTERNSHIP', 'JOB', 'HACKATHON', 'COMPETITION'].includes(t) ? t : 'INTERNSHIP';
    let list: any[] = DUMMY_OPPORTUNITIES.filter((o: any) => o.type === validType);

    const kw = searchKeyword.trim().toLowerCase();
    if (kw) list = list.filter((o) => o.title.toLowerCase().includes(kw) || (o.description || '').toLowerCase().includes(kw));

    const loc = locationKeyword.trim().toLowerCase();
    if (loc) list = list.filter((o) => o.location.toLowerCase().includes(loc));

    if (workModes.length) {
      const map: Record<string, string> = { 'Work from home': 'REMOTE', Remote: 'REMOTE', Hybrid: 'HYBRID', 'On-site': 'ON_SITE' };
      const modes = workModes.map((m) => map[m] || m.toUpperCase());
      list = list.filter((o) => modes.includes(o.workMode));
    }

    if (selectedDurations.length && (validType === 'INTERNSHIP' || validType === 'HACKATHON')) {
      list = list.filter((o) => !!o.duration && selectedDurations.some((d) => o.duration.includes(d)));
    }

    if (validType === 'INTERNSHIP' && (minStipend > 0 || maxStipend < MAX_STIPEND)) {
      list = list.filter((o) => o.stipendAmount && o.stipendAmount >= minStipend && o.stipendAmount <= maxStipend);
    }

    const limit = 9;
    const totalPages = Math.max(1, Math.ceil(list.length / limit));
    const current = Math.min(Math.max(1, page), totalPages);
    setOpps(list.slice((current - 1) * limit, current * limit));
    setPagination({ total: list.length, page: current, totalPages });
    setLoading(false);
  }, [type, page, searchKeyword, locationKeyword, workModes, selectedDurations, minStipend, maxStipend]);

  const toggleIn = (setter: React.Dispatch<React.SetStateAction<string[]>>, v: string) => {
    setter((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
    setPage(1);
  };

  const handleReset = () => {
    setSearchKeyword(''); setLocationKeyword(''); setWorkModes([]); setSelectedDurations([]);
    setChecked([]); setMinStipend(0); setMaxStipend(MAX_STIPEND); setPage(1);
  };

  const toggleBookmark = (id: string) =>
    setBookmarkedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleApply = (opp: OpportunityItem) => {
    if (!user) navigate(`/login?returnTo=/opportunities/${opp.slug || opp._id}`);
    else setSelectedOppForApply({ id: opp._id, title: opp.title });
  };

  const Check = ({ label, on, onChange }: { label: string; on: boolean; onChange: () => void }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input type="checkbox" checked={on} onChange={onChange} className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer" />
      <span className="text-[13px] text-slate-600 group-hover:text-blue-600 transition-colors">{label}</span>
    </label>
  );

  const heading = 'text-[13px] font-bold text-[#0f172a]';
  const input = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500';
  const minPct = (minStipend / MAX_STIPEND) * 100;
  const maxPct = (maxStipend / MAX_STIPEND) * 100;

  return (
    <>
      <SEO
        title={`${type.charAt(0).toUpperCase() + type.slice(1)}s — InternAtlas`}
        description={`Discover vetted ${type}s engineered to launch competitive careers.`}
      />

      <style>{`
        .dual-range input{position:absolute;left:0;width:100%;height:0;margin:0;background:none;pointer-events:none;-webkit-appearance:none;appearance:none}
        .dual-range input::-webkit-slider-thumb{pointer-events:auto;-webkit-appearance:none;width:16px;height:16px;border-radius:9999px;background:#fff;border:2px solid #2563eb;cursor:pointer;box-shadow:0 1px 3px rgba(37,99,235,.3)}
        .dual-range input::-moz-range-thumb{pointer-events:auto;width:12px;height:12px;border-radius:9999px;background:#fff;border:2px solid #2563eb;cursor:pointer}
      `}</style>

      {selectedOppForApply && (
        <ApplyModal
          opportunityId={selectedOppForApply.id}
          opportunityTitle={selectedOppForApply.title}
          onClose={() => setSelectedOppForApply(null)}
        />
      )}

      <main className="w-full bg-[#f7f9fc] min-h-screen pb-16">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[linear-gradient(100deg,#eaf1ff_0%,#f7f9ff_45%,#ffffff_65%,#fde9f1_100%)] pt-12 pb-8 px-6">
          {/* decorative pastel shapes */}
          <div className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[#ffd6e5]/70 blur-[2px]" />
          <div className="pointer-events-none absolute right-24 top-24 h-44 w-44 rotate-12 rounded-[42px] bg-[#d8e6ff]/80" />
          <div className="pointer-events-none absolute left-[43%] top-20 h-32 w-32 rotate-45 rounded-[28px] bg-[#e5ddff]/60" />

          <div className="max-w-[1400px] mx-auto relative">
            <p className="text-[#3b82f6] text-[11px] font-bold tracking-[0.14em] uppercase">For India's Next Generation</p>
            <h1 className="mt-2 text-[#0f1b3d] text-4xl md:text-[52px] leading-[1.1] font-extrabold tracking-tight">
              10,000+ Internships <span className="font-serif italic font-bold text-[#e11d48]">in India</span>
            </h1>
            <p className="text-slate-500 text-[15px] mt-3">Paid, work from home &amp; summer internships for students and freshers</p>

            <div className="hidden md:block absolute right-2 top-0 -rotate-6">
              <span className="font-hand text-[26px] text-[#132240] leading-[1.1] block">Real<br />opportunities<br />for a brighter<br />tomorrow.</span>
              <div className="h-[3px] mt-1.5 rounded-full bg-gradient-to-r from-pink-400 to-blue-400 opacity-80" />
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); setPage(1); }}
              className="mt-8 flex flex-col md:flex-row items-stretch md:items-center bg-white rounded-2xl md:rounded-full p-2 border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.06)] max-w-[1100px]"
            >
              <div className="flex-1 flex items-center gap-3 px-4 py-2.5 md:border-r border-slate-200">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                <input value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="Search internships, companies, skills..." className="w-full bg-transparent outline-none text-[15px] text-slate-700 placeholder:text-slate-400" />
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-2.5">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">location_on</span>
                <input value={locationKeyword} onChange={(e) => setLocationKeyword(e.target.value)} placeholder="Location" className="w-full bg-transparent outline-none text-[15px] text-slate-700 placeholder:text-slate-400" />
              </div>
              <button type="submit" className="bg-[#0a1533] text-white px-9 py-3 rounded-full text-[14px] font-semibold hover:bg-[#13224a] transition-colors cursor-pointer">Search</button>
            </form>

            <div className="mt-6 flex gap-3 overflow-x-auto pb-2 md:flex-wrap [scrollbar-width:none]">
              {CATEGORIES.map((c) => (
                <button key={c.name} onClick={() => { setSearchKeyword(c.name); setPage(1); }}
                  className="shrink-0 flex items-center gap-2 bg-white/90 px-4 py-2.5 rounded-full border border-slate-100 shadow-[0_2px_8px_rgba(15,23,42,0.05)] hover:shadow-md transition-shadow cursor-pointer">
                  <span className={`material-symbols-outlined text-[18px] ${c.color}`}>{c.icon}</span>
                  <span className="text-[13px] font-medium text-slate-700">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* LAYOUT */}
        <div className="max-w-[1400px] mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* FILTERS */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(15,23,42,0.03)] p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[20px]">filter_alt</span>
                <span className="text-[16px] font-bold text-[#0f172a]">Filters</span>
              </div>
              <button onClick={handleReset} className="text-[12.5px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">Clear all</button>
            </div>

            <div className="space-y-2">
              <label className={heading}>Keyword</label>
              <input className={input} placeholder="e.g. Marketing, Content..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={heading}>Location</label>
              <input className={input} placeholder="e.g. Delhi, Remote" value={locationKeyword} onChange={(e) => setLocationKeyword(e.target.value)} />
            </div>

            <div className="space-y-2.5">
              <label className={heading}>Type</label>
              {['Work from home', 'On-site', 'Hybrid'].map((m) => (
                <Check key={m} label={m} on={workModes.includes(m)} onChange={() => toggleIn(setWorkModes, m)} />
              ))}
            </div>

            <div className="space-y-2">
              <label className={heading}>Stipend (₹/Month)</label>
              <div className="flex justify-between text-[11px] font-semibold text-slate-500"><span>0</span><span>50K+</span></div>
              <div className="dual-range relative h-5 flex items-center">
                <div className="absolute inset-x-0 h-1 rounded-full bg-slate-200" />
                <div className="absolute h-1 rounded-full bg-blue-600" style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }} />
                <input type="range" min={0} max={MAX_STIPEND} step={5000} value={minStipend}
                  onChange={(e) => setMinStipend(Math.min(Number(e.target.value), maxStipend - 5000))} />
                <input type="range" min={0} max={MAX_STIPEND} step={5000} value={maxStipend}
                  onChange={(e) => setMaxStipend(Math.max(Number(e.target.value), minStipend + 5000))} />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className={heading}>Duration</label>
              {['1 month', '2-3 months', '3-6 months', '6+ months'].map((d) => (
                <Check key={d} label={d} on={selectedDurations.includes(d)} onChange={() => toggleIn(setSelectedDurations, d)} />
              ))}
            </div>

            {FILTER_GROUPS.map((g) => (
              <div key={g.title} className="space-y-2.5">
                <label className={heading}>{g.title}</label>
                {g.items.map((i) => (
                  <Check key={i} label={i} on={checked.includes(`${g.title}:${i}`)} onChange={() => toggleIn(setChecked, `${g.title}:${i}`)} />
                ))}
                {g.more && (
                  <button className="text-[13px] font-semibold text-blue-600 flex items-center gap-1 hover:underline cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">add</span> Show more
                  </button>
                )}
              </div>
            ))}

            <button onClick={() => setPage(1)} className="w-full bg-[#2563eb] text-white py-3 rounded-lg text-[14px] font-semibold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer">
              Apply filters
            </button>
          </aside>

          {/* FEED */}
          <section className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[19px] font-extrabold text-[#0f172a]">{pagination.total.toLocaleString()} Internships</h2>
              <button className="flex items-center gap-1.5 border border-slate-200 bg-white rounded-full px-3.5 py-1.5 hover:bg-slate-50 cursor-pointer">
                <span className="text-[12px] text-slate-500">Sort by:</span>
                <span className="text-[12px] text-slate-700 font-semibold">Most relevant</span>
                <span className="material-symbols-outlined text-[14px] text-slate-500">expand_more</span>
              </button>
            </div>

            {loading ? (
              [1, 2, 3].map((n) => <div key={n} className="bg-white rounded-2xl h-48 animate-pulse border border-slate-100" />)
            ) : opps.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
                <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                <h3 className="font-bold text-slate-800 mt-2">No internships found</h3>
                <p className="text-sm text-slate-500 mt-1">Try adjusting your filters.</p>
              </div>
            ) : (
              opps.map((opp, idx) => {
                const org = opp.organizationId?.name || opp.organizationName || 'Company';
                const stipend = typeof opp.stipend === 'number'
                  ? `₹${Math.round(opp.stipend / 1000)}K / Month`
                  : opp.stipend || '₹20K / Month';
                const days = opp.createdAt ? Math.floor((Date.now() - new Date(opp.createdAt).getTime()) / 864e5) : 2;
                const posted = days <= 0 ? 'Posted today' : days === 1 ? 'Posted 1 day ago' : `Posted ${days} days ago`;
                const skills = (opp.skills || []).map((s) => (typeof s === 'string' ? s : s.name));
                const saved = bookmarkedIds.has(opp._id);

                const SaveBtn = ({ cls = '' }) => (
                  <button onClick={() => toggleBookmark(opp._id)} className={`px-5 py-1.5 rounded-full border text-[13px] font-semibold transition-colors cursor-pointer ${saved ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-700 hover:bg-slate-50'} ${cls}`}>
                    {saved ? 'Saved' : 'Save'}
                  </button>
                );
                const ApplyBtn = ({ cls = '' }) => (
                  <button onClick={() => handleApply(opp)} className={`px-5 py-1.5 rounded-full bg-[#0a1533] text-white text-[13px] font-semibold hover:bg-[#13224a] transition-colors cursor-pointer ${cls}`}>Apply</button>
                );

                return (
                  <article key={opp._id} className="relative bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-shadow">
                    {idx === 0 && (
                      <span className="absolute -top-2.5 left-5 bg-[#fde7ef] text-[#e11d48] text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-pink-200">Featured</span>
                    )}
                    <div className="flex items-start gap-4">
                      <CompanyLogo name={org} logo={opp.organizationId?.logo} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-[17px] font-bold text-[#0f172a] leading-snug">{opp.title}</h3>
                            <p className="text-[13.5px] text-slate-600 mt-0.5">{org}</p>
                          </div>
                          <div className="hidden sm:flex items-center gap-2 shrink-0">
                            <SaveBtn /><ApplyBtn />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-[12px] text-slate-500">
                          <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px]">location_on</span>{opp.location}</span>
                          <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px]">work</span>Full time</span>
                          <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px]">schedule</span>{(opp.duration || '3 months').toLowerCase()}</span>
                        </div>

                        <p className="text-[13px] text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                          {opp.description || 'Create content, run campaigns and support growth initiatives.'}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {skills.slice(0, 3).map((s) => (
                            <span key={s} className="px-3 py-1 bg-[#eef4ff] text-[#4f7fd6] text-[11px] font-medium rounded-full">{s}</span>
                          ))}
                          {skills.length > 3 && (
                            <span className="px-2.5 py-1 bg-[#eef4ff] text-[#4f7fd6] text-[11px] font-medium rounded-full">+{skills.length - 3}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-100/80 to-emerald-50/0 text-emerald-700 text-[12px] font-bold pl-2 pr-6 py-1 rounded-md">
                            <span className="material-symbols-outlined text-[15px] text-emerald-500">check_circle</span>{stipend}
                          </span>
                          <span className="text-[11.5px] text-slate-400">{posted}</span>
                        </div>

                        <div className="flex sm:hidden gap-2 mt-4 pt-3 border-t border-slate-100">
                          <SaveBtn cls="flex-1" /><ApplyBtn cls="flex-1" />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}

            {!loading && opps.length > 0 && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-1.5 border border-slate-200 bg-white rounded-lg text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">Prev</button>
                <span className="px-4 py-1.5 font-bold text-sm bg-white border border-slate-200 rounded-lg">{pagination.page} / {pagination.totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} className="px-4 py-1.5 border border-slate-200 bg-white rounded-lg text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">Next</button>
              </div>
            )}
          </section>

          {/* RIGHT */}
          <aside className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(15,23,42,0.03)] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-bold text-[#0f172a]">Featured Opportunities</h3>
                <button className="text-[12px] font-semibold text-blue-600 flex items-center gap-0.5 hover:underline cursor-pointer">
                  View all <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {FEATURED.map((f) => (
                  <div key={f.title} className="flex gap-3 py-3 first:pt-0 last:pb-0 cursor-pointer group">
                    <CompanyLogo name={f.company} logo={f.img} size="w-11 h-11" />
                    <div className="min-w-0">
                      <h4 className="text-[12.5px] font-bold text-[#0f172a] leading-snug group-hover:text-blue-600">{f.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{f.company}</p>
                      <p className="text-[11px] text-slate-700 font-medium mt-0.5">{f.cta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl p-5 border border-pink-100 bg-gradient-to-br from-[#fff0f5] to-[#fde7ef]">
              <span className="inline-block bg-white/70 text-[#e11d48] text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-3">FOR STUDENTS</span>
              <h3 className="text-[20px] font-extrabold text-[#0f1b3d] leading-snug mb-4">Create your free profile to get matched</h3>
              <ul className="space-y-2.5 mb-5">
                {['Apply in one click', 'Get noticed by top recruiters', 'Track your applications', 'Access resources and events'].map((li) => (
                  <li key={li} className="flex items-center gap-2.5 text-[13px] text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-blue-600 text-[14px]">check</span>
                    </span>{li}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="w-full bg-[#0a1533] text-white py-3 rounded-lg text-[13.5px] font-bold hover:bg-[#13224a] transition-colors flex justify-center items-center gap-1.5">
                Create your account <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <p className="text-center text-[12px] text-slate-500 mt-3">
                Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
              </p>
            </div>

            <div className="rounded-2xl p-5 border border-blue-100 bg-gradient-to-br from-[#f3f8ff] to-[#eaf2ff]">
              <span className="inline-block bg-white/70 text-blue-600 text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-3">FOR COLLEGES</span>
              <h3 className="text-[20px] font-extrabold text-[#0f1b3d] leading-snug mb-2">Hire talented students from InternAtlas</h3>
              <p className="text-[13px] text-slate-600 mb-5 leading-relaxed">Post internships, reach qualified students and build your campus presence.</p>
              <button className="w-full bg-white border border-blue-300 text-blue-700 py-3 rounded-lg text-[13.5px] font-bold hover:bg-blue-50 transition-colors flex justify-center items-center gap-1.5 cursor-pointer">
                Hire on InternAtlas <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default OpportunityListing;
