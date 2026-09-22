import React from 'react';
import ConfidenceBar from './ConfidenceBar';
import { Hand, Sparkles } from 'lucide-react';

interface SignRecognitionCardProps {
  sign: string | null;
  confidence: number | null;
}

const SignRecognitionCard: React.FC<SignRecognitionCardProps> = ({ sign, confidence }) => {
  const isDetected = sign !== null && confidence !== null && confidence >= 0.6;

  return (
    <div className={`glass-card relative overflow-hidden ${isDetected ? 'border-brand-500/30' : ''}`}>
      {isDetected && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500" />
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Detected Sign</h3>
        <div className={`${isDetected ? 'glow-dot' : 'glow-dot-red'}`} />
      </div>

      {isDetected ? (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 border border-brand-500/30 mb-3">
            <span className="text-4xl font-display font-bold text-gradient">{sign}</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-brand-300 mb-4">
            <Sparkles className="w-3 h-3" />
            <span>ISL Sign Recognized</span>
          </div>
          <ConfidenceBar confidence={confidence} />
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-3">
            <Hand className="w-8 h-8 text-white/20" />
          </div>
          <p className="text-sm text-white/30">Position your hand in front of the camera</p>
        </div>
      )}
    </div>
  );
};

export default SignRecognitionCard;
