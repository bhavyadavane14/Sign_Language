import React from 'react';
import { ChevronLeft, Mail, Star, Heart, ExternalLink, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import signxLogo from '../assets/signx_logo.png';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-charcoal-900 font-sans flex flex-col justify-between select-none">
      
      {/* Top Header matching Screen 10: Back Arrow + "About SignX" */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-cream-300 px-4 py-3 sm:px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/translator')}
              aria-label="Back to home"
              className="w-10 h-10 rounded-2xl bg-white border border-cream-300 flex items-center justify-center text-charcoal-700 hover:text-coral-500 transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-extrabold text-charcoal-900 font-display">
              About SignX
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content matching Screen 10 */}
      <main className="flex-1 w-full max-w-md mx-auto px-6 py-6 flex flex-col items-center text-center space-y-6">
        
        {/* Emblem & Branding matching Screen 10 */}
        <div className="flex flex-col items-center space-y-3 pt-2">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-white border border-cream-300 p-3 shadow-card flex items-center justify-center hover:scale-105 transition-transform">
            <img 
              src={signxLogo} 
              alt="SignX Official Logo" 
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <div className="flex items-center justify-center">
              <span className="text-3xl font-extrabold text-charcoal-900 font-display">Sign</span>
              <span className="text-4xl font-black bg-gradient-to-br from-coral-500 to-forest-700 bg-clip-text text-transparent font-display">
                X
              </span>
            </div>
            <p className="text-xs font-mono text-charcoal-500 font-semibold mt-0.5">
              Version 1.0.0
            </p>
          </div>
        </div>

        {/* Mission Statement matching Screen 10 */}
        <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed max-w-xs">
          Empowering communication through AI-powered sign language translation. Let's build a more inclusive world together.
        </p>

        {/* Card matching Screen 10: "♥ Different Hands Same World" */}
        <div className="w-full p-4 rounded-3xl bg-cream-50 border border-coral-200/80 shadow-sm flex items-center justify-center gap-2.5">
          <Heart className="w-5 h-5 text-coral-500 fill-coral-500" />
          <span className="text-sm font-bold text-charcoal-800 font-display">
            Different Hands Same World
          </span>
        </div>

        {/* Action Links matching Screen 10: [Contact Us] [Rate the App] */}
        <div className="w-full space-y-2.5 pt-2">
          
          <button
            onClick={() => alert("Contact SignX Team: support@signx.in | New Delhi, India")}
            className="w-full p-3.5 bg-white rounded-2xl border border-cream-300 text-charcoal-800 font-semibold text-xs flex items-center gap-3 hover:border-coral-300 transition-all shadow-sm active:scale-[0.99]"
          >
            <Mail className="w-4 h-4 text-coral-500" />
            <span>Contact Us</span>
          </button>

          <button
            onClick={() => alert("Thank you for your 5-star support for Indian Sign Language accessibility!")}
            className="w-full p-3.5 bg-white rounded-2xl border border-cream-300 text-charcoal-800 font-semibold text-xs flex items-center gap-3 hover:border-coral-300 transition-all shadow-sm active:scale-[0.99]"
          >
            <Star className="w-4 h-4 text-amber-500" />
            <span>Rate the App</span>
          </button>

        </div>

      </main>

      {/* Footer Banner */}
      <footer className="py-4 text-center border-t border-cream-200 text-xs text-charcoal-500 font-medium">
        <span className="font-hand text-coral-600 text-base font-bold">Inclusion Looks Good on Everyone ♥</span>
      </footer>

    </div>
  );
}
