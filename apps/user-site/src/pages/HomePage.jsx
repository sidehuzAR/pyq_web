import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar.jsx';
import SectionHeading from '../components/shared/SectionHeading.jsx';
import GeometricDecoration from '../components/shared/GeometricDecoration.jsx';
import Button from '../components/shared/Button.jsx';
import { Calendar, GraduationCap, ArrowRight, Filter } from 'lucide-react';
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
              <span className="text-bauhaus-red">ARCHIVE</span> FOR VIT
            </h1>

            <p className="text-base sm:text-lg font-medium text-bauhaus-muted max-w-xl leading-relaxed">
              Instant zero-login access to Previous Year Question (PYQ) papers across all engineering timetable slots, exam categories, and academic terms.
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

          {/* Right Column (40% Bauhaus Geometric Composition) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <GeometricDecoration />
          </div>
        </div>
      </section>


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

