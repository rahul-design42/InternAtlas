import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import { SEO } from '../../components/SEO';

const POPULAR_CHIPS = [
  'Internships',
  'Remote Jobs',
  'AI & ML',
  'Web Development',
  'Hackathons',
  'Data Science',
];

const INTEREST_AREAS = [
  {
    title: 'AI & Machine Learning',
    count: '240+ opportunities',
    icon: 'psychology',
    badge: 'Trending',
    path: '/internships?q=AI',
  },
  {
    title: 'Web Development',
    count: '380+ opportunities',
    icon: 'code',
    path: '/internships?q=Web',
  },
  {
    title: 'Data Science',
    count: '190+ opportunities',
    icon: 'database',
    path: '/internships?q=Data',
  },
  {
    title: 'Cybersecurity',
    count: '95+ opportunities',
    icon: 'shield',
    path: '/internships?q=Security',
  },
  {
    title: 'UI/UX Design',
    count: '140+ opportunities',
    icon: 'draw',
    path: '/internships?q=Design',
  },
  {
    title: 'Product Management',
    count: '85+ opportunities',
    icon: 'explore',
    path: '/internships?q=Product',
  },
  {
    title: 'Business & Strategy',
    count: '110+ opportunities',
    icon: 'trending_up',
    path: '/internships?q=Business',
  },
  {
    title: 'Growth & Marketing',
    count: '130+ opportunities',
    icon: 'rocket_launch',
    path: '/internships?q=Marketing',
  },
];

const PATHWAYS = [
  {
    title: 'Internships',
    icon: 'school',
    badge: '4,200+ Active',
    badgeClass: 'bg-primary-fixed text-primary',
    desc: 'Gain real-world experience at leading tech firms & fast-growing startups.',
    cta: 'Browse internships',
    ctaColor: 'text-primary',
    path: '/internships',
  },
  {
    title: 'Full-time Jobs',
    icon: 'apartment',
    badge: '1,850+ Openings',
    badgeClass: 'bg-surface-container-high text-on-surface',
    desc: 'Start your professional journey with early-career entry roles.',
    cta: 'Explore entry roles',
    ctaColor: 'text-primary',
    path: '/jobs',
  },
  {
    title: 'Hackathons',
    icon: 'terminal',
    badge: '45+ Live',
    badgeClass: 'bg-secondary-fixed text-on-secondary-fixed',
    desc: 'Build. Compete. Innovate. Win cash prizes and team bounties.',
    cta: 'Find hackathons',
    ctaColor: 'text-secondary',
    path: '/hackathons',
  },
  {
    title: 'Competitions',
    icon: 'emoji_events',
    badge: '80+ Open',
    badgeClass: 'bg-surface-container-high text-on-surface',
    desc: 'Challenge yourself and stand out in case studies & coding sprints.',
    cta: 'View competitions',
    ctaColor: 'text-primary',
    path: '/competitions',
  },
  {
    title: 'Events & Meetups',
    icon: 'event',
    badge: '120+ Scheduled',
    badgeClass: 'bg-surface-container-high text-on-surface',
    desc: 'Learn and connect with industry leaders and student founders.',
    cta: 'Discover events',
    ctaColor: 'text-primary',
    path: '/internships',
  },
  {
    title: 'Contests & Bounties',
    icon: 'military_tech',
    badge: '60+ Contests',
    badgeClass: 'bg-surface-container-high text-on-surface',
    desc: 'Test your skills with open-source bounties & problem solving.',
    cta: 'Earn & solve',
    ctaColor: 'text-primary',
    path: '/internships',
  },
];

