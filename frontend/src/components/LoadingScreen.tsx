import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-brand-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-white/5 border-b-accent-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <p className="mt-6 text-sm text-white/40 animate-pulse">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
