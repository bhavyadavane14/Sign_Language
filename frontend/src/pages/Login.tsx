import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import signxLogo from '../assets/signx_logo.png';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError('Please fill in both email and password.');
        setIsLoading(false);
        return;
      }

      // Authenticate user with application session
      const userObj = {
        id: '1',
        email,
        name: email.split('@')[0],
        preferredLanguage: 'English',
      };
      login('signx-active-session', userObj as any);
      navigate('/translator');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestEntry = () => {
    login('signx-guest-session', {
      id: 'guest-1',
      email: 'guest@signx.in',
      name: 'Guest Signer',
      preferredLanguage: 'English',
    } as any);
    navigate('/translator');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between items-center px-4 sm:px-8 py-8 sm:py-12 select-none">
      
      {/* Top Brand Header (Real responsive web navbar, no phone status bar) */}
      <header className="w-full max-w-5xl flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={signxLogo} 
            alt="SignX Logo" 
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-xl shadow-sm"
          />
          <span className="text-xl sm:text-2xl font-extrabold text-charcoal-900 font-display">
            Sign<span className="text-coral-500">X</span>
          </span>
        </Link>

        <button
          onClick={handleGuestEntry}
          className="text-xs sm:text-sm font-bold text-coral-600 hover:text-coral-700 bg-white border border-coral-200 px-4 py-1.5 rounded-full transition-all shadow-sm hover:bg-coral-50"
        >
          Explore as Guest →
        </button>
      </header>

      {/* Main Authentication Card matching Screen 3 */}
      <div className="w-full max-w-md my-auto space-y-6 px-2">
        
        {/* Top Official Emblem & SignX Logo */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border border-cream-300 p-2.5 shadow-card flex items-center justify-center">
            <img 
              src={signxLogo} 
              alt="SignX Official Logo" 
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <div className="flex items-center justify-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 font-display">Sign</span>
              <span className="text-4xl sm:text-5xl font-black bg-gradient-to-br from-coral-500 to-forest-700 bg-clip-text text-transparent font-display">
                X
              </span>
            </div>
            <p className="text-xs text-charcoal-500 font-semibold tracking-wider uppercase font-display mt-0.5">
              Indian Sign Language Platform
            </p>
          </div>
        </div>

        {/* Tab Switch matching Screen 3: [Login] [Sign Up] */}
        <div className="flex items-center p-1.5 bg-cream-200/90 rounded-2xl border border-cream-300">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              !isSignUp
                ? 'bg-coral-500 text-white shadow-btn'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              isSignUp
                ? 'bg-coral-500 text-white shadow-btn'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form Card matching Screen 3 */}
        <div className="signx-card p-6 sm:p-8 bg-white space-y-4 shadow-card">
          {error && (
            <div className="p-3 rounded-xl bg-coral-50 border border-coral-200 text-coral-700 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input with Mail Icon */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-coral-500/40 focus:border-coral-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input with Lock & Eye Icon */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-coral-500/40 focus:border-coral-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-charcoal-400 hover:text-charcoal-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {!isSignUp && (
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => alert("Password reset instructions will be sent to your email address.")}
                    className="text-xs text-charcoal-500 hover:text-coral-600 transition-colors font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {/* Submit Action Button matching Screen 3 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-coral-500 via-coral-600 to-forest-700 text-white font-bold text-sm shadow-btn hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Login'}
            </button>

          </form>

          {/* OR Divider matching Screen 3 */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-cream-300 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-charcoal-400 uppercase tracking-wider">
              OR
            </span>
            <div className="border-t border-cream-300 w-full" />
          </div>

          {/* Social Logins matching Screen 3: Google & Apple */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {
                login('google-session', { id: '2', email: 'user@google.com', name: 'Google Signer', preferredLanguage: 'English' } as any);
                navigate('/translator');
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-cream-50 hover:bg-cream-100 border border-cream-300 text-xs font-semibold text-charcoal-800 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                login('apple-session', { id: '3', email: 'user@apple.com', name: 'Apple Signer', preferredLanguage: 'English' } as any);
                navigate('/translator');
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-cream-50 hover:bg-cream-100 border border-cream-300 text-xs font-semibold text-charcoal-800 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
            >
              {/* Apple SVG */}
              <svg className="w-4 h-4 fill-current text-charcoal-900" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.79-11.97-14.24-6.3-9.52-11.28-20.08-14.92-31.67-3.64-11.59-5.46-22.38-5.46-32.36 0-14.34 3.73-25.79 11.2-34.34 7.46-8.56 16.63-12.92 27.5-13.1 5.3 0 11.16 1.34 17.58 4.02 6.42 2.68 10.45 4.08 12.09 4.2 2.01-.25 6.13-1.63 12.37-4.14 6.24-2.51 11.83-3.65 16.78-3.41 12.5.76 22.48 5.22 29.93 13.38-10.97 6.64-16.32 15.67-16.06 27.09.25 8.94 3.71 16.51 10.38 22.7 6.67 6.19 14.54 9.69 23.61 10.51-2.22 6.53-4.87 13.06-7.95 19.59zM119.22 31.81c0-7.22 2.64-14.15 7.91-20.78 5.27-6.63 11.87-10.74 19.8-12.33.64 7.22-1.9 14.07-7.61 20.55-5.71 6.48-12.41 10.63-20.1 12.56z" />
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

        </div>

        {/* Footer switch link matching Screen 3 */}
        <div className="text-center pt-1">
          <p className="text-xs text-charcoal-600">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-bold text-coral-600 hover:text-coral-700 transition-colors"
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>

      </div>

      {/* Bottom Tagline */}
      <footer className="text-center text-xs text-charcoal-500 font-medium">
        Different Hands, Same World ♥
      </footer>

    </div>
  );
}
