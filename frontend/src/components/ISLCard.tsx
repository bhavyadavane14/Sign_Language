import React from 'react';
import { ExternalLink, Book } from 'lucide-react';

interface ISLCardProps {
  title: string;
  description: string;
  category: string;
  source: string;
}

const ISLCard: React.FC<ISLCardProps> = ({ title, description, category, source }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <span className="px-2.5 py-1 text-xs font-semibold bg-brand-100 text-brand-700 rounded-full">
          {category}
        </span>
        <div className="p-2 bg-gray-50 rounded-full group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
          <Book size={18} className="text-gray-400 group-hover:text-brand-600" />
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
      
      <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
        <span className="text-xs text-gray-500">Source: {source}</span>
        <button className="flex items-center text-xs font-medium text-brand-600 hover:text-brand-800">
          View Guide <ExternalLink size={14} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default ISLCard;
