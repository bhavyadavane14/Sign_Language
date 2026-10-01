import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, BookOpen, Bot, History, User, Settings, LogOut, Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth(); // Assuming useAuth provides these

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Translator', path: '/translator', icon: Camera },
    { name: 'Learn ISL', path: '/learn', icon: BookOpen },
    { name: 'AI Assistant', path: '/chatbot', icon: Bot },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-900/80 backdrop-blur-xl border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <img className="h-8 w-auto" src={logo} alt="SIGNX Logo" />
              <span className="font-display font-bold text-xl tracking-tight text-white">SIGN<span className="text-gradient">X</span></span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`nav-link px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                      location.pathname === link.path ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <link.icon size={16} />
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center gap-4 relative group cursor-pointer">
                  <div className="flex items-center gap-2">
                     <span className="text-sm font-medium text-white/90">{user.name || 'User'}</span>
                     <div className="h-8 w-8 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                       {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                     </div>
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl glass-card py-1 hidden group-hover:block transition-all opacity-0 group-hover:opacity-100">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors">
                      <User size={16} /> Profile
                    </Link>
                    <Link to="/history" className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors">
                      <History size={16} /> History
                    </Link>
                    <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors">
                      <Settings size={16} /> Settings
                    </Link>
                    <div className="border-t border-white/10 my-1"></div>
                    <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="btn-primary px-4 py-2 text-sm">Sign In</Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass-card mx-2 mt-2 rounded-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${
                  location.pathname === link.path ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                 <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/5" onClick={() => setIsOpen(false)}>
                   <User size={18} /> Profile
                 </Link>
                 <Link to="/history" className="block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/5" onClick={() => setIsOpen(false)}>
                   <History size={18} /> History
                 </Link>
                 <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/5" onClick={() => setIsOpen(false)}>
                   <Settings size={18} /> Settings
                 </Link>
                 <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-400/10">
                   <LogOut size={18} /> Logout
                 </button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-center bg-gradient-to-r from-brand-500 to-accent-500 text-white mt-4" onClick={() => setIsOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
