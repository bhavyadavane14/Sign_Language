import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-900 border-t border-white/10 glass-strong bg-white/5 backdrop-blur-xl font-sans relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="SIGNX Logo" className="h-8" />
              <span className="text-xl font-display font-bold text-white tracking-wide">SIGNX</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Breaking communication barriers with advanced real-time Indian Sign Language translation and interactive learning tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/translator" className="hover:text-brand-400 transition-colors">Translator</Link></li>
              <li><Link to="/learn" className="hover:text-brand-400 transition-colors">Learn ISL</Link></li>
              <li><Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Contact Support</a></li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SIGNX. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-red-500 text-sm">❤️</span> for the Deaf community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
