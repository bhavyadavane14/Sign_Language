import React, { useState } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import signxLogo from '../assets/signx_logo.png';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSkip?: () => void;
}

export default function WelcomeScreen({ onGetStarted, onSkip }: WelcomeScreenProps) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Welcome to SignX",
      description: "Real-time sign language translation for a more connected world.",
      badge: "Bridge Communication",
    },
    {
      title: "Real Indian Sign Language",
      description: "Rooted in authentic ISLRTC and INCLUDE datasets with zero invented signs or fabricated accuracies.",
      badge: "Verified ISL Standards",
    },
    {
      title: "SignX Assistant at Hand",
      description: "Ask questions, practice gestures, and explore deaf accessibility with the integrated Google Gemini assistant.",
      badge: "Empowered Learning",
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F2] flex flex-col justify-between items-center px-4 sm:px-8 py-8 sm:py-12 select-none overflow-hidden">
      
      {/* Decorative Warm Waves at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-64 sm:h-80 pointer-events-none opacity-70">
        <svg 
          viewBox="0 0 1200 300" 
          preserveAspectRatio="none" 
          className="w-full h-full"
        >
          <path 
            d="M0,190 C380,290 820,90 1200,220 L1200,300 L0,300 Z" 
            fill="#FEECE5" 
          />
          <path 
            d="M0,230 C450,130 750,270 1200,170 L1200,300 L0,300 Z" 
            fill="#EAF4EE" 
            opacity="0.8" 
          />
        </svg>
      </div>

      {/* Top Web Header: Official Brand Logo on left, Skip on right */}
      <header className="w-full max-w-5xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <img 
            src={signxLogo} 
            alt="SignX Logo" 
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-xl shadow-sm"
          />
          <span className="text-xl sm:text-2xl font-extrabold text-charcoal-900 font-display">
            Sign<span className="text-coral-500">X</span>
          </span>
        </div>

        {onSkip && (
          <button 
            onClick={onSkip}
            className="text-xs sm:text-sm font-bold text-charcoal-600 hover:text-coral-600 bg-white border border-cream-300 px-4 py-1.5 rounded-full transition-all shadow-sm hover:border-coral-300"
          >
            Skip to Login
          </button>
        )}
      </header>

      {/* Main Content Area matching Screen 2 */}
      <div className="w-full max-w-lg flex flex-col items-center text-center my-auto z-10 space-y-6 sm:space-y-7 px-4">
        
        {/* Step Badge */}
        <span className="px-3.5 py-1 rounded-full text-xs font-bold text-forest-700 bg-forest-100 border border-forest-200 shadow-sm flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-coral-500" />
          {steps[activeStep].badge}
        </span>

        {/* Header Text */}
        <div className="space-y-2.5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-charcoal-900 tracking-tight font-display">
            {steps[activeStep].title}
          </h1>
          <p className="text-sm sm:text-base text-charcoal-600 max-w-md mx-auto leading-relaxed">
            {steps[activeStep].description}
          </p>
        </div>

        {/* Central Official Logo Emblem Card matching Screen 2 */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-white border border-cream-300 p-6 shadow-card flex items-center justify-center overflow-hidden hover:shadow-card-hover transition-shadow">
          <img 
            src={signxLogo} 
            alt="SignX Official Logo - Connecting Hands" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* 3-Dot Pagination Indicator matching Screen 2 */}
        <div className="flex items-center gap-2 pt-1">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all rounded-full ${
                activeStep === i 
                  ? 'w-8 h-2.5 bg-coral-500' 
                  : 'w-2.5 h-2.5 bg-cream-300 hover:bg-cream-400'
              }`}
            />
          ))}
        </div>

        {/* Action Button: Get Started -> */}
        <button
          onClick={onGetStarted}
          className="w-full max-w-sm py-4 px-8 rounded-2xl bg-gradient-to-r from-coral-500 via-coral-600 to-forest-700 text-white font-bold text-base shadow-btn flex items-center justify-center gap-2 hover:opacity-95 transition-all active:scale-[0.98]"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>

      {/* Bottom Text matching Screen 2 */}
      <footer className="z-10 text-center">
        <p className="text-xs sm:text-sm text-charcoal-700 font-semibold font-hand text-base">
          Different Hands, Same World ♥
        </p>
      </footer>

    </div>
  );
}
