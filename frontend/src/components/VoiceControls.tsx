import React from 'react';
import { Play, Square, Settings2 } from 'lucide-react';

interface VoiceControlsProps {
  onPlay: () => void;
  onStop: () => void;
  isSpeaking: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({ 
  onPlay, 
  onStop, 
  isSpeaking, 
  speed, 
  onSpeedChange 
}) => {
  return (
    <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
      <button
        onClick={isSpeaking ? onStop : onPlay}
        className={`p-3 rounded-full ${isSpeaking ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-brand-100 text-brand-600 hover:bg-brand-200'}`}
      >
        {isSpeaking ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
      </button>
      
      <div className="flex-1 flex items-center space-x-3">
        <Settings2 size={16} className="text-gray-400" />
        <span className="text-xs text-gray-500 font-medium">Speed</span>
        <input 
          type="range" 
          min="0.5" 
          max="2" 
          step="0.1" 
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
        />
        <span className="text-xs font-mono w-8 text-right">{speed.toFixed(1)}x</span>
      </div>
    </div>
  );
};

export default VoiceControls;
