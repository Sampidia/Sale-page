import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { 
  PRODUCTS, 
  MOBILE_APPS, 
  CLIENT_PROJECTS, 
  SKILL_CATEGORIES, 
  EXPERIENCE_TIMELINE, 
  EDUCATION_TIMELINE,
  FIVERR_URL,
  UPWORK_URL,
  N8N_CREATOR_URL,
  CV_DOWNLOAD_URL,
  EMAIL_MAIN,
  EMAIL_SUPPORT,
  PHONE_MAIN,
  LOCATION_MAIN,
  BRAIN_LOGO
} from '../constants';
import { ClientProjectCategory } from '../types';

const LandingPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProjectModal, setSelectedProjectModal] = useState<typeof CLIENT_PROJECTS[0] | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const categories: (ClientProjectCategory | 'All')[] = [
    'All',
    'Hotel Booking',
    'E-commerce',
    'Appointment Booking',
    'AI & Web3'
  ];

  const filteredProjects = activeCategory === 'All' 
    ? CLIENT_PROJECTS 
    : CLIENT_PROJECTS.filter(p => p.category === activeCategory);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Structured Data (JSON-LD) for Search & AI Engines
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': 'Oghenekaro Samson Afigo',
    'alternateName': 'Afigo Sam',
    'url': 'https://afigo.sampidia.com',
    'jobTitle': 'Full-Stack Web & Mobile Developer, AI Automation Engineer',
    'almaMater': 'M.Sc. Industrial Chemistry',
    'sameAs': [
      FIVERR_URL,
      UPWORK_URL,
      N8N_CREATOR_URL
    ]
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Afigo-Sam Technology & SamPidia',
    'url': 'https://afigo.sampidia.com'
  };

  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'Afigo-Sam Technology Solutions',
    'description': 'Custom WordPress plugins, hotel booking engines, React Native Android apps, and n8n AI multi-agent automation workflows.',
    'url': 'https://afigo.sampidia.com',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Ilorin',
      'addressRegion': 'Kwara State',
      'addressCountry': 'Nigeria'
    }
  };

  const landingFaqQuestions = [
    {
      q: 'Who is Oghenekaro Samson Afigo (Afigo Sam)?',
      a: 'Oghenekaro Samson Afigo (Afigo Sam) is a Full-Stack Web & Mobile Developer, published n8n AI workflow creator, and M.Sc. Industrial Chemist with over 8 years of active commercial software development experience.'
    },
    {
      q: 'What technical services does Afigo-Sam Technology provide?',
      a: 'We specialize in custom WordPress booking plugins, hotel/e-commerce platforms, native Android app development (React Native & Android Studio), Solana Rust smart contracts, and n8n AI multi-agent automation workflows.'
    },
    {
      q: 'How can I hire Afigo Sam for custom development projects?',
      a: 'You can reach out directly via email at admin@sampidia.com, phone/WhatsApp at +234 903 717 2693, or hire via our verified Fiverr Pro Seller and Upwork profiles.'
    }
  ];

  const landingFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': landingFaqQuestions.map(item => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a
      }
    }))
  };

  return (
    <div className="bg-slate-50 text-slate-800 antialiased selection:bg-red-500 selection:text-white">
      <SEO
        title="Oghenekaro Samson Afigo | Full-Stack Developer, AI Automation Engineer & Industrial Chemist"
        description="Official portfolio of Oghenekaro Samson Afigo (Afigo Sam) - Full-Stack Web & Mobile Developer, published n8n workflow creator, AI automation engineer, and M.Sc. Industrial Chemist."
        keywords="Oghenekaro Samson Afigo, Afigo Sam, SamPidia, AI automation engineer, n8n creator, WordPress developer, React Native developer, Solana Rust developer, Industrial Chemist"
        ogImage="/assets/og-preview.png"
        jsonLd={[personSchema, websiteSchema, professionalServiceSchema, landingFaqSchema]}
      />

      {/* HERO SECTION — Compact Above-The-Fold Layout */}
      <section className="relative flex items-center pt-6 pb-10 lg:pt-10 lg:pb-12 overflow-hidden bg-slate-950 text-white">
        {/* Ambient Decorative Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(#ef444410_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column — Clean Compact Luxury Typography */}
            <div className="lg:col-span-7 flex flex-col items-start">
              
              {/* Live Status Badge */}
              <div className="inline-flex items-center space-x-2 bg-slate-900/90 border border-slate-800/90 px-3.5 py-1.5 rounded-full mb-4 backdrop-blur-xl shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                  Available for Select Projects & AI Consulting
                </span>
              </div>

              {/* High-Impact Name */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-3">
                Oghenekaro Samson Afigo
              </h1>
              
              {/* Role Subtitle Strip */}
              <div className="text-xs sm:text-base font-semibold text-slate-300 mb-3 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="text-white">Full-Stack Web & Mobile Developer</span>
                <span className="text-red-500 font-bold">•</span>
                <span className="text-white">AI Automation Engineer</span>
                <span className="text-red-500 font-bold">•</span>
                <span className="text-slate-400 font-normal">Industrial Chemist (M.Sc.)</span>
              </div>

              {/* Bio Paragraph */}
              <p className="text-xs sm:text-sm text-slate-300/90 mb-5 leading-relaxed max-w-xl font-normal">
                Founder of <strong className="text-white font-semibold">Afigo-Sam Technology</strong> & co-founder of <strong className="text-white font-semibold">SamPidia</strong>. Published n8n workflow creator with 8+ years of engineering experience delivering hotel booking engines, e-commerce stores, custom WordPress plugins, React Native apps, and Solana dApps.
              </p>

              {/* CTA Buttons — Prominent & Visible Above Fold */}
              <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-6">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm tracking-wide rounded-xl transition-all shadow-[0_0_25px_rgba(239,68,68,0.35)] hover:shadow-[0_0_35px_rgba(239,68,68,0.5)] transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Explore Client Work</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <a
                  href={CV_DOWNLOAD_URL}
                  download="Oghenekaro_Samson_Afigo_CV.pdf"
                  className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download CV</span>
                </a>
              </div>

              {/* Unified Profile Badges */}
              <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-900 w-full">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1">Verified Profiles:</span>
                <a href={FIVERR_URL} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-red-500/50 text-slate-300 hover:text-white text-[11px] font-semibold rounded-lg transition-all shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Fiverr Pro Seller
                </a>
                <a href={UPWORK_URL} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-red-500/50 text-slate-300 hover:text-white text-[11px] font-semibold rounded-lg transition-all shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Upwork Top-Rated
                </a>
                <a href={N8N_CREATOR_URL} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-red-500/50 text-slate-300 hover:text-white text-[11px] font-semibold rounded-lg transition-all shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  n8n Creator Profile
                </a>
              </div>

            </div>

            {/* Right Column Bento Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-red-600/30 to-slate-800/20 rounded-3xl blur-md opacity-50"></div>
                
                <div className="relative backdrop-blur-xl bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
                  {/* Header Studio Info */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-800/50 flex items-center justify-center text-red-500 font-black text-lg shadow-inner">
                        A
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm">Afigo-Sam Studio</h3>
                        <p className="text-[11px] text-slate-400">Established 2015</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-semibold rounded-full">
                      M.Sc. Rigor
                    </span>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950/50 border border-slate-800/70 p-3 rounded-xl">
                      <div className="text-xl font-black text-white mb-0.5">8+</div>
                      <div className="text-[10px] text-slate-400 font-medium">Years Active Experience</div>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800/70 p-3 rounded-xl">
                      <div className="text-xl font-black text-white mb-0.5">15+</div>
                      <div className="text-[10px] text-slate-400 font-medium">Global Client Websites</div>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800/70 p-3 rounded-xl">
                      <div className="text-xl font-black text-white mb-0.5">5+</div>
                      <div className="text-[10px] text-slate-400 font-medium">Published n8n Workflows</div>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800/70 p-3 rounded-xl">
                      <div className="text-xl font-black text-white mb-0.5">6+</div>
                      <div className="text-[10px] text-slate-400 font-medium">In-House Apps & Plugins</div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3 text-[11px] text-slate-300 italic leading-relaxed">
                    "Combining a scientist's analytical rigor (M.Sc. Industrial Chemistry) with hands-on software engineering across WordPress, React Native, and Rust on Solana."
                  </div>

                  {/* Contact Footer */}
                  <div className="pt-0.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>📍 {LOCATION_MAIN}</span>
                    <a href={`mailto:${EMAIL_MAIN}`} className="text-red-400 font-semibold hover:underline">
                      {EMAIL_MAIN}
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT & ANALYTICAL EDGE SECTION */}
      <section id="about" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 px-3.5 py-1.5 rounded-full">
              About Me
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
              A Scientist's Mind Meets <span className="gradient-text">Software Engineering</span>
            </h2>
            <p className="text-slate-600 mt-4 text-lg leading-relaxed">
              With a Master of Science in Industrial Chemistry and over a decade of programming expertise, I build robust, high-performance digital products backed by scientific precision and creative vision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200/80 p-8 rounded-3xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 font-bold text-xl mb-6">
                🔬
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Analytical Rigor</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                M.Sc. research on green synthesis of copper oxide nanoparticles and antimicrobial activities. Applies systematic data modeling, gravimetric analysis, and precision to code security and architecture.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 p-8 rounded-3xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 font-bold text-xl mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI & Automation Architect</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Published creator on n8n.io. Builds autonomous multi-agent pipelines integrating OpenAI, Gemini, Claude, FLUX image generation, Telegram storefront bots, and API webhooks for seamless business ops.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 p-8 rounded-3xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 font-bold text-xl mb-6">
                🌐
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Full-Stack & Web3 Systems</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Delivered 15+ production systems across USA, UK, Europe, Africa & Asia. Expert in WordPress booking plugins, payment gateways (Paystack/Flutterwave), React Native, Cloudflare edge, and Rust smart contracts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS MATRIX SECTION */}
      <section id="skills" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-400 bg-red-950/60 border border-red-800/60 px-3.5 py-1.5 rounded-full">
              Core Technical Stack
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Skill Matrix & Technical Capabilities
            </h2>
            <p className="text-slate-400 mt-4 text-base">
              A comprehensive toolkit honed across 8+ years of commercial development and academic research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SKILL_CATEGORIES.map((cat, idx) => (
              <div key={cat.title} className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-3xl hover:border-red-500/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">{cat.icon}</span>
                    <h3 className="text-lg font-bold text-white">{cat.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700/60">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 bg-slate-900/90 text-slate-300 text-xs font-medium rounded-lg border border-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT PROJECTS SHOWCASE (FILTERABLE) */}
      <section id="projects" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 px-3.5 py-1.5 rounded-full">
                Featured Work
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                Selected Client Projects
              </h2>
              <p className="text-slate-600 mt-2 text-base">
                Production platforms delivered for businesses in the USA, UK, Colombia, Slovakia, Morocco, Vanuatu, and Nigeria.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                      {project.category}
                    </div>
                  </div>

                  {/* Content Box */}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span>Client: <strong className="text-slate-700 font-semibold">{project.client}</strong></span>
                      {project.date && <span>{project.date}</span>}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                      {project.title}
                    </h3>

                    {project.location && (
                      <p className="text-xs text-red-600 font-medium mb-3">
                        📍 {project.location}
                      </p>
                    )}

                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 pb-6">
                  {project.websiteUrl && (
                    <a
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-slate-900 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Visit Live Website</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROPRIETARY PRODUCTS & MOBILE APPS (AFIGO-SAM ECOSYSTEM) */}
      <section id="products" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-600 bg-red-100 border border-red-200 px-3.5 py-1.5 rounded-full">
              In-House Innovations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
              Plugins, Tools & Mobile Apps
            </h2>
            <p className="text-slate-600 mt-4 text-base">
              Proprietary software solutions engineered by Afigo-Sam Technology and used by thousands of global creators.
            </p>
          </div>

          {/* Plugins Grid */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Featured WordPress Plugins</h3>
              <Link to="/products" className="text-sm font-bold text-red-600 hover:underline flex items-center space-x-1">
                <span>View All Plugins</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PRODUCTS.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Mobile Apps Row */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Published Mobile Apps</h3>
              <Link to="/apps" className="text-sm font-bold text-red-600 hover:underline flex items-center space-x-1">
                <span>View All Mobile Apps</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {MOBILE_APPS.map(app => (
                <div key={app.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="h-40 bg-slate-100 rounded-2xl overflow-hidden mb-4 relative">
                      <img src={app.imageUrl} alt={app.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {app.category}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{app.name}</h4>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {app.description}
                    </p>
                  </div>
                  <Link 
                    to={`/app/${app.id}`}
                    className="w-full py-2.5 bg-slate-100 hover:bg-red-600 hover:text-white text-slate-900 font-bold text-xs rounded-xl transition-colors text-center block"
                  >
                    App Details & Google Play Link
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* EXPERIENCE & EDUCATION TIMELINE */}
      <section id="experience" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Work Experience */}
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold text-lg">
                  💼
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">Professional Experience</h2>
              </div>

              <div className="space-y-8 border-l-2 border-slate-200 pl-6 ml-4">
                {EXPERIENCE_TIMELINE.map((exp, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-red-600 border-4 border-white shadow"></div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{exp.role}</h3>
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">{exp.company}</p>
                    <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                      {exp.description.map((d, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic & Research Background */}
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold text-lg">
                  🎓
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">Education & Research</h2>
              </div>

              <div className="space-y-8 border-l-2 border-slate-200 pl-6 ml-4 mb-12">
                {EDUCATION_TIMELINE.map((edu, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-4 border-white shadow"></div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{edu.degree}</h3>
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">{edu.institution}</p>
                    <p className="text-xs text-slate-600 italic bg-slate-50 border border-slate-200 p-3 rounded-xl">
                      {edu.thesisOrDissertation}
                    </p>
                  </div>
                ))}
              </div>

              {/* Research & Publications Box */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800">
                <h4 className="text-base font-bold text-red-400 mb-3 flex items-center space-x-2">
                  <span>📚 Publications & Peer Review</span>
                </h4>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Reviewer</strong> — IOPScience: Advances in Natural Sciences: Nanoscience and Nanotechnology (2022).</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Author</strong> — Academia: Assessment of Corrosion Rate of Dissimilar Welded Metals: Gravimetric Analysis (2015).</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FAQ SECTION (AEO & GEO Search Engine Optimization) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-600 bg-red-100 border border-red-200 px-3.5 py-1.5 rounded-full">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-4 tracking-tight">
              Services & Engineering FAQ
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Direct answers about working with Afigo Sam and Afigo-Sam Technology.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {landingFaqQuestions.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-slate-900">
                      {item.q}
                    </span>
                    <span className="text-red-600 text-lg font-black shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-0 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                      <p className="pt-3">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT & CALL TO ACTION */}
      <section id="contact" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          {BRAIN_LOGO}
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-400 bg-red-950/80 border border-red-800/80 px-4 py-1.5 rounded-full inline-block mb-6">
            Get In Touch
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight">
            Have a Project or AI Automation Need?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you need custom WordPress plugin development, hotel/appointment booking portals, React Native mobile apps, or high-level n8n multi-agent AI workflows — let's build something remarkable.
          </p>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <a href={`mailto:${EMAIL_MAIN}`} className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl hover:border-red-500 transition-colors text-center group">
              <div className="text-2xl mb-2">✉️</div>
              <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Direct Email</div>
              <div className="text-xs font-bold text-white group-hover:text-red-400 truncate">{EMAIL_MAIN}</div>
            </a>

            <a href={`tel:${PHONE_MAIN}`} className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl hover:border-red-500 transition-colors text-center group">
              <div className="text-2xl mb-2">📞</div>
              <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Phone / WhatsApp</div>
              <div className="text-xs font-bold text-white group-hover:text-red-400">{PHONE_MAIN}</div>
            </a>

            <a href={FIVERR_URL} target="_blank" rel="noopener noreferrer" className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl hover:border-emerald-500 transition-colors text-center group">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Hire on Fiverr Pro</div>
              <div className="text-xs font-bold text-emerald-400">Top-Rated Freelancer</div>
            </a>
          </div>

          {/* Direct Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${EMAIL_MAIN}`}
              className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-red-900/40 text-lg"
            >
              Send an Inquiry
            </a>
            <a
              href={N8N_CREATOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 transition-all text-lg"
            >
              Explore n8n Workflows
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
