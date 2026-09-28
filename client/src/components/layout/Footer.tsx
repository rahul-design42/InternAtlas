import { Link } from "@/lib/next-polyfills";

const FOOTER_LINKS = {
  opportunities: [
    { label: "Internships", href: "/internships" },
    { label: "Jobs", href: "/jobs" },
    { label: "Competitions", href: "/competitions" },
    { label: "Hackathons", href: "/hackathons" },
    { label: "Scholarships", href: "/scholarships" },
    { label: "Workshops", href: "/workshops" },
    { label: "College Festivals", href: "/festivals" },
    { label: "Cultural Events", href: "/events" },
  ],
  students: [
    { label: "Career resources", href: "/resources" },
    { label: "Resume tips", href: "/resume" },
    { label: "Interview prep", href: "/interview" },
    { label: "Success stories", href: "/success" },
    { label: "Blog", href: "/blog" },
    { label: "Help center", href: "/help" },
  ],
  colleges: [
    { label: "Post opportunities", href: "/post" },
    { label: "Partner with us", href: "/partner" },
    { label: "Campus outreach", href: "/outreach" },
    { label: "College dashboard", href: "/dashboard" },
  ],
  company: [
    { label: "About us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#051329] text-slate-400 border-t border-[#1e2d4a]">
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          {/* Logo & Tagline */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link
              href="/"
              className="text-[26px] font-extrabold tracking-tight text-white mb-4"
            >
              InternAtlas<span className="text-[#3b82f6]">.</span>
            </Link>

            <p className="text-[14px] text-slate-300 mb-8 max-w-[280px]">
              Opportunities for every ambitious student.
            </p>

            <div className="flex gap-4">
              <a href="#" className="text-white hover:text-blue-400 transition-colors">
                {/* LinkedIn */}
                <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors">
                {/* X/Twitter Icon */}
                <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors">
                {/* Instagram */}
                <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors">
                {/* Youtube */}
                <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="currentColor">
                  <path d="M21.582,5.493C21.346,4.618,20.665,3.937,19.79,3.701C18.156,3.262,12,3.262,12,3.262s-6.156,0-7.79,0.439 c-0.875,0.236-1.556,0.917-1.792,1.792C2.01,7.127,2,12,2,12s0.01,4.873,0.418,6.507c0.236,0.875,0.917,1.556,1.792,1.792 C5.844,20.738,12,20.738,12,20.738s6.156,0,7.79-0.439c0.875-0.236,1.556-0.917,1.79-1.792C21.99,16.873,22,12,22,12 S21.99,7.127,21.582,5.493z M9.932,15.748V8.251l6.592,3.748L9.932,15.748z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-semibold text-[15px] mb-2">Opportunities</h3>
            {FOOTER_LINKS.opportunities.map((link) => (
              <Link key={link.label} href={link.href} className="text-[13px] text-slate-300 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-white font-semibold text-[15px] mb-2">For Students</h3>
            {FOOTER_LINKS.students.map((link) => (
              <Link key={link.label} href={link.href} className="text-[13px] text-slate-300 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-white font-semibold text-[15px] mb-2">For Colleges</h3>
            {FOOTER_LINKS.colleges.map((link) => (
              <Link key={link.label} href={link.href} className="text-[13px] text-slate-300 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-white font-semibold text-[15px] mb-2">Company</h3>
            {FOOTER_LINKS.company.map((link) => (
              <Link key={link.label} href={link.href} className="text-[13px] text-slate-300 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#1e2d4a] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-slate-300">
            © 2025 Intern Atlas. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2 text-[13px] text-slate-300">
            <span>Made for India</span>
            <span className="text-[16px]">🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}