import React, { useState } from 'react';
import { Search, BookOpen, ExternalLink, Sparkles, Video, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { islResources, islCategories } from '../data/islResources';

export default function ISLLearning() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredResources = islResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-surface-900 text-white font-sans pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb orb-1 opacity-20"></div>
        <div className="orb orb-2 opacity-15"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" /> ISLRTC Knowledge Hub
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">
              Learn <span className="text-gradient">Indian Sign Language</span>
            </h1>
            <p className="text-sm md:text-base text-white/50 mt-2 max-w-2xl">
              Curated masterclasses, official ISLRTC dictionaries, and vocabulary guides for deaf & hearing communication.
            </p>
          </div>

          <Link
            to="/translator"
            className="btn-primary flex items-center gap-2 px-6 py-3.5 rounded-2xl shadow-glow text-sm font-semibold shrink-0"
          >
            <Video className="w-4 h-4" /> Practice in Real-Time Studio <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Search & Categories Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
            <input
              type="text"
              placeholder="Search ISL signs, words, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-glass pl-11 pr-4 py-3 rounded-2xl text-sm"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-glow'
                  : 'glass border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              All Topics
            </button>
            {islCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-glow'
                    : 'glass border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="glass-card p-6 rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl hover:border-brand-500/40 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {res.category}
                  </span>
                  <BookOpen className="w-5 h-5 text-white/30 group-hover:text-accent-400 transition-colors" />
                </div>

                <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-gradient transition-all">
                  {res.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed mb-6">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/40 font-mono">OFFICIAL RESOURCE</span>
                <a
                  href={res.url || 'https://islrtc.nic.in/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
                >
                  View Details <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
