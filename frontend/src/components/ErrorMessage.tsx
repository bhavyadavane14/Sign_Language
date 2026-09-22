import React from 'react';
import { AlertTriangle, XCircle, Info, CheckCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  onDismiss?: () => void;
}

const icons = {
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

const styles = {
  error: 'bg-red-500/10 border-red-500/20 text-red-300',
  warning: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
  info: 'bg-brand-500/10 border-brand-500/20 text-brand-300',
  success: 'bg-green-500/10 border-green-500/20 text-green-300',
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, type = 'error', onDismiss }) => {
  const Icon = icons[type];

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${styles[type]} animate-slide-down`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-white/30 hover:text-white/60 transition-colors">
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
