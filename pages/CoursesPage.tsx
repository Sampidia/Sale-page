import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { COURSES } from '../constants';
import { CourseFormat } from '../types';

const CoursesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | CourseFormat>('all');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <SEO
        title="Masterclasses & 1-on-1 Mentorship | Afigo-Sam Tech Courses"
        description="Master Vibe Coding with Android Studio & AI, and Zero to n8n Free Hosting. Available as instant PDF E-Books and 1-on-1 Live Coaching Sessions for ₦30,000 NGN."
        keywords="vibe coding course, android studio ai masterclass, zero to n8n free hosting, n8n self hosting course, afigo sam courses"
      />

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #09090f 0%, #1a102b 50%, #0c0814 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '80px 24px 96px',
        }}
        className="border-b border-slate-800/80"
      >
        {/* Background glow graphics */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(239,68,68,0.18) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-2 mb-6 shadow-lg shadow-red-950/20">
            <span className="text-lg">🎓</span>
            <span className="text-red-300 text-xs font-black uppercase tracking-widest">
              High-Impact Tech Masterclasses
            </span>
          </div>

          <h1
            className="text-4xl sm:text-6xl font-black mb-6 tracking-tight leading-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 30%, #fecaca 70%, #ddd6fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Level Up Your AI & Mobile<br className="hidden sm:inline" /> Engineering Skills
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Gain production-grade mastery with practical, no-nonsense training. Available as <strong className="text-red-400">Instant PDF Blueprints</strong> or <strong className="text-purple-400">Direct 1-on-1 Live Coaching Sessions</strong>.
          </p>

          {/* Pricing Highlight Pill */}
          <div className="inline-flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-6 py-3 shadow-2xl backdrop-blur-md">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Standard Masterclass Price:</span>
            <span className="text-red-500 font-black text-2xl">₦30,000 NGN</span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold px-2.5 py-1 rounded-full uppercase">
              Full Access Included
            </span>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow">
        
        {/* Format Selector Filter Tabs */}
        <div className="flex justify-center mb-14">
          <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl flex gap-2 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                activeTab === 'all'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              🚀 All Masterclasses ({COURSES.length})
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                activeTab === 'pdf'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              📘 PDF E-Books
            </button>
            <button
              onClick={() => setActiveTab('one-on-one')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                activeTab === 'one-on-one'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              🤝 1-on-1 Mentorship
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {COURSES.map((course) => {
            const coverImage = activeTab === 'one-on-one' ? course.oneOnOneCoverUrl : course.pdfCoverUrl;

            return (
              <div
                key={course.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-red-500/40 rounded-3xl overflow-hidden transition-all duration-300 shadow-2xl flex flex-col justify-between group backdrop-blur-md"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-950 border-b border-slate-800">
                    <img
                      src={coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      <span className="bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        {course.badge}
                      </span>
                      <span className="bg-slate-900/90 text-slate-200 border border-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                        {course.level}
                      </span>
                    </div>

                    <div className="absolute bottom-4 right-4 bg-slate-950/90 border border-slate-800 text-red-400 font-black text-lg px-4 py-1.5 rounded-2xl backdrop-blur-md shadow-xl">
                      ₦{course.price.toLocaleString()} NGN
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-black text-white mb-2 group-hover:text-red-400 transition-colors leading-tight">
                      {course.title}
                    </h2>
                    <p className="text-red-400/90 text-xs font-bold uppercase tracking-wide mb-4">
                      {course.subtitle}
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      {course.description}
                    </p>

                    {/* Features checklist */}
                    <div className="space-y-2.5 mb-8">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                        Key Curriculum Highlights:
                      </h4>
                      {course.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="text-red-500 font-bold shrink-0">✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="px-6 sm:px-8 pb-8 pt-0 flex flex-col sm:flex-row gap-3">
                  <Link
                    to={`/course/${course.id}`}
                    className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white font-black text-sm px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-red-950/40 flex items-center justify-center gap-2"
                  >
                    <span>🎯</span> View Course & Enroll
                  </Link>

                  <a
                    href={course.selarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm:w-auto text-center bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-1.5"
                    title="Buy directly via Selar store"
                  >
                    <span>🛒</span> Buy on Selar
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantees Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-center">
            <span className="text-3xl mb-3 block">⚡</span>
            <h3 className="text-white font-bold text-base mb-2">Instant Automated Delivery</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              PDF masterclasses are emailed directly to your inbox immediately upon payment confirmation.
            </p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-center">
            <span className="text-3xl mb-3 block">📅</span>
            <h3 className="text-white font-bold text-base mb-2">Flexible 1-on-1 Scheduling</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Pick your preferred date and time via Calendly post-checkout with 24-hour rescheduling flexibility.
            </p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-center">
            <span className="text-3xl mb-3 block">🔒</span>
            <h3 className="text-white font-bold text-base mb-2">Secure Flutterwave Payment</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              100% encrypted checkout supporting Debit Cards, Bank Transfer, USSD, and Mobile Money.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
};

export default CoursesPage;
