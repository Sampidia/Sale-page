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

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Structured Data (JSON-LD) for Search & AI Engines
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Afigo-Sam Tech Masterclasses & Live Mentorship',
    'description': 'Master AI-assisted Android app engineering (Vibe Coding) and zero-cost self-hosting for n8n AI workflows.',
    'itemListElement': COURSES.map((course, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Course',
        'name': course.title,
        'description': course.description,
        'provider': {
          '@type': 'Person',
          'name': 'Afigo Sam',
          'url': 'https://afigo.sampidia.com'
        },
        'offers': {
          '@type': 'Offer',
          'price': course.price,
          'priceCurrency': course.currency
        }
      }
    }))
  };

  const catalogFaqQuestions = [
    {
      q: 'What masterclasses are offered by Afigo Sam?',
      a: 'We offer two core masterclasses: (1) Vibe Coding — Building High-End Android Apps with Android Studio & Antigravity + AI, and (2) Zero to n8n — Self-Host Enterprise AI Automation Pipelines for ₦0/Month.'
    },
    {
      q: 'What is the price of the masterclasses?',
      a: 'Each masterclass is priced at ₦30,000 NGN. You can choose between the PDF E-Book Blueprint or 30-minute 1-on-1 Live Video Mentorship.'
    },
    {
      q: 'Can I purchase multiple 1-on-1 mentorship sessions?',
      a: 'Yes! Each 1-on-1 mentorship purchase grants one 30-minute live video session. You can complete checkout multiple times to book consecutive or additional 30-minute slots.'
    }
  ];

  const catalogFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': catalogFaqQuestions.map(item => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a
      }
    }))
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <SEO
        title="Masterclasses & 1-on-1 Mentorship | Afigo-Sam Tech Courses"
        description="Master Vibe Coding with Android Studio & AI, and Zero to n8n Free Hosting. Available as instant PDF E-Books and 1-on-1 Live Coaching Sessions for ₦30,000 NGN."
        keywords="vibe coding course, android studio ai masterclass, zero to n8n free hosting, n8n self hosting course, afigo sam courses"
        ogType="website"
        jsonLd={[itemListSchema, catalogFaqSchema]}
      />

      {/* Hero Header Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #09080e 0%, #1c102e 50%, #0d0816 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '48px 20px 56px',
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
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 mb-4 shadow-lg shadow-red-950/20">
            <span className="text-base">🎓</span>
            <span className="text-red-300 text-xs font-black uppercase tracking-widest">
              Afigo-Sam Premium Masterclasses
            </span>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-black mb-3 tracking-tight leading-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 30%, #fecaca 70%, #ddd6fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Level Up Your AI & Mobile Engineering
          </h1>

          <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto mb-4 leading-relaxed">
            Choose your learning format: <span className="text-red-400 font-bold">Instant PDF Blueprint</span> or <span className="text-purple-400 font-bold">1-on-1 Live Coaching</span>. Standard fee is ₦30,000 NGN with instant fulfillment.
          </p>
        </div>
      </section>

      {/* Course Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        
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
                  {/* Clean Top Info Bar (Prevents Mobile Collision) */}
                  <div className="p-4 bg-slate-950 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="bg-red-600 text-white font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                        {course.badge}
                      </span>
                      <span className="bg-slate-900 text-slate-300 border border-slate-800 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {course.level}
                      </span>
                    </div>

                    <div className="bg-red-950/60 border border-red-800/60 text-red-400 font-black text-xs sm:text-sm px-3 py-0.5 rounded-full">
                      ₦{course.price.toLocaleString()} NGN
                    </div>
                  </div>

                  {/* Image Showcase Container */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-950 border-b border-slate-800">
                    <img
                      src={currentCover}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />

                    {/* Quick Format Switcher Pill Overlay at Bottom of Image */}
                    <div className="absolute bottom-2.5 left-2 right-2 flex justify-center">
                      <div className="bg-slate-950/90 border border-slate-800 p-1 rounded-xl flex gap-1 backdrop-blur-md shadow-xl max-w-full overflow-x-auto">
                        <button
                          type="button"
                          onClick={() => toggleCourseFormat(course.id, 'pdf')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
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
                          className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                            currentFormat === 'one-on-one'
                              ? 'bg-purple-600 text-white shadow-md'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>🤝</span> 1-on-1 (30 min)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Main Header & Instant Action Buttons (ABOVE THE FOLD) */}
                  <div className="p-5 sm:p-7">
                    <h2 className="text-lg sm:text-2xl font-black text-white mb-1.5 leading-tight group-hover:text-red-400 transition-colors">
                      {course.title}
                    </h2>
                    <p className="text-red-400/90 text-xs font-extrabold uppercase tracking-wide mb-4">
                      {course.subtitle}
                    </p>

                    {/* IMMEDIATE CTAs ABOVE CURRICULUM */}
                    <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
                      <Link
                        to={`/course/${course.id}`}
                        className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm px-4 py-3 rounded-2xl transition-all shadow-lg shadow-red-950/50 flex items-center justify-center gap-1.5"
                      >
                        <span>🎯</span> Enroll Now — ₦{course.price.toLocaleString()}
                      </Link>

                      <a
                        href={course.selarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm:w-auto text-center bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-3 rounded-2xl transition-all flex items-center justify-center gap-1.5"
                        title="Buy directly via Selar"
                      >
                        <span>🛒</span> Buy on Selar
                      </a>
                    </div>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
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
                <div className="px-5 sm:px-7 pb-5 pt-0 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1 text-[11px]">
                    <span>⚡</span> Instant Delivery Guaranteed
                  </span>
                  <Link
                    to={`/course/${course.id}`}
                    className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition-colors text-[11px]"
                  >
                    Full Details →
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

        {/* Value Props Strip */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
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

        {/* ── CATALOG FAQ SECTION (AEO & GEO Search Engine Optimization) ───────────────── */}
        <div className="mt-16 border-t border-slate-800/80 pt-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              Course Catalog FAQ
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-3 mb-2">
              Common Questions Answered
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Quick answers about masterclass formats, instant fulfillment, and 1-on-1 mentorship.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {catalogFaqQuestions.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-white">
                      {item.q}
                    </span>
                    <span className="text-red-400 text-lg font-black shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-0 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/50">
                      <p className="pt-3">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
};

export default CoursesPage;
