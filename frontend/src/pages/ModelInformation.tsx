import React from 'react';
import { modelClasses } from '../data/modelClasses';
import { Brain, Cpu, Database, CheckCircle, ShieldAlert, Sparkles, Layers, Activity } from 'lucide-react';

export default function ModelInformation() {
  return (
    <div className="min-h-screen bg-surface-900 text-white font-sans pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb orb-1 opacity-20"></div>
        <div className="orb orb-2 opacity-15"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" /> Deep Learning Architecture
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">
            AI Model <span className="text-gradient">Specifications</span>
          </h1>
          <p className="text-sm md:text-base text-white/50 mt-1 max-w-2xl">
            Detailed neural architecture, landmark pipeline specifications, and honest class boundary disclosures for SIGNX.
          </p>
        </div>

        {/* Technical Specs Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-mono text-white/50 uppercase tracking-widest">ARCHITECTURE</h3>
            <p className="text-2xl font-bold font-display text-white">MediaPipe + CNN</p>
            <p className="text-xs text-white/50">21 3D landmarks (x, y, z) mapped into a 63-dimensional normalized feature vector.</p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-mono text-white/50 uppercase tracking-widest">FRAMEWORK</h3>
            <p className="text-2xl font-bold font-display text-white">TensorFlow / Keras</p>
            <p className="text-xs text-white/50">Exported as .h5 model with high-throughput in-browser fallback heuristic classification.</p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-mono text-white/50 uppercase tracking-widest">SPEED</h3>
            <p className="text-2xl font-bold font-display text-white">30 - 60 FPS</p>
            <p className="text-xs text-white/50">Low-latency client-side edge inference without video uploads to guarantee absolute privacy.</p>
          </div>

        </div>

        {/* 36 Supported Classes Showcase */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/15 bg-white/5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white">
                36 Certified ISL Classes
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                Indian Sign Language Alphabets (A-Z) and Digits (0-9).
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start">
              100% DISCLOSED SCOPE
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block mb-2.5">
                ISL Alphabets (26 Letters)
              </span>
              <div className="flex flex-wrap gap-2">
                {modelClasses.filter(c => isNaN(Number(c))).map(cls => (
                  <div
                    key={cls}
                    className="w-10 h-10 rounded-xl glass border border-white/10 hover:border-brand-400 flex items-center justify-center font-display font-bold text-white text-base hover:scale-105 transition-transform"
                  >
                    {cls}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-mono uppercase tracking-wider text-accent-400 block mb-2.5">
                ISL Digits (10 Numbers)
              </span>
              <div className="flex flex-wrap gap-2">
                {modelClasses.filter(c => !isNaN(Number(c))).map(cls => (
                  <div
                    key={cls}
                    className="w-10 h-10 rounded-xl glass border border-white/10 hover:border-accent-400 flex items-center justify-center font-mono font-bold text-accent-300 text-base hover:scale-105 transition-transform"
                  >
                    {cls}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ethical AI & Academic Transparency Notice */}
        <div className="glass-card p-6 rounded-3xl border border-brand-500/30 bg-brand-500/5 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-brand-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs text-white/70 leading-relaxed">
            <h4 className="text-sm font-bold text-white font-display">Academic Transparency Notice</h4>
            <p>
              SIGNX recognizes the 36 foundational Indian Sign Language letters and numbers shown above. Full continuous natural sign language encompasses thousands of regional lexical gestures, facial expressions, and syntactic torso movements. We do not claim universal recognition of all ISL vernacular, maintaining strict scientific fidelity.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
