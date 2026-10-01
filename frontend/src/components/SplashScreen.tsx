import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import signxLogo from '../assets/signx_logo.png';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Pre-load the logo to ensure it renders correctly before animating
  useEffect(() => {
    const img = new Image();
    img.onload = () => setLogoLoaded(true);
    img.onerror = () => setLogoLoaded(true); // Proceed even if there's an error
    img.src = signxLogo;
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F2] flex flex-col justify-between items-center px-4 sm:px-8 py-8 sm:py-12 overflow-hidden select-none">
      
      {/* Decorative Warm Waves at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-64 sm:h-80 pointer-events-none opacity-80">
        <svg 
          viewBox="0 0 1200 300" 
          preserveAspectRatio="none" 
          className="w-full h-full"
        >
          <path 
            d="M0,180 C350,280 850,80 1200,210 L1200,300 L0,300 Z" 
            fill="#FEECE5" 
          />
          <path 
            d="M0,220 C420,120 780,260 1200,160 L1200,300 L0,300 Z" 
            fill="#EAF4EE" 
            opacity="0.85" 
          />
        </svg>
      </div>

      {/* Top Brand Header Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <img 
            src={signxLogo} 
            alt="SignX Logo" 
            className="w-10 h-10 object-contain rounded-xl shadow-sm"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="text-xl sm:text-2xl font-extrabold text-charcoal-900 font-display">
            Sign<span className="text-coral-500">X</span>
          </span>
        </div>
        <span className="text-xs sm:text-sm font-semibold text-charcoal-600 bg-white border border-cream-300 px-3.5 py-1.5 rounded-full shadow-sm">
          Real Indian Sign Language
        </span>
      </header>

      {/* Center Branding & Official Logo Image */}
      <div className="flex flex-col items-center text-center my-auto z-10 space-y-6 max-w-md w-full px-4">
        
        {/* Official SignX Logo Emblem — with fade-in once loaded */}
        <div
          className={`relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-white p-4 shadow-card flex items-center justify-center border border-cream-300 transition-all duration-700 ${
            logoLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
        >
          <img 
            src={signxLogo} 
            alt="SignX Official Logo" 
            className="w-full h-full object-contain"
            onLoad={() => setLogoLoaded(true)}
            onError={(e) => {
              setLogoLoaded(true);
              // Fallback: show text logo if image fails
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* Fallback text logo shown when image fails */}
          {!logoLoaded && (
            <span className="text-4xl font-extrabold text-charcoal-900 font-display">
              Sign<span className="text-coral-500">X</span>
            </span>
          )}
        </div>

        {/* Tagline */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight font-display">
            SignX — More Than Words
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 font-medium tracking-wide">
            Real-time Indian Sign Language Translation Platform
          </p>
        </div>

        {/* Loading Spinner & Continue */}
        <div className="flex flex-col items-center gap-3 pt-2">
          {/* Fixed spinner: use border-[3px] instead of non-standard border-3 */}
          <div
            className="w-10 h-10 rounded-full border-[3px] border-coral-200 border-t-coral-500"
            style={{ animation: 'spin 0.9s linear infinite' }}
          />
          <span className="text-xs text-charcoal-500 font-medium">Initializing SignX Environment...</span>

          <button
            onClick={onFinish}
            className="mt-2 py-2.5 px-6 rounded-full bg-white hover:bg-cream-50 border border-cream-300 text-charcoal-800 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all hover:border-coral-400 active:scale-95"
          >
            <span>Continue to Welcome</span>
            <ArrowRight className="w-4 h-4 text-coral-500" />
          </button>
        </div>

      </div>

      {/* Bottom Tagline */}
      <footer className="z-10 text-center space-y-1">
        <p className="text-xs sm:text-sm text-charcoal-700 font-medium tracking-wide">
          A More Inclusive Tomorrow
        </p>
        <p className="text-xs text-coral-600 font-bold font-hand text-base">
          Bridge • Understand • Include
        </p>
      </footer>

    </div>
  );
}
