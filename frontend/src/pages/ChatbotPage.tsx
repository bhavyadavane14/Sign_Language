import React from 'react';
import Chatbot from '../components/Chatbot';
import { Sparkles, Bot, Shield, BookOpen } from 'lucide-react';

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-surface-900 text-white font-sans pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb orb-1 opacity-20"></div>
        <div className="orb orb-2 opacity-15"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" /> Multi-Turn Conversational Agent
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">
            SIGNX AI <span className="text-gradient">Copilot</span>
          </h1>
          <p className="text-sm md:text-base text-white/50 mt-1">
            Real-time Indian Sign Language tutor, gesture explanation engine, and accessibility assistant.
          </p>
        </div>

        <Chatbot />
      </div>
    </div>
  );
}
