import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Sliders, Shield, Moon, Eye, Sparkles } from 'lucide-react';

export default function Settings() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { theme, toggleTheme, confidenceThreshold, setConfidenceThreshold } = context;

  return (
    <div className="min-h-screen bg-surface-900 text-white font-sans pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb orb-1 opacity-20"></div>
        <div className="orb orb-2 opacity-15"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" /> Platform Configuration
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">
            System <span className="text-gradient">Settings</span>
          </h1>
          <p className="text-sm md:text-base text-white/50 mt-1">
            Calibrate computer vision detection thresholds and optical telemetry preferences.
          </p>
        </div>

        <div className="glass-card rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl p-6 md:p-8 space-y-8 shadow-2xl">
          
          {/* AI Confidence Calibration */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-white">AI Confidence Filter</h3>
                <p className="text-xs text-white/50">Minimum certainty threshold required to trigger sign acceptance</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white/60">THRESHOLD VALUE:</span>
                <span className="text-cyan-300 font-bold text-sm">{Math.round(confidenceThreshold * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[11px] text-white/40">
                Higher sensitivity reduces false positives; lower sensitivity makes signing faster in varied lighting conditions.
              </p>
            </div>
          </div>

          {/* Privacy Protocol */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-white">Zero-Storage Optical Pipeline</h3>
                <p className="text-xs text-white/50">Local edge MediaPipe compute policy</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-200">
              <span>All video frames processed ephemerally on device GPU/WASM context</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                ENFORCED
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
