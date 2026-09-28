
import React from 'react';
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ExploreCategories } from "@/components/sections/ExploreCategories";
import { OpportunitySection } from "@/components/sections/OpportunitySection";
import { CompetitionsBanner } from "@/components/sections/CompetitionsBanner";
import { HackathonsBanner } from "@/components/sections/HackathonsBanner";
import { BeyondJobs } from "@/components/sections/BeyondJobs";
import { BottomCTA } from "@/components/sections/BottomCTA";
import { Testimonial } from "@/components/sections/Testimonial";

const categories = [
  { id: "internships", type: "internship", label: "Internships", description: "Gain real-world experience", iconKey: "briefcase", color: "pink" },
  { id: "jobs", type: "job", label: "Jobs", description: "Kickstart your career", iconKey: "user", color: "blue" },
  { id: "competitions", type: "competition", label: "Competitions", description: "Showcase your skills", iconKey: "trophy", color: "amber" },
  { id: "hackathons", type: "hackathon", label: "Hackathons", description: "Build. Solve. Win.", iconKey: "zap", color: "emerald" },
  { id: "scholarships", type: "scholarship", label: "Scholarships", description: "Fund your education", iconKey: "award", color: "teal" },
  { id: "workshops", type: "workshop", label: "Workshops", description: "Learn from experts", iconKey: "book-open", color: "purple" },
  { id: "college-festivals", type: "festival", label: "College Festivals", description: "Celebrate campus life", iconKey: "music", color: "orange" },
  { id: "cultural-events", type: "cultural", label: "Cultural Events", description: "Express. Perform. Belong.", iconKey: "smile", color: "rose" },
] as any;

const mockOpportunities = [
  {
    id: "1",
    title: "Software Engineering Intern",
    organization: "Google",
    type: "internship",
    location: "Bengaluru, India",
    compensation: "Stipend",
    applyBy: "2026-10-15",
    badges: ["Engineering"],
    timeLabel: "2 days ago",
    logoVariant: "corporate",
    href: "/internships/swe-google"
  },
  {
    id: "2",
    title: "Product Management Intern",
    organization: "Microsoft",
    type: "internship",
    location: "Hyderabad, India",
    compensation: "Stipend",
    applyBy: "2026-10-20",
    badges: ["Product"],
    timeLabel: "3 days ago",
    logoVariant: "startup",
    href: "/internships/pm-microsoft"
  },
  {
    id: "3",
    title: "Marketing Intern",
    organization: "Airbnb",
    type: "internship",
    location: "Remote - India",
    compensation: "Stipend",
    applyBy: "2026-10-25",
    badges: ["Marketing"],
    timeLabel: "4 days ago",
    logoVariant: "startup",
    href: "/internships/marketing-airbnb"
  },
  {
    id: "4",
    title: "Business Operations Intern",
    organization: "Swiggy",
    type: "internship",
    location: "Bengaluru, India",
    compensation: "Stipend",
    applyBy: "2026-10-10",
    badges: ["Operations"],
    timeLabel: "5 days ago",
    logoVariant: "startup",
    href: "/internships/ops-swiggy"
  },
  {
    id: "5",
    title: "Data Analyst Intern",
    organization: "Zomato",
    type: "internship",
    location: "Gurugram, India",
    compensation: "Stipend",
    applyBy: "2026-10-12",
    badges: ["Analytics"],
    timeLabel: "5 days ago",
    logoVariant: "startup",
    href: "/internships/data-zomato"
  }
] as any;

const mockJobs = [
  {
    id: "1",
    title: "Product Associate",
    organization: "Flipkart",
    type: "job",
    location: "Bengaluru, India",
    compensation: "Full-time",
    applyBy: "Fresher",
    badges: [],
    timeLabel: "",
    logoVariant: "corporate",
    href: "/jobs/product-flipkart"
  },
  {
    id: "2",
    title: "Business Analyst",
    organization: "Deloitte",
    type: "job",
    location: "Gurugram, India",
    compensation: "Full-time",
    applyBy: "Fresher",
    badges: [],
    timeLabel: "",
    logoVariant: "corporate",
    href: "/jobs/ba-deloitte"
  },
  {
    id: "3",
    title: "Customer Success",
    organization: "Razorpay",
    type: "job",
    location: "Bengaluru, India",
    compensation: "Full-time",
    applyBy: "Fresher",
    badges: [],
    timeLabel: "",
    logoVariant: "startup",
    href: "/jobs/cs-razorpay"
  },
  {
    id: "4",
    title: "Associate - Tech",
    organization: "Jio",
    type: "job",
    location: "Mumbai, India",
    compensation: "Full-time",
    applyBy: "Fresher",
    badges: [],
    timeLabel: "",
    logoVariant: "corporate",
    href: "/jobs/tech-jio"
  },
  {
    id: "5",
    title: "Operations Associate",
    organization: "OYO",
    type: "job",
    location: "Multiple locations",
    compensation: "Full-time",
    applyBy: "Fresher",
    badges: [],
    timeLabel: "",
    logoVariant: "startup",
    href: "/jobs/ops-oyo"
  }
] as any;

export default function Home() {
  return (
    <main className="bg-[#F8FAFC]/50">
      <HeroSection />
      <ExploreCategories categories={categories} />
      <OpportunitySection
        eyebrow="FEATURED"
        title="Top internships"
        highlightText="this week."
        opportunities={mockOpportunities}
        viewAllLabel="View all internships"
        viewAllHref="/internships"
      />
      <CompetitionsBanner />
      <HackathonsBanner />
      <OpportunitySection
        eyebrow="LATEST"
        title="Entry-level jobs to kickstart"
        highlightText="your career."
        opportunities={mockJobs}
        viewAllLabel="View all jobs"
        viewAllHref="/jobs"
      />
      <BeyondJobs />
      <Testimonial />
      <BottomCTA />
    </main>
  );
}
