import React from 'react';

interface ConfidenceBarProps {
  confidence: number | null;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ confidence, showLabel = true, size = 'md' }) => {
  const percentage = confidence !== null ? Math.round(confidence * 100) : 0;
  
  const getColor = () => {
    if (percentage >= 80) return 'from-green-500 to-emerald-400';
    if (percentage >= 60) return 'from-yellow-500 to-amber-400';
    if (percentage >= 40) return 'from-orange-500 to-amber-500';
    return 'from-red-500 to-rose-400';
  };

  const getLabel = () => {
    if (percentage >= 80) return 'High';
    if (percentage >= 60) return 'Medium';
    if (percentage >= 40) return 'Low';
    return 'Very Low';
  };

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-white/50">Confidence</span>
          <span className={`text-xs font-bold ${percentage >= 60 ? 'text-green-400' : 'text-amber-400'}`}>
            {confidence !== null ? `${percentage}% • ${getLabel()}` : 'N/A'}
          </span>
        </div>
      )}
      <div className={`w-full ${heights[size]} rounded-full bg-white/10 overflow-hidden`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getColor()} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
