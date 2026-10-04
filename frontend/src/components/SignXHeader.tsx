import React from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import signxLogo from '../assets/signx_logo.png';

interface SignXHeaderProps {
  onOpenMenu: () => void;
}

export default function SignXHeader({ onOpenMenu }: SignXHeaderProps) {
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

        {/* Right side placeholder (No profile icon, No bell icon) */}
        <div className="w-10 h-10 flex items-center justify-end" />
      </div>
    </header>
  );
}
