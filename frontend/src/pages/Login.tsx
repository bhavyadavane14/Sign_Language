import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import signxLogo from '../assets/signx_logo.png';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  saveUserProfile 
} from '../config/firebase';

interface LoginProps {
  /** When true, the page will open in Sign Up mode by default */
  initialSignUp?: boolean;
}

export default function Login({ initialSignUp = false }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(initialSignUp);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // User-friendly translation of Firebase authentication errors
  const formatAuthError = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/email-already-in-use') {
      return 'This email is already registered. Please switch to Sign In or use a different email.';
    }
    if (code === 'auth/weak-password') {
      return 'Password must be at least 6 characters long.';
    }
    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }
    if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
      return 'Invalid email or password. Please verify your credentials or create a new account.';
    }
    if (code === 'auth/wrong-password') {
      return 'Incorrect password. Please verify and try again.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'Google Sign-In popup was closed before completion. Please try again.';
    }
    if (code === 'auth/unauthorized-domain') {
      return 'Firebase domain not authorized. In Firebase Console → Authentication → Settings → Authorized domains, make sure localhost is listed.';
    }
    if (code === 'auth/operation-not-allowed') {
      return 'Email/Password sign-in is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Network connection error. Please check your internet connection and try again.';
    }
    if (code === 'auth/too-many-requests') {
      return 'Too many failed attempts. Please wait a moment and try again, or reset your password.';
    }
    return err?.message || 'Authentication failed. Please check your credentials and try again.';
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Client-side validation
    if (!cleanEmail || !password) {
      setError('Please provide both email and password.');
      return;
    }

    if (isSignUp) {
      if (!cleanName) {
        setError('Please enter your full name to create an account.');
        return;
      }
      if (cleanName.length < 2) {
        setError('Please enter a valid full name (at least 2 characters).');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // ==========================================
        // REGISTRATION / SIGN UP FLOW
        // ==========================================
        // 1. Create account in Firebase Authentication
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        
        // 2. Non-blocking Firestore user profile sync
        saveUserProfile(cred.user, { name: cleanName }).catch(console.warn);

        // 3. Store in local session
        login('firebase-token-' + cred.user.uid, {
          id: cred.user.uid,
          email: cred.user.email || cleanEmail,
          name: cleanName,
          preferredLanguage: 'English',
        } as any);

        setSuccessMsg('✓ Account created successfully! Redirecting to SignX...');
        setTimeout(() => navigate('/translator'), 600);

      } else {
        // ==========================================
        // LOGIN / SIGN IN FLOW
        // ==========================================
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        
        // Non-blocking profile sync
        saveUserProfile(cred.user).catch(console.warn);

        login('firebase-token-' + cred.user.uid, {
          id: cred.user.uid,
          email: cred.user.email || cleanEmail,
          name: cred.user.displayName || cleanEmail.split('@')[0],
          preferredLanguage: 'English',
        } as any);

        setSuccessMsg('✓ Login successful! Redirecting...');
        setTimeout(() => navigate('/translator'), 400);
      }
    } catch (err: any) {
      setError(formatAuthError(err));
      setIsLoading(false);
    }
  };

  // Google Sign-In with Firebase
  const handleGoogleSignIn = async () => {
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Non-blocking profile sync
      saveUserProfile(result.user).catch(console.warn);

      login('firebase-google-' + result.user.uid, {
        id: result.user.uid,
        email: result.user.email || 'google-user@signx.in',
        name: result.user.displayName || 'Google User',
        preferredLanguage: 'English',
      } as any);

      setSuccessMsg('✓ Google sign-in successful! Redirecting...');
      setTimeout(() => navigate('/translator'), 400);
    } catch (err: any) {
      setError(formatAuthError(err));
      setIsLoading(false);
    }
  };

  const switchMode = (toSignUp: boolean) => {
    setIsSignUp(toSignUp);
    setError('');
    setSuccessMsg('');
    setName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between items-center px-4 sm:px-8 py-8 sm:py-12 select-none">
      
      {/* Top Brand Header */}
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
        {/* Mode indicator badge */}
        <span className="text-xs font-semibold text-charcoal-500 bg-white border border-cream-300 px-3 py-1.5 rounded-full shadow-sm">
          {isSignUp ? '✦ New Account' : '⟶ Sign In'}
        </span>
      </header>

      {/* Main Authentication Card */}
      <main className="w-full max-w-md my-auto z-10">
        <div className="signx-card p-6 sm:p-8 bg-white shadow-card rounded-3xl border border-cream-300">
          
          {/* Sign In / Sign Up tab toggle */}
          <div className="flex rounded-2xl bg-cream-100 border border-cream-200 p-1 mb-6 gap-1">
            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                !isSignUp
                  ? 'bg-white text-coral-600 shadow-sm border border-cream-300'
                  : 'text-charcoal-500 hover:text-charcoal-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isSignUp
                  ? 'bg-white text-coral-600 shadow-sm border border-cream-300'
                  : 'text-charcoal-500 hover:text-charcoal-700'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="text-center space-y-1 mb-5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 font-display">
              {isSignUp ? 'Join SignX Today' : 'Welcome Back'}
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500">
              {isSignUp 
                ? 'Create your account to access ISL recognition and translation history.'
                : 'Sign in to access real-time Indian Sign Language recognition.'}
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4" noValidate>
            
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-700 ml-1">Full Name <span className="text-coral-500">*</span></label>
                <div className="relative">
                  <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                    className="signx-input w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 focus:border-coral-500 focus:ring-2 focus:ring-coral-100 text-sm outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal-700 ml-1">Email Address <span className="text-coral-500">*</span></label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete={isSignUp ? 'email' : 'username'}
                  className="signx-input w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 focus:border-coral-500 focus:ring-2 focus:ring-coral-100 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal-700 ml-1">
                Password <span className="text-coral-500">*</span>
                {isSignUp && <span className="text-charcoal-400 font-normal"> (min 6 characters)</span>}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignUp ? 'Create a password (min 6 chars)' : 'Enter your password'}
                  required
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  className="signx-input w-full pl-10 pr-10 py-2.5 rounded-xl border border-cream-300 focus:border-coral-500 focus:ring-2 focus:ring-coral-100 text-sm outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-bold text-sm shadow-btn transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              <span>
                {isLoading
                  ? (isSignUp ? 'Creating account...' : 'Signing in...')
                  : (isSignUp ? 'Create My Account' : 'Sign In')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cream-300" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-charcoal-400 font-semibold">Or continue with</span></div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-cream-300 hover:border-charcoal-300 bg-white hover:bg-cream-100 text-charcoal-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{isSignUp ? 'Sign up with Google' : 'Sign in with Google'}</span>
          </button>

          {/* Privacy note for signup */}
          {isSignUp && (
            <p className="mt-4 text-center text-[10px] text-charcoal-400 leading-relaxed">
              By creating an account, your data is stored securely in Firebase. We never share your information with third parties.
            </p>
          )}
        </div>
      </main>

      {/* Footer Tagline */}
      <footer className="w-full text-center text-xs text-charcoal-400 font-sans">
        Different Hands, Same World
      </footer>
    </div>
  );
}
