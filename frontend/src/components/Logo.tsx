import React from 'react';
import logo from '../assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

const textSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-4xl',
};

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={logo} alt="SIGNX" className={`${sizes[size]} object-contain`} />
      {showText && (
        <span className={`font-display font-bold ${textSizes[size]}`}>
          <span className="text-white">SIGN</span>
          <span className="text-gradient">X</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
