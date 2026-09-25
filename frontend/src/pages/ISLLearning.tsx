import React, { useState } from 'react';
import { 
  ChevronLeft, Search, Play, BookOpen, ExternalLink, 
  Sparkles, CheckCircle2, X 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  VERIFIED_ISL_SIGNS, 
  VERIFIED_ISL_CATEGORIES, 
  VerifiedISLSign 
} from '../data/verifiedISLData';
import SignXAssistantDrawer from '../components/SignXAssistantDrawer';

export default function ISLLearning() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSignModal, setActiveSignModal] = useState<VerifiedISLSign | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const filteredSigns = VERIFIED_ISL_SIGNS.filter((sign) => {
    const matchesSearch = sign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sign.kinematicDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-charcoal-900 font-sans flex flex-col justify-between">
      
      {/* Top Header matching Screen 7: Back Arrow + "Learn Sign Language" */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-cream-300 px-4 py-3 sm:px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/translator')}
              aria-label="Back to home"
              className="w-10 h-10 rounded-2xl bg-white border border-cream-300 flex items-center justify-center text-charcoal-700 hover:text-coral-500 transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-extrabold text-charcoal-900 font-display">
              Learn Sign Language
            </h1>
          </div>

          <span className="text-[11px] font-bold text-forest-700 bg-forest-100 px-2.5 py-1 rounded-full border border-forest-200">
            ISLRTC
          </span>
        </div>
      </header>

      {/* Main Content matching Screen 7 */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 space-y-4">
        
        {/* Search Bar matching Screen 7: "Search signs..." */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search signs..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-cream-300 rounded-2xl text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-coral-500/40 focus:border-coral-500 shadow-sm transition-all"
          />
        </div>

        {/* Filter Categories Chips matching Screen 7 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {VERIFIED_ISL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-coral-500 text-white shadow-btn'
                  : 'bg-white border border-cream-300 text-charcoal-600 hover:border-coral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sign Cards List matching Screen 7 */}
        <div className="space-y-2.5 pt-1">
          {filteredSigns.length > 0 ? (
            filteredSigns.map((sign) => (
              <div
                key={sign.id}
                onClick={() => setActiveSignModal(sign)}
                className="p-3 bg-white rounded-2xl border border-cream-300/80 shadow-sm hover:border-coral-300 hover:shadow-card flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99]"
              >
                {/* Left Thumbnail: Real sign avatar / icon */}
                <div className="w-12 h-12 rounded-xl bg-cream-100 border border-cream-200 flex items-center justify-center shrink-0 text-coral-600 font-display font-black text-sm">
                  {sign.name.slice(0, 2).toUpperCase()}
                </div>

                {/* Sign Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-charcoal-900 truncate font-display">
                      {sign.name}
                    </h3>
                    {sign.twoHanded && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-forest-50 text-forest-700 font-semibold border border-forest-200 shrink-0">
                        2-Handed
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-charcoal-500 truncate mt-0.5">
                    {sign.officialSource}
                  </p>
                </div>

                {/* Play/View Button matching Screen 7 (Orange Circle ▶) */}
                <button
                  type="button"
                  aria-label={`View sign for ${sign.name}`}
                  className="w-9 h-9 rounded-full bg-coral-500 text-white flex items-center justify-center shadow-sm hover:bg-coral-600 transition-colors shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-cream-300 space-y-2">
              <BookOpen className="w-8 h-8 text-charcoal-400 mx-auto" />
              <p className="text-xs font-semibold text-charcoal-700">No verified signs found matching query</p>
              <p className="text-[11px] text-charcoal-500">SignX only indexes legitimate ISLRTC verified signs.</p>
            </div>
          )}
        </div>

      </main>

      {/* Verified ISL Reference Modal */}
      {activeSignModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-sm"
            onClick={() => setActiveSignModal(null)}
          />

          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 border border-cream-300 space-y-4">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-coral-600 uppercase tracking-wider font-mono">
                  {activeSignModal.category}
                </span>
                <h3 className="text-xl font-extrabold text-charcoal-900 font-display">
                  {activeSignModal.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveSignModal(null)}
                className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-charcoal-600 hover:bg-cream-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Gesture Form Details */}
            <div className="space-y-3 text-xs leading-relaxed text-charcoal-700">
              <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200">
                <span className="font-bold text-charcoal-900 block mb-1">
                  Kinematic Execution:
                </span>
                <p>{activeSignModal.kinematicDescription}</p>
              </div>

              {activeSignModal.regionalNotes && (
                <div className="text-[11px] text-charcoal-500 italic">
                  Note: {activeSignModal.regionalNotes}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] pt-1 text-charcoal-600">
                <span className="font-semibold">Standard:</span>
                <span className="text-forest-700 font-medium">{activeSignModal.officialSource}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2">
              <a
                href={activeSignModal.officialRefUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-forest-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-forest-800 transition-colors"
              >
                <span>ISLRTC Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  setActiveSignModal(null);
                  navigate('/translator');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-coral-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-btn hover:bg-coral-600 transition-colors"
              >
                <span>Practice Sign</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SignX Assistant Drawer */}
      <SignXAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

    </div>
  );
}