const STATIC_FEATURED_OPPS = [
  {
    id: 'static-1',
    initials: 'NL',
    orgName: 'NovaTech Labs',
    title: 'Frontend Development Intern',
    workMode: 'Remote',
    duration: '3 Months',
    stipend: 15000,
    skills: ['React', 'Tailwind', 'TypeScript'],
    posted: 'Posted 2d ago',
    slug: 'frontend-development-intern-novatech-labs',
  },
  {
    id: 'static-2',
    initials: 'DF',
    orgName: 'DataForge AI',
    title: 'Machine Learning Intern',
    workMode: 'Bangalore',
    workModeBadge: 'bg-primary-fixed text-primary',
    duration: '6 Months',
    stipend: 25000,
    skills: ['Python', 'PyTorch', 'FastAPI'],
    posted: 'Posted 1d ago',
    slug: 'machine-learning-intern-dataforge-ai',
  },
  {
    id: 'static-3',
    initials: 'SS',
    orgName: 'SecureStack',
    title: 'Cybersecurity Intern',
    workMode: 'Remote',
    duration: '4 Months',
    stipend: 18000,
    skills: ['NetSec', 'OWASP', 'Linux'],
    posted: 'Posted 3d ago',
    slug: 'cybersecurity-intern-securestack',
  },
  {
    id: 'static-4',
    initials: 'PW',
    orgName: 'PixelWorks',
    title: 'Product Design Intern',
    workMode: 'Hyderabad',
    workModeBadge: 'bg-secondary-fixed text-on-secondary-fixed',
    duration: '3 Months',
    stipend: 20000,
    skills: ['Figma', 'Research', 'Systems'],
    posted: 'Posted Today',
    postedColor: 'text-secondary font-semibold',
    slug: 'product-design-intern-pixelworks',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState('');
  const [locationQ, setLocationQ] = useState('');

  // Fetch live top opportunities
  const { data: apiData } = useQuery({
    queryKey: ['home', 'top-internships'],
    queryFn: async () => {
      const res = await api.get('/opportunities?type=INTERNSHIP&limit=4');
      return res.data;
    },
  });

  const liveOpps = apiData?.data?.opportunities || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQ.trim()) params.set('q', searchQ.trim());
    if (locationQ.trim()) params.set('location', locationQ.trim());
    navigate(`/internships?${params.toString()}`);
  };

  const handleChipClick = (chip: string) => {
    if (chip === 'Internships') navigate('/internships');
    else if (chip === 'Remote Jobs') navigate('/jobs?workMode=REMOTE');
    else if (chip === 'Hackathons') navigate('/hackathons');
    else navigate(`/internships?q=${encodeURIComponent(chip)}`);
  };

  return (
    <>
      <SEO
        title="InternAtlas — Discover Opportunities. Build Your Career."
        description="Find verified internships, entry-level jobs, hackathons, and competitions curated for ambitious college students."
      />

      <main className="w-full pt-16 bg-background">
        <div className="max-w-7xl mx-auto px-margin py-space-xl">
          <div className="flex flex-col w-full gap-y-space-xl">
            {/* Section 1: Hero Section */}
            <section className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-lg md:p-space-xl shadow-sm">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm tracking-wide shadow-sm mb-space-md">
                  <span className="material-symbols-outlined text-[16px] text-secondary">bolt</span>
                  <span>OVER 12,000+ STUDENT OPPORTUNITIES LIVE NOW</span>
                </div>
                {/* Headline */}
                <h1 className="font-display text-display text-on-surface mb-space-sm">
                  Find opportunities.{' '}
                  <span className="bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent">
                    Build your career.
                  </span>
                </h1>
                {/* Supporting Text */}
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-space-lg">
                  Discover internships, jobs, hackathons, competitions and opportunities that help you move forward.
                </p>
                {/* Unified Horizontal Search Bar */}
                <form
                  onSubmit={handleSearch}
                  className="w-full bg-surface-container-low rounded-xl shadow-sm p-space-xs md:p-space-sm flex flex-col md:flex-row items-stretch gap-space-xs md:gap-space-sm"
                >
                  {/* Search Input */}
                  <div className="flex-1 flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-3 rounded-lg min-w-0">
                    <span className="material-symbols-outlined text-outline text-[22px]">search</span>
                    <input
                      className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                      placeholder="Search internships, jobs, hackathons, skills..."
                      type="text"
                      value={searchQ}
                      onChange={(e) => setSearchQ(e.target.value)}
                    />
                  </div>
                  {/* Location Input */}
                  <div className="flex-1 flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-3 rounded-lg min-w-0">
                    <span className="material-symbols-outlined text-outline text-[22px]">location_on</span>
                    <input
                      className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                      placeholder="Location (e.g. Remote, Bangalore, Delhi)"
                      type="text"
                      value={locationQ}
                      onChange={(e) => setLocationQ(e.target.value)}
                    />
                  </div>
                  {/* Action Button */}
                  <button
                    className="bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container px-space-lg py-3 rounded-lg font-label-md text-label-md flex items-center justify-center gap-space-xs transition-colors shadow-sm cursor-pointer"
                    type="submit"
                  >
                    <span>Search Opportunities</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </form>
                {/* Popular Search Chips */}
                <div className="flex flex-wrap items-center justify-center gap-space-xs md:gap-space-sm mt-space-md">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Popular:</span>
                  {POPULAR_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleChipClick(chip)}
                      className="px-space-sm py-1 bg-surface-container rounded-full font-caption text-caption text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                      type="button"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 2: Explore by Interest */}
            <section className="flex flex-col gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <h2 className="font-headline-md text-headline-md text-on-surface">Explore opportunities in your interest</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Find opportunities based on the skills and fields you want to grow in.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {INTEREST_AREAS.map((item) => (
                  <div
                    key={item.title}
                    onClick={() => navigate(item.path)}
                    className="bg-surface-container-lowest p-space-md rounded-xl flex items-center justify-between hover:bg-surface-container-low hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-space-md min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0">
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-title-md text-title-md text-on-surface truncate">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-space-xs mt-0.5">
                          <span className="font-caption text-caption text-on-surface-variant">{item.count}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px] rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
                      chevron_right
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Opportunity Categories */}
            <section className="flex flex-col gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <h2 className="font-headline-md text-headline-md text-on-surface">Explore opportunities</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Handpicked pathways curated for university students & recent graduates</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {PATHWAYS.map((p) => (
                  <div
                    key={p.title}
                    onClick={() => navigate(p.path)}
                    className="bg-surface-container-lowest rounded-2xl p-space-lg hover:shadow-lg transition duration-200 group flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-space-md">
                        <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                          <span className="material-symbols-outlined text-[24px]">{p.icon}</span>
                        </div>
                        <span className={`font-label-sm text-label-sm px-space-sm py-1 rounded-full font-semibold ${p.badgeClass}`}>
                          {p.badge}
                        </span>
                      </div>
                      <h3 className="font-title-lg text-title-lg text-on-surface group-hover:text-primary transition-colors mb-space-xs">
                        {p.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                        {p.desc}
                      </p>
                    </div>
                    <div className={`flex items-center gap-space-xs ${p.ctaColor} font-label-md text-label-md group-hover:translate-x-1 transition-transform`}>
                      <span>{p.cta}</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Featured Internships */}
            <section className="flex flex-col gap-space-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
                <div className="flex flex-col gap-space-xs">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Top internships this week</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Fresh opportunities worth exploring. Verified stipends & student-friendly teams.</p>
                </div>
                <Link
                  to="/internships"
                  className="flex items-center gap-space-xs text-primary hover:text-primary-container font-label-md text-label-md font-semibold transition-colors"
                >
                  <span>View all internships</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {liveOpps.length > 0 ? (
                  liveOpps.slice(0, 4).map((opp: any) => {
                    const orgName = opp.organizationId?.name || opp.organizationName || 'Company';
                    const initials = orgName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
                    return (
                      <div
                        key={opp._id}
                        className="bg-surface-container-lowest rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-start justify-between mb-space-sm">
                            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center font-title-md text-primary font-bold">
                              {initials}
                            </div>
                            <button className="text-outline hover:text-primary transition-colors p-1" title="Bookmark" type="button">
                              <span className="material-symbols-outlined text-[20px]">bookmark</span>
                            </button>
                          </div>
                          <span className="font-caption text-caption text-on-surface-variant truncate">{orgName}</span>
                          <h4 className="font-title-md text-title-md text-on-surface mt-0.5 mb-space-sm truncate" title={opp.title}>
                            {opp.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-space-xs mb-space-sm">
                            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-caption text-caption">
                              {opp.workMode || 'Remote'}
                            </span>
                            {opp.duration && (
                              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-caption text-caption">
                                {opp.duration}
                              </span>
                            )}
                          </div>
                          <div className="font-title-lg text-title-lg text-on-surface font-bold mb-space-sm">
                            ₹{(opp.stipend || 15000).toLocaleString()}{' '}
                            <span className="font-caption text-caption text-on-surface-variant font-normal">/ mo</span>
                          </div>
                          {opp.skills && opp.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-space-md">
                              {opp.skills.slice(0, 3).map((skill: string) => (
                                <span
                                  key={skill}
                                  className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-label-sm text-[11px]"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-space-sm border-t border-outline-variant/30">
                          <span className="font-caption text-caption text-outline">Active</span>
                          <Link
                            to={`/opportunities/${opp.slug || opp._id}`}
                            className="px-space-md py-1.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-sm text-label-sm transition-colors"
                          >
                            Apply
                          </Link>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  STATIC_FEATURED_OPPS.map((card) => (
                    <div
                      key={card.id}
                      className="bg-surface-container-lowest rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-start justify-between mb-space-sm">
                          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center font-title-md text-primary font-bold">
                            {card.initials}
                          </div>
                          <button className="text-outline hover:text-primary transition-colors p-1" title="Bookmark" type="button">
                            <span className="material-symbols-outlined text-[20px]">bookmark</span>
                          </button>
                        </div>
                        <span className="font-caption text-caption text-on-surface-variant">{card.orgName}</span>
                        <h4 className="font-title-md text-title-md text-on-surface mt-0.5 mb-space-sm truncate" title={card.title}>
                          {card.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-space-xs mb-space-sm">
                          <span
                            className={`px-2 py-0.5 rounded-full font-caption text-caption ${
                              card.workModeBadge || 'bg-surface-container-high text-on-surface'
                            }`}
                          >
                            {card.workMode}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-caption text-caption">
                            {card.duration}
                          </span>
                        </div>
                        <div className="font-title-lg text-title-lg text-on-surface font-bold mb-space-sm">
                          ₹{card.stipend.toLocaleString()}{' '}
                          <span className="font-caption text-caption text-on-surface-variant font-normal">/ mo</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-space-md">
                          {card.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-label-sm text-[11px]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-space-sm border-t border-outline-variant/30">
                        <span className={`font-caption text-caption ${card.postedColor || 'text-outline'}`}>
                          {card.posted}
                        </span>
                        <Link
                          to="/internships"
                          className="px-space-md py-1.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-sm text-label-sm transition-colors"
                        >
                          Apply
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Section 5: Hackathons & Competitions Split */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
              {/* Left Column: Upcoming Hackathons */}
              <div className="flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[22px]">code</span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Upcoming Hackathons</h3>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Explore 48h builds & prize pools</p>
                  </div>
                  <Link className="text-secondary font-label-sm text-label-sm font-semibold hover:underline" to="/hackathons">
                    View all
                  </Link>
                </div>
                <div className="flex flex-col gap-space-sm">
                  {/* Hackathon Card 1 */}
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-space-xs mb-1">
                        <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
                          Starts in 4 days
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">Online</span>
                      </div>
                      <h4 className="font-title-md text-title-md text-on-surface truncate">Ethos Global Hack 2025</h4>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        DevX Foundation • <strong className="text-on-surface">₹5,00,000 Pool</strong>
                      </span>
                    </div>
                    <Link
                      to="/hackathons"
                      className="px-space-lg py-2 bg-secondary hover:bg-secondary-container text-on-secondary hover:text-on-secondary-container rounded-lg font-label-sm text-label-sm font-semibold shrink-0 transition-colors text-center"
                    >
                      Register
                    </Link>
                  </div>
                  {/* Hackathon Card 2 */}
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-space-xs mb-1">
                        <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface">
                          Oct 24 - 26
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">Hybrid (Bengaluru)</span>
                      </div>
                      <h4 className="font-title-md text-title-md text-on-surface truncate">AI Builder Blitz</h4>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        TensorCraft • <strong className="text-on-surface">₹3,50,000 Pool</strong>
                      </span>
                    </div>
                    <Link
                      to="/hackathons"
                      className="px-space-lg py-2 bg-secondary hover:bg-secondary-container text-on-secondary hover:text-on-secondary-container rounded-lg font-label-sm text-label-sm font-semibold shrink-0 transition-colors text-center"
                    >
                      Register
                    </Link>
                  </div>
                  {/* Hackathon Card 3 */}
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-space-xs mb-1">
                        <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface">
                          Nov 02 - 04
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">Online</span>
                      </div>
                      <h4 className="font-title-md text-title-md text-on-surface truncate">CodeForge Climate Sprint</h4>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        GreenTech Guild • <strong className="text-on-surface">$10,000 Pool</strong>
                      </span>
                    </div>
                    <Link
                      to="/hackathons"
                      className="px-space-lg py-2 bg-secondary hover:bg-secondary-container text-on-secondary hover:text-on-secondary-container rounded-lg font-label-sm text-label-sm font-semibold shrink-0 transition-colors text-center"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Competitions */}
              <div className="flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[22px]">trophy</span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Competitions</h3>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Case studies, quizzes & algorithmic challenges</p>
                  </div>
                  <Link className="text-primary font-label-sm text-label-sm font-semibold hover:underline" to="/competitions">
                    View all
                  </Link>
                </div>
                <div className="flex flex-col gap-space-sm">
                  {/* Comp Card 1 */}
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-space-xs mb-1">
                        <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-primary-fixed text-primary">Case Study</span>
                        <span className="font-caption text-caption text-on-surface-variant">Closes in 6 days</span>
                      </div>
                      <h4 className="font-title-md text-title-md text-on-surface truncate">National Product Teardown</h4>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        APM Fellowship • <strong className="text-on-surface">Certificate + ₹1,00,000</strong>
                      </span>
                    </div>
                    <Link
                      to="/competitions"
                      className="px-space-lg py-2 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container rounded-lg font-label-sm text-label-sm font-semibold shrink-0 transition-colors text-center"
                    >
                      Participate
                    </Link>
                  </div>
                  {/* Comp Card 2 */}
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-space-xs mb-1">
                        <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface">DSA Contest</span>
                        <span className="font-caption text-caption text-on-surface-variant">Every Saturday</span>
                      </div>
                      <h4 className="font-title-md text-title-md text-on-surface truncate">AlgoQuest: Speed Programming</h4>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        AlgoMasters • <strong className="text-on-surface">Swag & Tier Badges</strong>
                      </span>
                    </div>
                    <Link
                      to="/competitions"
                      className="px-space-lg py-2 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container rounded-lg font-label-sm text-label-sm font-semibold shrink-0 transition-colors text-center"
                    >
                      Participate
                    </Link>
                  </div>
                  {/* Comp Card 3 */}
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-space-xs mb-1">
                        <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface">Idea Pitch</span>
                        <span className="font-caption text-caption text-on-surface-variant">Deadline: Nov 15</span>
                      </div>
                      <h4 className="font-title-md text-title-md text-on-surface truncate">FinTech Innovation Challenge</h4>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        QuantCapital • <strong className="text-on-surface">Mentorship & Grant</strong>
                      </span>
                    </div>
                    <Link
                      to="/competitions"
                      className="px-space-lg py-2 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container rounded-lg font-label-sm text-label-sm font-semibold shrink-0 transition-colors text-center"
                    >
                      Participate
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6: More Opportunities (Horizontal Strip) */}
            <section className="flex flex-col gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <h2 className="font-headline-md text-headline-md text-on-surface">More ways to grow</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Upskilling, financial support, and campus community happenings</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-md">
                {/* 1 */}
                <div
                  onClick={() => navigate('/internships?type=scholarship')}
                  className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-space-sm">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface">Scholarships</h4>
                    <p className="font-caption text-caption text-on-surface-variant mt-0.5">Merit & Need-based</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-semibold mt-space-sm">35+ live</span>
                </div>
                {/* 2 */}
                <div
                  onClick={() => navigate('/internships?type=workshop')}
                  className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-space-sm">
                    <span className="material-symbols-outlined text-[18px]">co_present</span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface">Workshops</h4>
                    <p className="font-caption text-caption text-on-surface-variant mt-0.5">Hands-on Bootcamps</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-semibold mt-space-sm">18 this month</span>
                </div>
                {/* 3 */}
                <div
                  onClick={() => navigate('/internships?type=festival')}
                  className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-space-sm">
                    <span className="material-symbols-outlined text-[18px]">festival</span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface">College Festivals</h4>
                    <p className="font-caption text-caption text-on-surface-variant mt-0.5">Campus Summits</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-semibold mt-space-sm">40+ colleges</span>
                </div>
                {/* 4 */}
                <div
                  onClick={() => navigate('/internships?type=cultural')}
                  className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-space-sm">
                    <span className="material-symbols-outlined text-[18px]">theater_comedy</span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface">Cultural Events</h4>
                    <p className="font-caption text-caption text-on-surface-variant mt-0.5">Arts & Debates</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-semibold mt-space-sm">25+ listings</span>
                </div>
                {/* 5 */}
                <div
                  onClick={() => navigate('/internships?type=resources')}
                  className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all cursor-pointer flex flex-col justify-between col-span-2 md:col-span-1"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-space-sm">
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface">Study Resources</h4>
                    <p className="font-caption text-caption text-on-surface-variant mt-0.5">Roadmaps & Cheatsheets</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-semibold mt-space-sm">Free access</span>
                </div>
              </div>
            </section>

            {/* Section 7: Career CTA Banner */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-container to-inverse-surface p-space-lg md:p-space-xl text-center text-on-primary shadow-lg">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                <h2 className="font-headline-lg text-headline-lg mb-space-sm">Turn your potential into progress.</h2>
                <p className="font-body-lg text-body-lg text-inverse-on-surface/90 mb-space-lg max-w-xl">
                  Discover opportunities, build experience, and take the next step in your career. Join 85,000+ ambitious students discovering their future on InternAtlas.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-space-sm w-full sm:w-auto mb-space-lg">
                  <Link
                    to="/internships"
                    className="w-full sm:w-auto px-space-lg py-3 rounded-xl bg-surface-container-lowest text-primary font-label-md text-label-md font-bold hover:bg-surface transition-colors shadow text-center"
                  >
                    Explore opportunities
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto px-space-lg py-3 rounded-xl bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary font-label-md text-label-md font-medium backdrop-blur-sm transition-colors text-center"
                  >
                    Create your profile
                  </Link>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-space-md sm:gap-space-lg text-inverse-on-surface/80 font-caption text-caption">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">check_circle</span>
                    <span>100% Free for Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">verified</span>
                    <span>Verified Companies Only</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">send</span>
                    <span>Direct Applications</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
