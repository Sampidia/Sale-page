import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { CLIENT_PROJECTS } from '../constants';
import { ClientProjectCategory } from '../types';

type ProjectFilter = 'All' | ClientProjectCategory;

const ProjectsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('All');
  const [selectedProjectModal, setSelectedProjectModal] = useState<typeof CLIENT_PROJECTS[0] | null>(null);

  const filters: ProjectFilter[] = [
    'All',
    'Hotel Booking',
    'Appointment Booking',
    'E-commerce',
    'AI & Web3',
    'Landing Pages'
  ];

  const filteredProjects = activeFilter === 'All'
    ? CLIENT_PROJECTS
    : CLIENT_PROJECTS.filter(p => p.category === activeFilter);

  const getCount = (filter: ProjectFilter) => {
    if (filter === 'All') return CLIENT_PROJECTS.length;
    return CLIENT_PROJECTS.filter(p => p.category === filter).length;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-red-500 selection:text-white">
      <SEO
        title="Client Projects Portfolio | 19 Production Systems Delivered Globally | Afigo Sam"
        description="Explore 19+ commercial web platforms, hotel booking engines, e-commerce storefronts, React Native mobile apps, and n8n AI workflows delivered for global clients in USA, UK, Spain, Slovakia, Colombia, Morocco, Vanuatu, and Nigeria."
        keywords="afigo sam projects, hotel booking websites, appointment booking plugins, custom ecommerce, n8n workflows, solana esusu dapp"
      />

      {/* Hero Header */}
      <section className="relative pt-16 pb-14 border-b border-slate-900 bg-gradient-to-b from-[#0a0912] via-slate-950 to-slate-950 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center text-xs font-semibold text-slate-400">
            <Link to="/" className="hover:text-red-400 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white font-bold">Client Projects</span>
          </nav>

          <div className="max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-red-950/80 text-red-400 border border-red-800/50 px-3 py-1 rounded-full inline-block mb-4">
              Proven Commercial Record
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Featured Client <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">Projects & Systems</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Explore 19 production platforms engineered for international clients across the USA, UK, Spain, Sweden, Croatia, Slovakia, Morocco, Colombia, Vanuatu, and Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs Section */}
      <section className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2">
            {filters.map((filter) => {
              const count = getCount(filter);
              const isActive = activeFilter === filter;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{filter}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#0f0e17] border border-slate-800/80 hover:border-red-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-red-950/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-slate-700/80">
                      {project.category}
                    </div>
                  </div>

                  {/* Content Box */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Client: <strong className="text-slate-200 font-semibold">{project.client}</strong></span>
                      {project.date && <span>{project.date}</span>}
                    </div>

                    <h3 className="text-lg font-extrabold text-white group-hover:text-red-400 transition-colors leading-snug">
                      {project.title}
                    </h3>

                    {project.location && (
                      <p className="text-xs text-red-400 font-semibold">
                        📍 {project.location}
                      </p>
                    )}

                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.tags.map((t) => (
                        <span key={t} className="px-2.5 py-0.5 bg-slate-900/90 text-slate-300 text-[10px] font-semibold rounded-md border border-slate-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  {project.websiteUrl && (
                    <a
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-slate-900 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-all border border-slate-800 hover:border-red-500 flex items-center justify-center space-x-2 text-center"
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
    </div>
  );
};

export default ProjectsPage;
