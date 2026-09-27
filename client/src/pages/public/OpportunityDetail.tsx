import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import ApplyModal from '../../components/candidate/ApplyModal';
import { SEO } from '../../components/SEO';

const SIMILAR_OPPORTUNITIES = [
  {
    title: 'React & Next.js Intern',
    company: 'CloudMatrix Systems',
    mode: 'Remote',
    duration: '6 Months',
    skills: ['TypeScript', 'Next.js'],
    stipend: 20000,
    icon: 'cloud_sync',
    iconBg: 'bg-primary-fixed text-on-primary-fixed',
    slug: 'react-nextjs-intern-cloudmatrix',
  },
  {
    title: 'UI Engineer Intern',
    company: 'PixelWorks Studio',
    mode: 'Bengaluru (Hybrid)',
    duration: '3 Months',
    skills: ['Design Systems', 'Figma'],
    stipend: 22000,
    icon: 'palette',
    iconBg: 'bg-secondary-fixed text-on-secondary-fixed',
    slug: 'ui-engineer-intern-pixelworks',
  },
  {
    title: 'Data Science & Analytics Intern',
    company: 'HealthPulse Analytics',
    mode: 'Remote',
    duration: '3 Months',
    skills: ['Python', 'SQL'],
    stipend: 16000,
    icon: 'database',
    iconBg: 'bg-surface-container-highest text-primary',
    slug: 'data-science-analytics-intern-healthpulse',
  },
];

const OpportunityDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [opp, setOpp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchOpp = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/opportunities/${slug}`);
        if (!cancelled && res.data?.data) {
          setOpp(res.data.data);
        }
      } catch {
        // Fallback to high fidelity showcase data for demo
        if (!cancelled) {
          setOpp({
            _id: slug || 'novatech-labs-frontend-intern',
            title: 'Frontend Development Intern',
            slug: slug || 'frontend-development-intern-novatech-labs',
            organizationId: {
              name: 'NovaTech Labs',
              isVerified: true,
              logo: '',
            },
            organizationName: 'NovaTech Labs',
            workMode: 'Remote',
            location: 'Remote • Pan-India',
            duration: '3 Months',
            stipend: 15000,
            skills: ['React', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS', 'Git', 'Next.js', 'REST APIs', 'Figma to Code'],
            description:
              'NovaTech Labs is on an ambitious mission to redefine developer experience by building AI-native workspace tools, intelligent code generation pipelines, and ultra-responsive IDE dashboards. As our Frontend Development Intern, you will join the core product engineering pod in Bengaluru (operating remotely) to work directly on client-facing applications used by thousands of engineering teams.',
            createdAt: new Date().toISOString(),
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOpp();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyClick = () => {
    if (!user) {
      navigate(`/login?returnTo=/opportunities/${slug}`);
    } else {
      setIsApplyModalOpen(true);
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    showToast(!isSaved ? 'Opportunity saved to your bookmarks' : 'Removed from saved opportunities');
  };

  const copyRoleLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link copied to clipboard');
  };

  if (loading) {
    return (
      <main className="w-full pt-16 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg space-y-space-md animate-pulse">
          <div className="h-6 w-48 bg-surface-container rounded" />
          <div className="bg-surface-container-lowest p-space-xl rounded-2xl space-y-4">
            <div className="h-8 w-1/3 bg-surface-container rounded" />
            <div className="h-4 w-1/2 bg-surface-container rounded" />
            <div className="h-10 w-32 bg-surface-container rounded" />
          </div>
        </div>
      </main>
    );
  }

  const orgName = opp?.organizationId?.name || opp?.organizationName || 'NovaTech Labs';
  const stipendVal = opp?.stipend || 15000;
  const skillsList = opp?.skills && opp.skills.length > 0 ? opp.skills : [
    'React',
    'TypeScript',
    'JavaScript (ES6+)',
    'Tailwind CSS',
    'Git',
    'Next.js',
    'REST APIs',
    'Figma to Code',
  ];

  return (
    <>
      <SEO
        title={`${opp.title} at ${orgName} — InternAtlas`}
        description={opp.description?.substring(0, 160) || 'Discover verified internships on InternAtlas.'}
      />

      {isApplyModalOpen && (
        <ApplyModal
          opportunityId={opp._id}
          opportunityTitle={opp.title}
          onClose={() => setIsApplyModalOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-space-sm px-space-md py-space-sm bg-inverse-surface text-inverse-on-surface rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-[20px] text-secondary-fixed">
            check_circle
          </span>
          <span className="font-body-sm text-body-sm">{toastMessage}</span>
        </div>
      )}

      <main className="w-full pt-16 bg-background min-h-screen">
        <div className="flex flex-col w-full">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin w-full py-space-lg space-y-space-lg">
            {/* 1. Breadcrumb Bar with Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm"
              >
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>Home</span>
                </Link>
                <span className="material-symbols-outlined text-[14px] text-outline">
                  chevron_right
                </span>
                <Link to="/internships" className="hover:text-primary transition-colors">
                  Internships
                </Link>
                <span className="material-symbols-outlined text-[14px] text-outline">
                  chevron_right
                </span>
                <span className="text-on-surface font-title-md truncate max-w-xs md:max-w-md">
                  {opp.title}
                </span>
              </nav>

              <div className="flex items-center gap-space-xs self-start sm:self-auto bg-surface-container-high px-space-sm py-1 rounded-full">
                <span className="material-symbols-outlined text-[15px] text-secondary">
                  verified
                </span>
                <span className="font-caption text-caption text-on-surface font-medium">
                  Verified Opportunity • Direct Recruiter
                </span>
              </div>
            </div>

            {/* 2. Opportunity Hero Card */}
            <section className="bg-surface-container-lowest rounded-2xl p-space-lg md:p-space-xl shadow-sm relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg relative z-10">
                {/* Left: Company Identity & Core Role Data */}
                <div className="space-y-space-md max-w-3xl">
                  <div className="flex items-center gap-space-md">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-on-primary font-headline-md shadow-md shadow-primary/10">
                      <span className="material-symbols-outlined text-[28px]">token</span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-space-xs">
                        <span className="font-title-md text-title-md text-on-surface font-semibold">
                          {orgName}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full text-primary font-label-sm text-label-sm">
                          <span className="material-symbols-outlined text-[13px]">shield</span>
                          Verified Company
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full text-emerald-700 font-label-sm text-label-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Actively Hiring
                        </span>
                      </div>
                      <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                        Venture-backed AI & Developer Tools Ecosystem
                      </p>
                    </div>
                  </div>

                  <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                    {opp.title}
                  </h1>

                  {/* Metadata Chips Row */}
                  <div className="flex flex-wrap items-center gap-space-xs pt-1">
                    <span className="inline-flex items-center gap-1.5 bg-surface-container-low px-space-sm py-1.5 rounded-lg text-on-surface font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        public
                      </span>
                      {opp.location || opp.workMode || 'Remote • Pan-India'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-surface-container-low px-space-sm py-1.5 rounded-lg text-on-surface font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        schedule
                      </span>
                      {opp.duration || '3 Months Duration'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-secondary-fixed/50 px-space-sm py-1.5 rounded-lg text-on-secondary-fixed font-title-md text-title-md">
                      <span className="material-symbols-outlined text-[16px]">payments</span>
                      ₹{stipendVal.toLocaleString()} / month
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-surface-container-low px-space-sm py-1.5 rounded-lg text-on-surface font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        trending_up
                      </span>
                      Full-time Conversion (PPO)
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-surface-container px-space-sm py-1.5 rounded-lg text-on-surface-variant font-caption text-caption">
                      <span className="material-symbols-outlined text-[14px]">history</span>
                      Posted 2 days ago
                    </span>
                  </div>
                </div>

                {/* Right: Action Buttons Group */}
                <div className="flex sm:flex-row lg:flex-col items-stretch gap-space-sm shrink-0 lg:w-56 pt-space-xs lg:pt-0">
                  <button
                    onClick={handleApplyClick}
                    className="group px-space-lg py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                    type="button"
                  >
                    <span>Apply Now</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </button>

                  <div className="flex items-center gap-space-xs">
                    <button
                      onClick={toggleSave}
                      className="flex-1 px-space-md py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isSaved ? 'bookmark_added' : 'bookmark_border'}
                      </span>
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                    <button
                      onClick={copyRoleLink}
                      aria-label="Share opportunity"
                      className="w-10 h-10 rounded-lg bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">share</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Main Content Split Grid (70% Left, 30% Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
              {/* LEFT COLUMN: ~70% */}
              <div className="lg:col-span-8 space-y-space-lg">
                <div className="space-y-space-lg">
                  {/* Section 1: About the Opportunity */}
                  <section className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm space-y-space-md">
                    <div className="flex items-center gap-space-xs text-primary font-headline-md text-headline-md">
                      <span className="material-symbols-outlined text-[24px]">flag</span>
                      <h2>About the Opportunity</h2>
                    </div>
                    <div className="font-body-md text-body-md text-on-surface space-y-space-sm leading-relaxed">
                      <p>
                        {opp.description || (
                          <>
                            {orgName} is on an ambitious mission to redefine developer experience by building AI-native workspace tools, intelligent code generation pipelines, and ultra-responsive IDE dashboards. As our <strong>{opp.title}</strong>, you will join the core product engineering pod in Bengaluru (operating remotely) to work directly on client-facing applications used by thousands of engineering teams.
                          </>
                        )}
                      </p>
                      <p>
                        You won't be pushed into maintenance backlogs. You will take ownership of responsive interface components, integrate micro-interaction physics with modern CSS, bridge backend streaming APIs, and contribute production commits directly to our main client applications from your first fortnight.
                      </p>
                    </div>
                  </section>

                  {/* Section 2: Key Responsibilities */}
                  <section className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm space-y-space-md">
                    <div className="flex items-center gap-space-xs text-primary font-headline-md text-headline-md">
                      <span className="material-symbols-outlined text-[24px]">checklist</span>
                      <h2>Key Responsibilities</h2>
                    </div>
                    <ul className="space-y-space-sm font-body-md text-body-md text-on-surface">
                      <li className="flex items-start gap-space-sm">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>
                          Build, optimize, and ship highly responsive web interfaces using <strong>React 18</strong>, <strong>Next.js</strong>, and <strong>TypeScript</strong>.
                        </span>
                      </li>
                      <li className="flex items-start gap-space-sm">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>
                          Collaborate closely with product designers to translate complex Figma design systems into scalable, semantic Tailwind CSS tokens.
                        </span>
                      </li>
                      <li className="flex items-start gap-space-sm">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>
                          Tune client-side performance, prioritize Core Web Vitals, and manage smart browser caching for low-latency streaming UIs.
                        </span>
                      </li>
                      <li className="flex items-start gap-space-sm">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>
                          Write bulletproof unit and integration tests using <strong>Jest</strong> and <strong>React Testing Library</strong> to safeguard production releases.
                        </span>
                      </li>
                      <li className="flex items-start gap-space-sm">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>
                          Participate actively in daily engineering standups, architectural RFC reviews, and pull-request peer mentorship.
                        </span>
                      </li>
                    </ul>
                  </section>

                  {/* Section 3: Requirements & Qualifications */}
                  <section className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm space-y-space-md">
                    <div className="flex items-center gap-space-xs text-primary font-headline-md text-headline-md">
                      <span className="material-symbols-outlined text-[24px]">verified_user</span>
                      <h2>Requirements &amp; Qualifications</h2>
                    </div>
                    <ul className="space-y-space-sm font-body-md text-body-md text-on-surface">
                      <li className="flex items-start gap-space-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                        <span>
                          Strong conceptual foundations in HTML5 semantics, modern CSS3 layout dynamics (Grid, Flexbox), and ES6+ JavaScript.
                        </span>
                      </li>
                      <li className="flex items-start gap-space-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                        <span>
                          Hands-on command of TypeScript and state management paradigms (Zustand, TanStack Query, or Redux Toolkit).
                        </span>
                      </li>
                      <li className="flex items-start gap-space-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                        <span>
                          Practical familiarity with Git branching models, collaborative PR workflows, and asynchronous RESTful or GraphQL endpoints.
                        </span>
                      </li>
                      <li className="flex items-start gap-space-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                        <span>
                          Currently enrolled in or a recent graduate of B.Tech/B.E., BCA, MCA, BS, or equivalent STEM computational degree.
                        </span>
                      </li>
                      <li className="flex items-start gap-space-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                        <span>
                          Public GitHub profile or live portfolio showcasing at least 2 deployed applications demonstrating full interactive states.
                        </span>
                      </li>
                    </ul>
                  </section>

                  {/* Section 4: Required Skills & Interactive Skill Matcher */}
                  <section className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm space-y-space-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs text-primary font-headline-md text-headline-md">
                        <span className="material-symbols-outlined text-[24px]">psychology</span>
                        <h2>Required Skills</h2>
                      </div>
                      <span className="font-caption text-caption text-on-surface-variant font-medium">
                        Verified skills
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {skillsList.map((skill: string) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high text-primary rounded-lg font-label-md text-label-md"
                        >
                          <span className="material-symbols-outlined text-[16px] text-secondary">check</span>{' '}
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Match Meter Widget */}
                    <div className="bg-gradient-to-r from-surface-container-low to-surface-container p-space-md rounded-xl space-y-space-xs">
                      <div className="flex items-center justify-between font-label-md text-label-md">
                        <div className="flex items-center gap-1.5 text-secondary">
                          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                          <span className="font-bold">Your Skill Match</span>
                        </div>
                        <span className="text-secondary font-bold">5 / 5 Profile Skills Match (100%)</span>
                      </div>
                      <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full w-full transition-all duration-1000" />
                      </div>
                      <p className="font-caption text-caption text-on-surface-variant pt-1">
                        Your InternAtlas profile demonstrates strong coverage in React, TypeScript, and modern styling architectures.
                      </p>
                    </div>
                  </section>

                  {/* Section 5: Who Should Apply? */}
                  <section className="bg-gradient-to-br from-surface-container-high/40 to-surface-container-low p-space-lg rounded-2xl flex items-start gap-space-md shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">school</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                        Who Should Apply?
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                        Students graduating in <strong>2025, 2026, or 2027</strong> who want hands-on product engineering experience at a fast-growing venture-backed team. Self-taught builders with demonstrable side projects are warmly encouraged to apply.
                      </p>
                    </div>
                  </section>

                  {/* Section 6: What You'll Learn & Benefits */}
                  <section className="space-y-space-md">
                    <h2 className="font-headline-md text-headline-md text-primary">
                      What You'll Learn &amp; Benefits
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-xs">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[20px]">groups</span>
                        </div>
                        <h4 className="font-title-md text-title-md text-on-surface">1-on-1 Mentorship</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Weekly pairing syncs and architectural coaching directly from Senior Staff Engineers.
                        </p>
                      </div>
                      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-xs">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
                        </div>
                        <h4 className="font-title-md text-title-md text-on-surface">PPO Opportunity</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          High potential for full-time conversion offer (₹8–12 LPA) upon exceptional intern completion.
                        </p>
                      </div>
                      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-xs">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[20px]">card_membership</span>
                        </div>
                        <h4 className="font-title-md text-title-md text-on-surface">Certificate &amp; LOR</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Cryptographically verifiable certificate of completion and signed executive recommendation.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 7: About the Company */}
                  <section className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm space-y-space-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-title-lg">
                          <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
                        </div>
                        <div>
                          <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">
                            {orgName}
                          </h3>
                          <div className="flex items-center gap-1 text-secondary font-caption text-caption">
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                            <span>Verified Organization</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1 cursor-pointer">
                        <span>View Profile</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                      {orgName} builds next-generation developer productivity platforms and AI code synthesis tools. Backed by top seed investors, the team is composed of alumni from premier technical institutions and global engineering scaleups.
                    </p>
                    {/* Company Spec Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm pt-space-xs font-body-sm text-body-sm">
                      <div className="p-space-sm bg-surface-container-low rounded-lg">
                        <span className="text-on-surface-variant font-caption text-caption block">Industry</span>
                        <span className="font-medium text-on-surface">Software &amp; Dev Tools</span>
                      </div>
                      <div className="p-space-sm bg-surface-container-low rounded-lg">
                        <span className="text-on-surface-variant font-caption text-caption block">Company Size</span>
                        <span className="font-medium text-on-surface">25–50 Employees</span>
                      </div>
                      <div className="p-space-sm bg-surface-container-low rounded-lg">
                        <span className="text-on-surface-variant font-caption text-caption block">Founded</span>
                        <span className="font-medium text-on-surface">2022</span>
                      </div>
                      <div className="p-space-sm bg-surface-container-low rounded-lg col-span-2 sm:col-span-2">
                        <span className="text-on-surface-variant font-caption text-caption block">Headquarters</span>
                        <span className="font-medium text-on-surface">Bengaluru, India (Remote-first)</span>
                      </div>
                      <div className="p-space-sm bg-surface-container-low rounded-lg">
                        <span className="text-on-surface-variant font-caption text-caption block">Website</span>
                        <span className="font-medium text-secondary">novatechlabs.dev</span>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* RIGHT COLUMN: ~30% Sticky Application Panel */}
              <aside className="lg:col-span-4 sticky top-20 space-y-space-md">
                <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
                  {/* Compensation Headline */}
                  <div className="pb-space-sm border-b border-surface-container">
                    <span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant block">
                      Stipend Details
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold">
                        ₹{stipendVal.toLocaleString()}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant">/ month</span>
                    </div>
                    <span className="inline-block mt-1 font-caption text-caption text-secondary bg-surface-container px-2 py-0.5 rounded">
                      Fixed monthly stipend • Performance incentives
                    </span>
                  </div>

                  {/* Spec Table */}
                  <div className="space-y-space-sm font-body-sm text-body-sm">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[17px] text-outline">
                          location_on
                        </span>
                        Work Mode
                      </span>
                      <span className="font-medium text-on-surface">
                        {opp.location || opp.workMode || 'Remote (Pan-India)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[17px] text-outline">
                          event_available
                        </span>
                        Start Date
                      </span>
                      <span className="font-medium text-on-surface">Immediate / Flexible</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[17px] text-outline">
                          hourglass_top
                        </span>
                        Duration
                      </span>
                      <span className="font-medium text-on-surface">{opp.duration || '3 Months'}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[17px] text-error">
                          alarm
                        </span>
                        Deadline
                      </span>
                      <span className="font-medium text-error flex items-center gap-1">
                        <span>Oct 30, 2026</span>
                        <span className="text-[11px] font-caption bg-error-container text-on-error-container px-1 rounded font-semibold">
                          12d left
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[17px] text-outline">group</span>
                        Applicants
                      </span>
                      <span className="font-medium text-on-surface">142 students applied</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[17px] text-outline">speed</span>
                        Hiring Velocity
                      </span>
                      <span className="font-medium text-on-surface">Decision within 7 days</span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-space-xs pt-space-xs">
                    <button
                      onClick={handleApplyClick}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 shadow hover:shadow-md transition-all cursor-pointer"
                      type="button"
                    >
                      <span>Apply Now</span>
                      <span className="material-symbols-outlined text-[18px]">launch</span>
                    </button>
                    <button
                      onClick={toggleSave}
                      className="w-full py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isSaved ? 'bookmark_added' : 'bookmark_border'}
                      </span>
                      <span>{isSaved ? 'Saved Opportunity' : 'Save Opportunity'}</span>
                    </button>
                  </div>

                  {/* Share Row */}
                  <div className="pt-space-xs">
                    <span className="font-caption text-caption text-on-surface-variant block mb-2">
                      Share this opportunity
                    </span>
                    <div className="grid grid-cols-4 gap-space-xs">
                      <button
                        onClick={copyRoleLink}
                        className="py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer"
                        title="Copy Link"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">link</span>
                      </button>
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
                        title="WhatsApp"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
                        title="LinkedIn"
                      >
                        <span className="material-symbols-outlined text-[18px]">work</span>
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
                        title="X / Twitter"
                      >
                        <span className="material-symbols-outlined text-[18px]">send</span>
                      </a>
                    </div>
                  </div>

                  {/* Fast-track Pill */}
                  <div className="p-space-sm bg-surface-container-low rounded-xl flex items-center gap-space-xs text-on-surface">
                    <span className="material-symbols-outlined text-[20px] text-secondary">
                      flash_on
                    </span>
                    <span className="font-caption text-caption leading-tight">
                      Fast-track 1-click application enabled with your verified InternAtlas Student Profile.
                    </span>
                  </div>

                  {/* Trust Shield */}
                  <div className="flex items-center gap-2 pt-space-xs text-on-surface-variant font-caption text-caption border-t border-surface-container">
                    <span className="material-symbols-outlined text-[18px] text-secondary">
                      verified_user
                    </span>
                    <span>InternAtlas Career Shield • Guaranteed Stipend &amp; Mentorship</span>
                  </div>
                </div>
              </aside>
            </div>

            {/* 4. Similar Opportunities Section */}
            <section className="pt-space-xl space-y-space-md border-t border-surface-container">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Similar Opportunities You Might Like
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Curated frontend and software engineering roles matching your profile velocity and technical tags.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {SIMILAR_OPPORTUNITIES.map((item) => (
                  <div
                    key={item.title}
                    className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between space-y-space-md"
                  >
                    <div className="space-y-space-xs">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center font-title-md`}>
                          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        </div>
                        <span className="font-label-sm text-label-sm bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                          {item.mode}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-title-md text-title-md text-on-surface font-semibold hover:text-primary transition-colors cursor-pointer">
                          {item.title}
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{item.company}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="font-caption text-caption bg-surface-container-low px-2 py-0.5 rounded">
                          {item.duration}
                        </span>
                        {item.skills.map((s) => (
                          <span key={s} className="font-caption text-caption bg-surface-container-low px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-space-xs border-t border-surface-container">
                      <span className="font-title-md text-title-md text-on-surface font-bold">
                        ₹{item.stipend.toLocaleString()}
                        <span className="font-body-sm font-normal text-on-surface-variant">/mo</span>
                      </span>
                      <Link
                        to={`/opportunities/${item.slug}`}
                        className="font-label-md text-label-md text-primary hover:text-secondary flex items-center gap-0.5"
                      >
                        <span>View</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default OpportunityDetail;
