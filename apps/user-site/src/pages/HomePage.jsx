import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar.jsx';
import SectionHeading from '../components/shared/SectionHeading.jsx';
import GeometricDecoration from '../components/shared/GeometricDecoration.jsx';
import Button from '../components/shared/Button.jsx';
import { Calendar, GraduationCap, ArrowRight, Filter, FileText, BookOpen } from 'lucide-react';
import { ACADEMIC_YEARS } from '../constants/enums.js';

export default function HomePage({
  courses = [],
  approvedPapers = [],
  searchQuery,
  setSearchQuery,
  onToast
}) {
  const navigate = useNavigate();

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  const handleBrowseNavigate = () => {
    if (selectedBranch) {
      navigate(`/catalogue/${selectedBranch}${selectedYear ? `?year=${selectedYear}` : ''}`);
    } else {
      navigate('/catalogue');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section (60 / 40 Bauhaus Split) */}
      <section className="bg-bauhaus-surface border-4 border-bauhaus-border p-6 sm:p-10 shadow-bauhaus-lg sharp relative overflow-hidden transition-colors duration-200">
        {/* Top Accent Strip */}
        <div className="h-3 bg-bauhaus-red w-full -mt-6 sm:-mt-10 -mx-6 sm:-mx-10 mb-8 border-b-2 border-bauhaus-border"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column (60%) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-bauhaus-elevated text-bauhaus-blue border border-bauhaus-border px-3 py-1 text-xs font-mono font-black uppercase tracking-widest sharp transition-colors duration-200">
              <span>00</span> ARCHIVE SYSTEM
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-bauhaus-ink leading-none uppercase tracking-tight">
              EXAM PAPERS <br />
              <span className="text-bauhaus-red">ARCHIVE</span> FOR VIT CHENNAI
            </h1>

            <p className="text-base sm:text-lg font-medium text-bauhaus-muted max-w-xl leading-relaxed flex flex-wrap items-center gap-y-2">
              <span>Previous year question papers for VIT Chennai students. </span>
              <span className="bg-bauhaus-yellow text-bauhaus-canvas px-2 py-0.5 text-xs font-mono font-black uppercase tracking-wider sharp border border-bauhaus-border shadow-bauhaus-sm inline-block">
                [FOR ACE CURRICULUM]
              </span>
            </p>

            {/* Dominant Hero Search Action */}
            <div className="pt-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-bauhaus-blue mb-1.5 flex items-center gap-1.5">
                <SearchIcon /> FIND YOUR COURSE INSTANTLY:
              </div>
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                courses={courses}
                className="max-w-xl"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button variant="primary" size="md" onClick={() => navigate('/catalogue')}>
                EXPLORE ALL CATALOGUE →
              </Button>
              <Button variant="secondary" size="md" onClick={() => navigate('/upload')}>
                CONTRIBUTE PAPER
              </Button>
            </div>
          </div>

          {/* Right Column (Stats Cards & Exam Blocks - Exact match with Photo 2) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm space-y-4">

              {/* Stat Card 1: Total Papers */}
              <div className="bg-bauhaus-surface border-4 border-bauhaus-border p-5 shadow-2xl relative sharp">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-black tracking-widest text-bauhaus-muted uppercase">
                    TOTAL PAPERS
                  </span>
                  <div className="w-7 h-7 bg-[#D92D20] text-white flex items-center justify-center sharp">
                    <FileText size={15} />
                  </div>
                </div>
                <div className="text-5xl font-black text-bauhaus-ink font-display tabular-nums tracking-tight">
                  {approvedPapers.length || 13}
                </div>
                <div className="mt-2 h-1 bg-bauhaus-elevated">
                  <div className="h-full bg-[#D92D20] w-[75%]" />
                </div>
              </div>

              {/* Stat Card 2: Courses Indexed */}
              <div className="bg-bauhaus-surface border-4 border-bauhaus-border p-5 shadow-2xl relative sharp">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-black tracking-widest text-bauhaus-muted uppercase">
                    COURSES INDEXED
                  </span>
                  <div className="w-7 h-7 bg-[#00D4FF] text-black flex items-center justify-center sharp">
                    <BookOpen size={15} />
                  </div>
                </div>
                <div className="text-5xl font-black text-bauhaus-ink font-display tabular-nums tracking-tight">
                  {courses.length || 3}
                </div>
                <div className="mt-2 h-1 bg-bauhaus-elevated">
                  <div className="h-full bg-[#00D4FF] w-[60%]" />
                </div>
              </div>

              {/* Mini Exam Category Quick Filters with Rich Animations */}
              <div className="grid grid-cols-3 gap-3">
                <div
                  onClick={() => navigate('/catalogue?exam=CAT1')}
                  className="bg-[#D92D20] text-white p-3 border-2 border-bauhaus-border shadow-md text-center cursor-pointer sharp transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-[0_8px_20px_rgba(217,45,32,0.45)] active:scale-95 active:translate-y-0 group"
                  title="Filter CAT-1 Papers"
                >
                  <div className="text-[9px] font-mono font-bold tracking-widest text-white/80 group-hover:text-white transition-colors">EXAM</div>
                  <div className="text-base font-black tracking-wider mt-0.5 group-hover:scale-110 transition-transform">CAT-1</div>
                </div>

                <div
                  onClick={() => navigate('/catalogue?exam=CAT2')}
                  className="bg-[#00D4FF] text-black p-3 border-2 border-bauhaus-border shadow-md text-center cursor-pointer sharp transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-[0_8px_20px_rgba(0,212,255,0.45)] active:scale-95 active:translate-y-0 group"
                  title="Filter CAT-2 Papers"
                >
                  <div className="text-[9px] font-mono font-bold tracking-widest text-black/80 group-hover:text-black transition-colors">EXAM</div>
                  <div className="text-base font-black tracking-wider mt-0.5 group-hover:scale-110 transition-transform">CAT-2</div>
                </div>

                <div
                  onClick={() => navigate('/catalogue?exam=FAT')}
                  className="bg-[#E8A838] text-black p-3 border-2 border-bauhaus-border shadow-md text-center cursor-pointer sharp transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-[0_8px_20px_rgba(232,168,56,0.45)] active:scale-95 active:translate-y-0 group"
                  title="Filter FAT Papers"
                >
                  <div className="text-[9px] font-mono font-bold tracking-widest text-black/80 group-hover:text-black transition-colors">EXAM</div>
                  <div className="text-base font-black tracking-wider mt-0.5 group-hover:scale-110 transition-transform">FAT</div>
                </div>
              </div>

              {/* Bauhaus Decorative Corner Accents */}
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-4 border-r-4 border-[#D92D20]" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-4 border-l-4 border-[#00D4FF]" />

            </div>
          </div>
        </div>
      </section>


      {/* Full-Width Sliding Marquee Ticker Strip (Exact match with user photo) */}
      <div className="w-full bg-bauhaus-surface border-y-2 border-bauhaus-border py-3 overflow-hidden select-none my-6">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {[...courses, ...courses, ...courses, ...courses].map((course, idx) => (
            <span
              key={idx}
              onClick={() => navigate(`/catalogue/${course.course_code}`)}
              className="inline-flex items-center gap-4 px-6 font-mono text-xs font-black uppercase text-bauhaus-yellow tracking-widest cursor-pointer hover:text-bauhaus-ink transition-colors"
            >
              <span>{course.course_code} - {course.subject_name}</span>
              <span className="text-bauhaus-yellow font-black text-xs">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* Section 01: Contribute Banner */}
      <section className="bg-bauhaus-elevated text-bauhaus-ink border-4 border-bauhaus-border p-8 shadow-bauhaus-lg sharp flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-200">
        <div className="space-y-2">
          <div className="font-mono text-xs font-bold text-bauhaus-yellow uppercase tracking-widest flex items-center gap-2">
            <Filter size={14} />
            01 STUDENT COMMUNITY
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-bauhaus-ink">
            HAVE A QUESTION PAPER SCAN?
          </h2>
          <p className="text-sm text-bauhaus-muted max-w-xl">
            Help fellow engineering students prepare for exams. Upload your CAT-1, CAT-2, or FAT paper scans for moderation.
          </p>
        </div>

        <Button variant="secondary" size="lg" onClick={() => navigate('/upload')}>
          UPLOAD PAPER NOW →
        </Button>
      </section>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

