/* eslint-disable @next/next/no-img-element */
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Testimonial() {
  return (
    <section className="bg-transparent pt-12 lg:pt-20 pb-2 lg:pb-3" aria-label="Student Stories">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.6fr_1fr]">
          
          {/* Left Text */}
          <div className="flex flex-col">
            <span className="mb-2 block text-[18px] font-bold uppercase tracking-widest text-blue">
              STUDENT STORIES
            </span>
            <blockquote className="mb-10 text-[24px] font-medium leading-[1.4] text-[#1e293b] md:text-[28px] lg:text-[32px] tracking-tight">
              “InternAtlas helped me find my first internship and even a scholarship. The platform is simple, genuine and{" "}
              <span className="font-serif italic font-normal text-editorial-red">student-friendly.”</span>
            </blockquote>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Priya Sharma" 
                  className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm" 
                />
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-primary">Priya Sharma</span>
                  <span className="text-[13px] text-text-secondary">B.Tech, IIT Delhi</span>
                </div>
              </div>
              
              {/* Pagination controls */}
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-pink-accent" />
                  <div className="h-2 w-2 rounded-full bg-border" />
                  <div className="h-2 w-2 rounded-full bg-border" />
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-muted hover:border-cyan-light hover:bg-background transition-colors"><ChevronLeft size={18} /></button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary hover:border-cyan-light hover:bg-background transition-colors"><ChevronRight size={18} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Box: Two side-by-side rounded squares */}
          <div className="flex h-full w-full items-center justify-center gap-4 lg:justify-end">
            
            {/* Left Square */}
            <div className="relative flex h-[180px] w-[180px] sm:h-[220px] sm:w-[220px] items-end justify-center overflow-hidden rounded-[24px] bg-[#fdf2f8] shadow-sm">
              {/* Soft pink arch shape */}
              <div className="h-[80%] w-[85%] rounded-t-full bg-pink-100/50" />
            </div>

            {/* Right Square */}
            <div className="relative flex h-[180px] w-[180px] sm:h-[220px] sm:w-[220px] flex-col items-center justify-center overflow-hidden rounded-[24px] bg-[#fdf2f8] p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-pink-100/50">
              <div className="z-10 flex flex-col items-center text-center -rotate-[6deg] drop-shadow-sm">
                <span className="font-hand text-[22px] sm:text-[27px] font-medium leading-[1.15] text-[#1e293b]">
                  <span className="relative top-[4px] mr-1 font-serif text-[44px] sm:text-[56px] font-bold leading-none text-[#F472B6]">“</span>
                  More <br />
                  opportunities. <br />
                  Brighter <br />
                  futures.
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
