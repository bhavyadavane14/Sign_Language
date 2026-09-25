import React from 'react';
import { 
  X, Home, History, BookOpen, Bookmark, 
  Settings, HelpCircle, Info, LogOut, MessageSquare, Sparkles 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import signxLogo from '../assets/signx_logo.png';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAssistant: () => void;
}

export default function HamburgerMenu({ isOpen, onClose, onOpenAssistant }: HamburgerMenuProps) {
  const location = useLocation();

  if (!isOpen) return null;

  const navLinks = [
    { label: 'Home', icon: Home, path: '/translator' },
    { label: 'History', icon: History, path: '/history' },
    { label: 'Learn Sign Language', icon: BookOpen, path: '/learn' },
    { label: 'Saved Translations', icon: Bookmark, path: '/history' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel matching Screen 6 */}
      <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-cream-100 shadow-2xl flex flex-col justify-between z-10 border-r border-cream-300">
        
        {/* Top Header & Official Logo */}
        <div className="p-6 border-b border-cream-200">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="w-10 h-10 rounded-2xl bg-white border border-cream-300 flex items-center justify-center text-charcoal-700 hover:text-coral-500 hover:border-coral-300 transition-all shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <img 
                src={signxLogo} 
                alt="SignX Logo" 
                className="w-8 h-8 object-contain rounded-lg shadow-sm"
              />
              <div className="flex items-center">
                <span className="text-xl font-extrabold text-charcoal-900 font-display">Sign</span>
                <span className="text-2xl font-black bg-gradient-to-br from-coral-500 to-forest-700 bg-clip-text text-transparent font-display">
                  X
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-charcoal-500 font-semibold mt-3 tracking-wider uppercase font-display">
            Real Indian Sign Language Platform
          </p>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-4 overflow-y-auto space-y-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-coral-600 shadow-sm border border-coral-200 font-bold'
                    : 'text-charcoal-700 hover:bg-white/80 hover:text-charcoal-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-coral-500' : 'text-charcoal-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Help & Support -> Opens SignX Assistant */}
          <button
            onClick={() => {
              onClose();
              onOpenAssistant();
            }}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold text-charcoal-700 hover:bg-white/80 hover:text-charcoal-900 transition-all text-left"
          >
            <HelpCircle className="w-5 h-5 text-charcoal-500" />
            <span>Help & Support</span>
          </button>

          {/* About */}
          <Link
            to="/about"
            onClick={onClose}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
              location.pathname === '/about'
                ? 'bg-white text-coral-600 shadow-sm border border-coral-200 font-bold'
                : 'text-charcoal-700 hover:bg-white/80 hover:text-charcoal-900'
            }`}
          >
            <Info className="w-5 h-5 text-charcoal-500" />
            <span>About</span>
          </Link>
        </div>

        {/* Assistant Promo Card & Logout */}
        <div className="p-4 border-t border-cream-200 space-y-3">
          {/* SignX Assistant Action Card */}
          <div 
            onClick={() => {
              onClose();
              onOpenAssistant();
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-coral-50 to-forest-50 border border-coral-200/80 cursor-pointer hover:border-coral-300 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-coral-500 text-white flex items-center justify-center shadow-sm">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-bold text-charcoal-900">SignX Assistant</h4>
                  <Sparkles className="w-3 h-3 text-coral-500" />
                </div>
                <p className="text-[11px] text-charcoal-500 truncate">Ask questions & practice ISL</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Link
            to="/login"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold text-coral-600 hover:bg-coral-50 transition-all"
          >
            <LogOut className="w-4 h-4 text-coral-500" />
            <span>Logout</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
