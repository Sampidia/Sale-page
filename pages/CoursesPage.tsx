import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { COURSES } from '../constants';
import { CourseFormat } from '../types';

const CoursesPage: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<Record<string, CourseFormat>>({
    'vibe-coding': 'pdf',
    'zero-to-n8n': 'pdf',
  });

  const toggleCourseFormat = (courseId: string, format: CourseFormat) => {
    setSelectedFormat((prev) => ({ ...prev, [courseId]: format }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <SEO
        title="Masterclasses & 1-on-1 Mentorship | Afigo-Sam Tech Courses"
        description="Master Vibe Coding with Android Studio & AI, and Zero to n8n Free Hosting. Available as instant PDF E-Books and 1-on-1 Live Coaching Sessions for ₦30,000 NGN."
        keywords="vibe coding course, android studio ai masterclass, zero to n8n free hosting, n8n self hosting course, afigo sam courses"
      />

      {/* Hero Header Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #09080e 0%, #1c102e 50%, #0d0816 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '60px 24px 64px',
        }}
        className="border-b border-slate-800/80"
      >
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-80px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 mb-5 shadow-lg shadow-red-950/20">
            <span className="text-base">🎓</span>
            <span className="text-red-300 text-xs font-black uppercase tracking-widest">
              Afigo-Sam Premium Masterclasses
            </span>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-black mb-4 tracking-tight leading-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 30%, #fecaca 70%, #ddd6fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Level Up Your AI & Mobile Engineering
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-6 leading-relaxed">
            Choose your learning format: <span className="text-red-400 font-bold">Instant PDF Blueprint</span> or <span className="text-purple-400 font-bold">1-on-1 Live Coaching</span>. Standard fee is ₦30,000 NGN with instant fulfillment.
          </p>
        </div>
      </section>

      {/* Course Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {COURSES.map((course) => {
            const currentFormat = selectedFormat[course.id] || 'pdf';
            const currentCover = currentFormat === 'one-on-one' ? course.oneOnOneCoverUrl : course.pdfCoverUrl;

            return (
              <div
                key={course.id}
                className="bg-slate-900/70 border border-slate-800 hover:border-red-500/40 rounded-3xl overflow-hidden transition-all duration-300 shadow-2xl flex flex-col justify-between backdrop-blur-md group"
              >
                <div>
                  {/* Image Showcase Container */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-950 border-b border-slate-800">
                    <img
                      src={currentCover}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />

                    {/* Format Selector Overlay */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="bg-red-600 text-white font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                          {course.badge}
                        </span>
                        <span className="bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
                          {course.level}
                        </span>
                      </div>

                      <div className="bg-slate-950/90 border border-slate-700/80 rounded-2xl px-3.5 py-1 text-red-400 font-black text-sm backdrop-blur-md shadow-lg">
                        ₦{course.price.toLocaleString()} NGN
                      </div>
                    </div>

                    {/* Quick Format Switcher Pill Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-center">
                      <div className="bg-slate-950/90 border border-slate-800 p-1 rounded-xl flex gap-1 backdrop-blur-md shadow-xl">
                        <button
                          type="button"
                          onClick={() => toggleCourseFormat(course.id, 'pdf')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            currentFormat === 'pdf'
                              ? 'bg-red-600 text-white shadow-md'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>📘</span> PDF Blueprint
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCourseFormat(course.id, 'one-on-one')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            currentFormat === 'one-on-one'
                              ? 'bg-purple-600 text-white shadow-md'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>🤝</span> 1-on-1 Mentorship
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Main Header & Instant Action Buttons (ABOVE THE FOLD) */}
                  <div className="p-6 sm:p-7">
                    <h2 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight group-hover:text-red-400 transition-colors">
                      {course.title}
                    </h2>
                    <p className="text-red-400/90 text-xs font-extrabold uppercase tracking-wide mb-4">
                      {course.subtitle}
                    </p>

                    {/* IMMEDIATE CTAs ABOVE CURRICULUM */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                      <Link
                        to={`/course/${course.id}`}
                        className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white font-black text-sm px-5 py-3.5 rounded-2xl transition-all shadow-lg shadow-red-950/50 flex items-center justify-center gap-2"
                      >
                        <span>🎯</span> Enroll Now — ₦{course.price.toLocaleString()}
                      </Link>

                      <a
                        href={course.selarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm:w-auto text-center bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-1.5"
                        title="Buy directly via Selar"
                      >
                        <span>🛒</span> Buy on Selar
                      </a>
                    </div>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
                      {course.description}
                    </p>

                    {/* Concise Bullet Highlights */}
                    <div className="space-y-2 border-t border-slate-800/80 pt-4">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                        Key Highlights Included:
                      </h4>
                      {course.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="text-red-500 font-bold shrink-0">✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 sm:px-7 pb-6 pt-0 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <span>⚡</span> Instant Delivery Guaranteed
                  </span>
                  <Link
                    to={`/course/${course.id}`}
                    className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition-colors"
                  >
                    Full Details & Curriculum →
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

        {/* Value Props Strip */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 text-center">
            <span className="text-2xl mb-2 block">📩</span>
            <h3 className="text-white font-bold text-sm mb-1">Instant Resend Email Fulfillment</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              PDF masterclass guides are emailed instantly upon verified checkout.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 text-center">
            <span className="text-2xl mb-2 block">📅</span>
            <h3 className="text-white font-bold text-sm mb-1">Flexible 1-on-1 Calendly Slot</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Book your live mentorship session directly via Calendly post-payment.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 text-center">
            <span className="text-2xl mb-2 block">🛡️</span>
            <h3 className="text-white font-bold text-sm mb-1">256-Bit Encrypted Payment</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Secured by Flutterwave supporting cards, bank transfer, and USSD.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default CoursesPage;
