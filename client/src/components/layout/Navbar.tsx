import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import { useState, useRef, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const { data: notifData } = useQuery({
    queryKey: ['notifications', 'unreadCount'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data;
    },
    enabled: !!user,
  });

  const unreadCount = notifData?.meta?.unreadCount || 0;

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dashboardPath =
    user?.role === 'ADMIN'
      ? '/admin/dashboard'
      : user?.role === 'RECRUITER'
      ? '/recruiter/dashboard'
      : '/student/dashboard';

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'transition-colors text-primary font-bold relative after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2px] after:bg-primary font-body-md text-body-md'
      : 'font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/internships?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin flex items-center justify-between gap-4">
        {/* Logo and Nav */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <BrandLogo className="h-8 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-6" data-active-classes="text-primary font-title-md font-semibold relative after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2px] after:bg-primary">
            <NavLink to="/internships" className={navLinkClass}>
              Internships
            </NavLink>
            <NavLink to="/jobs" className={navLinkClass}>
              Jobs
            </NavLink>
            <NavLink to="/hackathons" className={navLinkClass}>
              Hackathons
            </NavLink>
            <NavLink to="/competitions" className={navLinkClass}>
              Competitions
            </NavLink>

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="flex items-center gap-space-xs cursor-pointer text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="font-body-md text-body-md">More</span>
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>

              {moreDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-2 z-50 animate-in fade-in zoom-in-95">
                  <Link
                    to="/internships"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-4 py-2 font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                  >
                    Scholarships
                  </Link>
                  <Link
                    to="/internships"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-4 py-2 font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                  >
                    Workshops
                  </Link>
                  <Link
                    to="/internships"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-4 py-2 font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                  >
                    College Festivals
                  </Link>
                  <Link
                    to="/internships"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-4 py-2 font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                  >
                    Study Resources
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-space-md">
          {/* Search Button */}
          <button
            aria-label="Search opportunities"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors flex items-center justify-center"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {user ? (
            <>
              {/* Notifications */}
              <Link
                to="/student/notifications"
                className="relative p-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors flex items-center justify-center"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-white" />
                )}
              </Link>

              {/* Dashboard Link / Avatar */}
              <Link
                to={dashboardPath}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs">
                  {user.email ? user.email.slice(0, 2).toUpperCase() : (
                    <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
                  )}
                </div>
                <span className="hidden sm:inline font-label-md text-label-md text-on-surface max-w-[120px] truncate">
                  Dashboard
                </span>
              </Link>

              <button
                onClick={() => logout()}
                className="hidden sm:inline-block font-label-md text-label-md text-error hover:text-on-error-container transition-colors px-space-xs"
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-block font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors px-space-sm py-space-xs"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="font-label-md text-label-md bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container px-space-md py-space-sm rounded-lg shadow-sm transition-all"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                title="Account"
              >
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-space-xs text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors flex items-center justify-center"
            aria-label="Toggle menu"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Search Drawer */}
      {searchOpen && (
        <div className="border-t border-outline-variant/30 bg-surface-container-lowest/95 backdrop-blur-xl px-margin py-3">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex items-center gap-3 bg-surface-container-low rounded-xl px-space-md py-2.5">
            <span className="material-symbols-outlined text-outline text-[22px]">search</span>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search internships, jobs, hackathons, skills..."
              className="flex-1 bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-outline hover:text-on-surface transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <button
              type="submit"
              className="bg-primary hover:bg-primary-container text-on-primary px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-outline-variant/30 bg-surface-container-lowest shadow-lg">
          <nav className="flex flex-col py-2">
            {[
              { to: '/internships', label: 'Internships' },
              { to: '/jobs', label: 'Jobs' },
              { to: '/hackathons', label: 'Hackathons' },
              { to: '/competitions', label: 'Competitions' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-margin py-3 font-body-md text-body-md border-l-2 transition-colors ${
                    isActive
                      ? 'border-primary text-primary bg-primary/5 font-bold'
                      : 'border-transparent text-on-surface-variant hover:bg-surface-container'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="border-t border-outline-variant/30 mt-2 pt-3 px-margin flex gap-3 pb-3">
              {user ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 py-2 text-center bg-primary text-on-primary rounded-lg font-label-md text-label-md"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="flex-1 py-2 text-center bg-surface-container text-error rounded-lg font-label-md text-label-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 py-2 text-center bg-surface-container text-on-surface rounded-lg font-label-md text-label-md"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 py-2 text-center bg-primary text-on-primary rounded-lg font-label-md text-label-md"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
