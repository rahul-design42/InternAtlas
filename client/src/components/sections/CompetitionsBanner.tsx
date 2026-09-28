import { Link } from "@/lib/next-polyfills";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CompetitionsBanner() {
  return (
    <section
      id="competitions"
      className="scroll-mt-24 bg-transparent pt-0 pb-2 lg:pb-3"
      aria-label="Competitions"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Banner Container */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[20px] bg-deep-navy p-6 lg:py-5 lg:px-10 lg:flex-row xl:px-12">
          {/* Abstract Geometric Background */}
          <div className="absolute right-0 top-0 h-full w-[50%] pointer-events-none opacity-80 mix-blend-screen overflow-hidden">
            <div className="absolute right-[-10%] top-[-20%] h-[300px] w-[300px] rotate-12 bg-gradient-to-br from-blue/20 to-transparent blur-2xl" />
            <div className="absolute bottom-[-20%] right-[10%] h-[400px] w-[200px] -rotate-12 bg-gradient-to-t from-blue/40 to-transparent blur-3xl" />
            <div className="absolute bottom-0 right-[20%] h-[150px] w-[150px] rotate-45 bg-blue/20 backdrop-blur-md" />
            <div className="absolute bottom-[20%] right-[5%] h-[200px] w-[200px] rotate-12 bg-blue/10 backdrop-blur-sm border border-blue/20" />
            <div className="absolute top-[10%] right-[30%] h-[100px] w-[100px] rotate-45 bg-cyan/10 blur-xl" />
          </div>

          {/* Left Column */}
          <div className="relative z-10 flex w-full max-w-[400px] flex-col justify-center">
            <span className="mb-3 text-[18px] font-bold uppercase tracking-widest text-cyan">
              COMPETITIONS
            </span>

            <h2 className="mb-4 text-[32px] font-bold leading-[1.2] tracking-tight text-white md:text-[36px]">
              Competitions to showcase <br />
              <span className="text-cyan">your skills.</span>
            </h2>

            <p className="mb-8 text-[14px] leading-relaxed text-border opacity-90 max-w-[320px]">
              From case challenges to ideathons — showcase your skills, win
              exciting rewards, and get noticed by top companies.
            </p>

            <Button asChild className="w-max px-6 h-10 text-[13px] rounded-full">
              <Link href="/competitions">
                Explore competitions
                <ArrowRight size={14} className="ml-1.5" />
              </Link>
            </Button>
          </div>

          {/* Middle Column */}
          <div className="relative z-10 hidden w-[280px] shrink-0 lg:flex items-center justify-center">
            <div className="absolute inset-0 z-0 flex items-end justify-center pointer-events-none">
              <div className="absolute bottom-0 left-[0px] flex items-end">
                <div className="h-[120px] w-[50px] bg-gradient-to-t from-[#0d3478] to-[#2563eb] opacity-80" />
                <div className="h-[100px] w-[20px] bg-gradient-to-t from-[#082252] to-[#1d4ed8] opacity-90 -skew-y-[30deg] origin-bottom-left" />
                <div className="absolute bottom-[120px] left-0 h-[20px] w-[50px] bg-[#3b82f6] opacity-60 skew-x-[60deg] origin-bottom-left" />
              </div>

              <div className="absolute bottom-[80px] left-[15px] h-[160px] w-[1px] bg-gradient-to-t from-blue-400/50 to-transparent">
                <div className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              </div>

              <div className="absolute bottom-0 right-[20px] h-[220px] w-[120px]">
                <div className="absolute bottom-0 right-0 h-full w-full rounded-tl-full bg-gradient-to-bl from-[#3b82f6]/40 to-[#1e3a8a]/80 backdrop-blur-sm border-t border-l border-blue-400/30" />
                <div className="absolute bottom-0 right-[40px] h-[180px] w-[80px] rounded-tl-full bg-[#1e40af] opacity-50 border-l border-blue-400/20" />
              </div>

              <div className="absolute bottom-0 right-[0px]">
                <div className="h-[80px] w-[40px] bg-[#2563eb] opacity-70" />
                <div className="absolute bottom-[80px] right-0 border-b-[60px] border-l-[40px] border-b-[#2563eb] border-l-transparent opacity-70" />
              </div>

              <div className="absolute bottom-[100px] right-[40px] h-[180px] w-[1px] bg-gradient-to-t from-blue-400/40 to-transparent">
                <div className="absolute top-[40px] left-0 h-[1px] w-[30px] bg-blue-400/40 rotate-[30deg] origin-left">
                  <div className="absolute right-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-cyan-400/80" />
                </div>
              </div>
            </div>

            <div className="relative z-10 mb-[-20px] lg:mb-[-20px] h-[340px] w-[200px] rounded-t-[28px] bg-gradient-to-br from-[#497BBF] via-[#2A4B8D] to-[#122146] p-[2px] shadow-2xl">
              <div className="relative h-full w-full overflow-hidden rounded-t-[26px] bg-[#11203E] border border-black/40">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A5F] via-[#1C3A62] to-[#11203E]">
                  <div className="absolute top-[20%] left-1/2 h-[150px] w-[150px] -translate-x-1/2 rounded-full bg-blue-400/10 blur-[30px]" />
                </div>

                <div className="absolute top-[80px] left-[30px] h-0.5 w-0.5 rounded-full bg-cyan-300 shadow-[0_0_4px_#67e8f9]" />
                <div className="absolute top-[70px] right-[70px] h-0.5 w-0.5 rounded-full bg-blue-300 shadow-[0_0_4px_#93c5fd]" />
                <div className="absolute top-[160px] right-[30px] h-[3px] w-[3px] rounded-full bg-blue-400/60 blur-[1px]" />
                <div className="absolute bottom-[80px] left-[40px] h-0.5 w-0.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#22d3ee]" />

                <div className="absolute top-0 left-1/2 flex h-[20px] w-[80px] -translate-x-1/2 justify-center rounded-b-[10px] bg-[#0E1A33] shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                  <div className="absolute left-[12px] top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-[#11223A] border border-white/10 flex items-center justify-center">
                    <div className="h-[2px] w-[2px] rounded-full bg-cyan-500/80" />
                  </div>

                  <div className="absolute top-1/2 h-[3px] w-[20px] -translate-y-1/2 rounded-full bg-black/60 border border-white/5" />
                </div>

                <div className="flex h-full flex-col items-center justify-center">
                  <span className="text-[22px] font-extrabold leading-[1.6] tracking-wide text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
                    Solve <br />
                    Build <br />
                    Present <br />
                    Win
                  </span>
                </div>
              </div>

              <div className="absolute left-[-2px] top-[70px] h-[18px] w-[2px] rounded-l-md bg-[#2A4B8D]" />
              <div className="absolute left-[-2px] top-[100px] h-[30px] w-[2px] rounded-l-md bg-[#2A4B8D]" />
              <div className="absolute right-[-2px] top-[80px] h-[40px] w-[2px] rounded-r-md bg-[#2A4B8D]" />
            </div>
          </div>

          {/* Right Column */}
          <div className="relative z-10 mt-10 flex w-full flex-col justify-center lg:mt-0 lg:w-[360px] xl:w-[400px]">
            <div className="mb-4 flex items-center justify-end gap-6">
              <Link
                href="/competitions"
                className="text-white font-medium text-[13px] flex items-center gap-1 cursor-pointer hover:text-blue-200 transition-colors"
              >
                View all competitions
                <ArrowRight size={14} className="mt-0.5" />
              </Link>

              <div className="flex gap-2">
                <button className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-deep-navy text-white hover:bg-white/10 transition-colors">
                  <ChevronLeft size={14} />
                </button>

                <button className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-deep-navy text-white hover:bg-white/10 transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {[
                {
                  title: "Unstop Design Challenge 2025",
                  org: "Unstop",
                  date: "Oct 5 – Nov 2, 2025",
                  logo: (
                    <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white shadow-sm">
                      <img src="https://d8it4huxumps7.cloudfront.net/uploads/images/unstop/svg/unstop-logo.svg" alt="Unstop" className="h-[24px] w-[24px] object-contain" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=Unstop&background=1C4ED8&color=fff'; }} />
                    </div>
                  ),
                },
                {
                  title: "Google Solution Challenge",
                  org: "Google",
                  date: "Oct 20 – Dec 10, 2025",
                  logo: (
                    <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-6 w-6">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                      </svg>
                    </div>
                  ),
                },
                {
                  title: "Adobe Creative Jam",
                  org: "Adobe",
                  date: "Oct 12 – Nov 15, 2025",
                  logo: (
                    <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
                        <path fill="#FF0000" d="M15.1,2H22v19.4L15.1,2z M8.9,2H2v19.4L8.9,2z M12,8.6L17.7,21.4h-3.3l-1.3-3.3h-4.3l1.8-4.5L12,8.6z"/>
                      </svg>
                    </div>
                  ),
                },
              ].map((comp, i) => (
                <Link
                  key={i}
                  href="/competitions"
                  className="flex cursor-pointer items-center justify-between rounded-2xl bg-white p-4 border border-border shadow-card transition-all hover:-translate-y-1 hover:shadow-hover hover:border-cyan-light"
                >
                  <div className="flex items-start gap-4">
                    {comp.logo}

                    <div className="flex flex-col justify-center">
                      <span className="text-[14px] font-bold text-text-primary leading-tight mb-0.5">
                        {comp.title}
                      </span>

                      <span className="text-[12px] font-medium text-text-secondary leading-snug">
                        {comp.org}
                      </span>

                      <span className="text-[12px] font-medium text-text-secondary leading-snug">
                        {comp.date}
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    size={16}
                    className="text-blue shrink-0 mr-1"
                    strokeWidth={2.5}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}