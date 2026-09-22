import React from 'react';
import { Heart, Sparkles, Brain, ShieldCheck, Users, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-surface-900 text-white font-sans pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb orb-1 opacity-20"></div>
        <div className="orb orb-2 opacity-15"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" /> Bridging Two Worlds
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight">
            About <span className="text-gradient">SIGNX</span>
          </h1>
          <p className="text-base sm:text-lg text-white/60 leading-relaxed">
            SIGNX is an assistive artificial intelligence platform created to break language and hearing barriers for over 18 million Deaf & Hard-of-Hearing individuals across India.
          </p>
        </div>

        {/* Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/5 space-y-4 hover:border-brand-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white">Our Mission</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Empowering frictionless two-way conversations between Deaf and hearing citizens in everyday life, healthcare, education, and public administrative centers.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/5 space-y-4 hover:border-accent-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-accent-500/20 border border-accent-500/30 flex items-center justify-center text-accent-400">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white">Edge AI Pipeline</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Real-time Google MediaPipe spatial keypoint detection coupled with Convolutional Neural Networks, processing gesture kinematics at 30+ frames per second.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/5 space-y-4 hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white">Privacy First</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Optical feeds never leave the client device without consent. Spatial landmark extraction runs directly in the browser's GPU context for absolute privacy.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/15 bg-gradient-to-r from-brand-900/40 via-surface-900 to-accent-900/40 text-center space-y-6">
          <h2 className="text-3xl font-display font-bold text-white">
            Experience the Future of Inclusive Communication
          </h2>
          <p className="text-sm text-white/60 max-w-xl mx-auto">
            Test the real-time AI Sign Studio directly with your webcam or explore the official Indian Sign Language curriculum.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/translator" className="btn-primary px-8 py-3.5 rounded-2xl text-sm font-semibold flex items-center gap-2">
              Launch Studio <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/learn" className="btn-secondary px-8 py-3.5 rounded-2xl text-sm font-semibold">
              Explore ISL Catalog
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
