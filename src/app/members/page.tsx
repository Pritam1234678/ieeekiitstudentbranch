"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { getApiUrl } from "@/lib/api/config";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Member {
  _id: string;
  fullname: string;
  email: string;
  linkedin?: string;
  photo_url?: string;
  position: string;
}

const rankMap: Record<string, number> = {
  Director: 1,
  "Faculty In Charge": 2,
  Chair: 3,
  "Vice Chair": 4,
  Secretary: 5,
  "Joint Secretary": 6,
  Treasurer: 7,
  "Joint Treasurer": 8,
  Webmaster: 9,
  Member: 10,
};

export default function MembersPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch(getApiUrl("/api/members"));
      const data = await res.json();
      if (data.success) {
        setMembers(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error("Failed to fetch members", err);
    } finally {
      setLoading(false);
    }
  };

  // Hero Animation
  useEffect(() => {
    if (!loading && heroRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // Reveal the big text lines
        tl.fromTo(
          title1Ref.current,
          { y: "100%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 1.2, ease: "power4.out" }
        )
          .fromTo(
            title2Ref.current,
            { y: "100%", opacity: 0 },
            { y: "0%", opacity: 1, duration: 1.2, ease: "power4.out" },
            "-=1"
          )
          // Reveal the thin line separator
          .fromTo(
            lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.5, ease: "power4.inOut" },
            "-=0.8"
          );
      }, heroRef);

      return () => ctx.revert();
    }
  }, [loading]);

  const faculty = members
    .filter((m) => ["Director", "Faculty In Charge"].includes(m.position))
    .sort((a, b) => rankMap[a.position] - rankMap[b.position]);

  const execBoard = members
    .filter((m) =>
      [
        "Chair",
        "Vice Chair",
        "Secretary",
        "Treasurer",
        "Joint Secretary",
        "Joint Treasurer",
        "Webmaster",
      ].includes(m.position)
    )
    .sort((a, b) => rankMap[a.position] - rankMap[b.position]);

  const coreMembers = members.filter((m) => m.position === "Member");

  const teams = [];
  if (faculty.length > 0) teams.push({ name: "Faculty Advisors", members: faculty });
  if (execBoard.length > 0) teams.push({ name: "Executive Board", members: execBoard });
  if (coreMembers.length > 0) teams.push({ name: "Core Members", members: coreMembers });

  return (
    <main
      className="bg-[#FAFAFA] text-[#0f172a] min-h-screen font-sans selection:bg-[#2563EB] selection:text-white overflow-hidden"
      ref={containerRef}
    >
      <Navigation />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-[25vh] pb-[10vh] px-6 lg:px-12 w-full max-w-[1600px] mx-auto flex flex-col justify-end min-h-[70vh]"
      >
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#E0E7FF] rounded-full blur-[120px] opacity-60 -z-10 translate-x-1/2 -translate-y-1/2 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#DBEAFE] rounded-full blur-[100px] opacity-50 -z-10 -translate-x-1/2 translate-y-1/2 mix-blend-multiply"></div>

        <div className="overflow-hidden mb-[-1vw]">
          <h1
            ref={title1Ref}
            className="text-[10vw] leading-[0.85] font-black tracking-tighter text-[#1e293b]"
          >
            OUR PEOPLE.
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1
            ref={title2Ref}
            className="text-[10vw] leading-[0.85] font-black tracking-tighter text-[#2563EB] ml-[10vw]"
          >
            THE DRIVING FORCE.
          </h1>
        </div>

        <div className="mt-16 sm:mt-24 flex justify-end relative z-10">
          <p className="max-w-md text-sm md:text-base lg:text-lg text-[#475569] leading-relaxed font-medium">
            Meet the minds and makers driving innovation and excellence worldwide
            at <span className="text-[#2563EB] font-bold">IEEE KIIT Student Branch</span>.
          </p>
        </div>

        <div
          ref={lineRef}
          className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#2563EB]/20 to-[#2563EB] origin-left mt-16 sm:mt-24"
        ></div>
      </section>

      {/* Roster / Ranks */}
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 pb-32">
        {loading ? (
          <div className="py-32 flex justify-center items-center">
            <span className="text-[#334155] text-sm font-bold tracking-widest animate-pulse">
              LOADING ROSTER...
            </span>
          </div>
        ) : teams.length === 0 ? (
          <div className="py-32 text-left text-[#64748b] text-xl font-medium tracking-wide">
            No active members found in the directory.
          </div>
        ) : (
          teams.map((team, index) => (
            <ModernTeamSection key={team.name} team={team} index={index} />
          ))
        )}
      </div>

      {/* Clean Blue CTA */}
      <section className="bg-[#2563eb] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute -top-[50%] -right-[20%] w-[100%] h-[150%] bg-gradient-to-b from-[#1d4ed8]/30 to-transparent blur-3xl rounded-full transform rotate-12 -z-0"></div>

        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-32 md:py-48 flex flex-col items-center text-center relative z-10">
          <h2 className="text-[6vw] md:text-[5vw] leading-[0.9] font-black tracking-tight mb-8 text-white">
            Ready to shape the future?
          </h2>
          <p className="max-w-2xl text-[#cbd5e1] text-sm md:text-lg leading-relaxed font-medium mb-12">
            Join a community of driven individuals hungry to learn, innovate, and master their craft. We&apos;re always looking for new talent.
          </p>
          <button className="relative overflow-hidden group bg-white rounded-full px-12 py-5 shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:shadow-[0_0_60px_rgba(255,255,255,0.35)] transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-[#1d4ed8] translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
            <span className="relative z-10 text-[#1d4ed8] group-hover:text-white tracking-wide text-base font-bold transition-colors duration-300">
              Closed 
            </span>
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ModernTeamSection({
  team,
  index,
}: {
  team: { name: string; members: Member[] };
  index: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      const gsapCtx = gsap.context(() => {
        // Section header reveal
        gsap.fromTo(
          ".team-title-char",
          { y: "120%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 0.8,
            stagger: 0.03,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleContainerRef.current,
              start: "top 85%",
            },
          }
        );

        // Cards float up
        gsap.fromTo(
          ".member-card",
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }, sectionRef);

      return () => gsapCtx.revert();
    }
  }, []);

  return (
    <div ref={sectionRef} className="pt-24 md:pt-36">
      <div ref={titleContainerRef} className="mb-16 md:mb-20 flex items-center justify-between border-b-2 border-slate-200 pb-6 overflow-hidden">
        <h2 className="text-4xl md:text-[3.5rem] font-black tracking-tight text-[#0f172a] flex overflow-hidden line-clamp-1">
          {team.name.split("").map((char, i) => (
            <span key={i} className="team-title-char block transform-gpu translate-y-[120%] leading-tight">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>
        <span className="text-[#3b82f6] text-lg md:text-xl font-black bg-[#eff6ff] px-4 py-1.5 rounded-full hidden sm:block">
          {team.members.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-x-10 md:gap-y-16">
        {team.members.map((member) => (
          <div
            key={member._id}
            className="member-card group relative flex flex-col bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(37,99,235,0.12)] border border-slate-100 transition-all duration-500 hover:-translate-y-2 items-center text-center overflow-hidden"
          >
            {/* Hover Accent Backdrop */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"></div>

            {/* Avatar container */}
            <div className="w-32 h-32 mb-6 relative">
              <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-[#cbd5e1] group-hover:border-[#3b82f6] group-hover:rotate-180 transition-all duration-[1500ms] pointer-events-none scale-110"></div>

              <div className="w-full h-full rounded-full overflow-hidden bg-[#f8fafc] flex items-center justify-center border-4 border-white shadow-lg relative z-10 transition-transform duration-500 group-hover:scale-[1.05]">
                {member.photo_url ? (
                  <img
                    src={getApiUrl(member.photo_url)}
                    alt={member.fullname}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl font-bold text-[#64748b]">${member.fullname.charAt(0).toUpperCase()}</div>`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[#64748b]">
                    {member.fullname.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Typography Info */}
            <div className="w-full relative z-10 flex flex-col items-center">
              <h3 className="text-[1.4rem] font-bold tracking-tight text-[#0f172a] mb-1 leading-snug group-hover:text-[#2563eb] transition-colors duration-300">
                {member.fullname}
              </h3>
              <p className="text-[#64748b] text-[15px] font-semibold tracking-wide mb-6">
                {member.position}
              </p>

              {/* Icon row */}
              <div className="flex items-center gap-3 mt-2">
                {/* Faculty: Info icon → links to LinkedIn if available */}
                {["Director", "Faculty In Charge"].includes(member.position) ? (
                  member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Profile"
                      className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#eff6ff] text-[#2563eb] hover:bg-[#2563eb] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="8" strokeLinecap="round" strokeWidth={3} />
                        <line x1="12" y1="12" x2="12" y2="16" strokeLinecap="round" strokeWidth={2} />
                      </svg>
                    </a>
                  ) : (
                    <span
                      title="Faculty Advisor"
                      className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#eff6ff] text-[#2563eb] shadow-sm cursor-default"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="8" strokeLinecap="round" strokeWidth={3} />
                        <line x1="12" y1="12" x2="12" y2="16" strokeLinecap="round" strokeWidth={2} />
                      </svg>
                    </span>
                  )
                ) : member.linkedin ? (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#eff6ff] text-[#3b82f6] hover:bg-[#2563eb] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                ) : (
                  <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-[#94a3b8] text-xs font-bold tracking-wider">
                    IEEE MEMBER
                  </span>
                )}

                {/* Email icon — shown for all members */}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    title={member.email}
                    className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#f1f5f9] text-[#64748b] hover:bg-[#2563eb] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                  >
                    {/* Mail Icon */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
