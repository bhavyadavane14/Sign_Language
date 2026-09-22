import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User as UserIcon, Mail, Globe, Shield, Sparkles, Award } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

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
              <Sparkles className="w-3.5 h-3.5 text-accent-400" /> Account Identity
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">
            User <span className="text-gradient">Profile</span>
          </h1>
          <p className="text-sm md:text-base text-white/50 mt-1">
            Manage your registered communicator credentials and preferred Indian language dialects.
          </p>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl space-y-6 shadow-2xl">
          
          <div className="flex items-center gap-5 pb-6 border-b border-white/10">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center font-display font-bold text-3xl text-white shadow-glow">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white">
                {user?.name || 'Authorized Member'}
              </h2>
              <p className="text-sm text-cyan-400 font-mono mt-0.5">{user?.email || 'user@signx.ai'}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ACTIVE COMMUNICATOR
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                <Mail className="w-3.5 h-3.5 text-brand-400" /> EMAIL ADDRESS
              </div>
              <p className="text-sm font-semibold text-white">{user?.email || 'user@signx.ai'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> PREFERRED DIALECT
              </div>
              <p className="text-sm font-semibold text-white">{user?.preferredLanguage || 'English (India)'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                <Shield className="w-3.5 h-3.5 text-accent-400" /> SESSION SECURITY
              </div>
              <p className="text-sm font-semibold text-white">Encrypted JWT Bearer Token</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                <Award className="w-3.5 h-3.5 text-amber-400" /> PLATFORM ROLE
              </div>
              <p className="text-sm font-semibold text-white">ISL Real-Time Translator</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
