import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import signxLogo from '../assets/signx_logo.png';

interface SignXHeaderProps {
  onOpenMenu: () => void;
  showProfile?: boolean;
}

export default function SignXHeader({ onOpenMenu, showProfile = true }: SignXHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-cream-100/90 backdrop-blur-md border-b border-cream-300/80 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Hamburger menu toggle */}
        <button
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className="w-10 h-10 rounded-2xl bg-white border border-cream-300/80 flex items-center justify-center text-charcoal-700 hover:text-coral-500 hover:border-coral-300 transition-all shadow-sm active:scale-95"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center: SignX Official Logo Image & Wordmark */}
        <Link to="/translator" className="flex items-center gap-2.5 group">
          <img 
            src={signxLogo} 
            alt="SignX Official Logo" 
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="flex items-center">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-charcoal-900 font-display">
              Sign
            </span>
            <span className="text-2xl sm:text-3xl font-black font-display bg-gradient-to-br from-coral-500 via-coral-600 to-forest-700 bg-clip-text text-transparent">
              X
            </span>
          </div>
        </Link>

        {/* Right: Notification Bell & Profile Avatar */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-2xl bg-white border border-cream-300/80 flex items-center justify-center text-charcoal-700 hover:text-coral-500 hover:border-coral-300 transition-all shadow-sm active:scale-95"
            onClick={() => alert("SignX Notifications: Running SignX v1.0.0 (Real Indian Sign Language Platform).")}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-coral-500 ring-2 ring-white" />
          </button>

          {showProfile && (
            <Link
              to="/settings"
              aria-label="Profile and Settings"
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-coral-200 to-forest-100 border border-cream-300 flex items-center justify-center overflow-hidden shadow-sm hover:ring-2 hover:ring-coral-400 transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                alt="User Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-xs font-bold text-forest-700">SX</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
