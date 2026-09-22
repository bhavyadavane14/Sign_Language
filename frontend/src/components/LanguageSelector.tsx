import React from 'react';
import { languages } from '../data/languages';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  selected: string;
  onChange: (code: string) => void;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selected, onChange, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Globe size={16} className="text-gray-400 mr-2" />
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer outline-none"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
