import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';

const Footer = () => {
  return (
    <footer className="w-full bg-surface-container-low text-on-surface-variant mt-auto">
      <div className="max-w-7xl mx-auto px-margin py-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter-lg pb-space-xl">
          {/* Brand */}
          <div className="flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <BrandLogo className="h-7 w-auto object-contain" />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Discover opportunities. Build your career.
            </p>
            <div className="flex items-center gap-space-sm pt-space-xs">
              <a
                className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors"
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <span className="material-symbols-outlined text-[18px]">terminal</span>
              </a>
              <a
                className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors"
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <span className="material-symbols-outlined text-[18px]">work</span>
              </a>
              <a
                className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors"
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Community"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </a>
              <a
                className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors"
                href="/internships"
                aria-label="Code"
              >
                <span className="material-symbols-outlined text-[18px]">code</span>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface">Explore</h4>
            <nav className="flex flex-col gap-space-xs">
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                to="/internships"
              >
                Internships
              </Link>
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                to="/jobs"
              >
                Jobs
              </Link>
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                to="/hackathons"
              >
                Hackathons
              </Link>
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                to="/competitions"
              >
                Competitions
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface">Resources</h4>
            <nav className="flex flex-col gap-space-xs">
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                to="/internships"
              >
                Scholarships
              </Link>
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                to="/internships"
              >
                Workshops
              </Link>
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                to="/internships"
              >
                College Festivals
              </Link>
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                to="/internships"
              >
                Study Resources
              </Link>
            </nav>
          </div>

          {/* Platform */}
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface">Platform</h4>
            <nav className="flex flex-col gap-space-xs">
              <span className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
                About
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
                Contact
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
                Privacy Policy
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
                Terms of Service
              </span>
            </nav>
          </div>
        </div>

        <div className="pt-space-md border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <p className="font-caption text-caption text-on-surface-variant">
            © 2025 InternAtlas Technologies Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-space-md">
            <span className="font-caption text-caption text-on-surface-variant">
              Crafted for collegiate talent
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
