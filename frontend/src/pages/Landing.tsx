import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Brain, Type, Volume2, Mic, Bot, BookOpen, Shield, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Landing() {
  return (
    <div className="bg-surface-900 min-h-screen text-white font-sans overflow-x-hidden relative">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="orb orb-1 absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/20 rounded-full blur-[120px]"></div>
        <div className="orb orb-2 absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-500/20 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        {/* Simple dot grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Simple Landing Navbar */}
        <header className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={logo} alt="SIGNX" className="h-10 w-auto" />
              <span className="font-display font-bold text-2xl tracking-tight">SIGN<span className="text-gradient">X</span></span>
            </div>
            <Link to="/login" className="btn-ghost px-6 py-2">Log In</Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-10 pb-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="inline-block glass-card rounded-full px-4 py-1.5 mb-4 border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="text-sm font-medium text-white/80 flex items-center gap-2">
                <span className="glow-dot w-2 h-2 rounded-full bg-accent-400"></span>
                Next-Gen Communication Platform
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display tracking-tight leading-tight">
              SIGN<span className="text-gradient">X</span>
              <br className="hidden sm:block" />
              <span className="block mt-2 text-3xl sm:text-4xl md:text-5xl text-white/90">AI-Powered Indian Sign Language Translator</span>
            </h1>
            
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white/70">
              Breaking communication barriers with real-time ISL recognition powered by deep learning. Experience seamless translation between sign language, text, and speech.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/translator" className="btn-primary w-full sm:w-auto px-8 py-4 text-lg flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25">
                Start Translating <ArrowRight size={20} />
              </Link>
              <Link to="/learn" className="btn-secondary w-full sm:w-auto px-8 py-4 text-lg">
                Explore ISL
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-24">
        <div className="glass border-white/10 rounded-2xl p-6 md:p-8 flex flex-wrap justify-center gap-8 md:gap-16 items-center divide-x-0 md:divide-x divide-white/10">
          <div className="text-center px-4">
            <div className="stat-value text-3xl font-bold text-gradient mb-1">36+</div>
            <div className="stat-label text-sm text-white/60 uppercase tracking-wider">ISL Signs</div>
          </div>
          <div className="text-center px-4">
            <div className="stat-value text-3xl font-bold text-gradient mb-1">Real-Time</div>
            <div className="stat-label text-sm text-white/60 uppercase tracking-wider">Detection</div>
          </div>
          <div className="text-center px-4">
            <div className="stat-value text-3xl font-bold text-gradient mb-1">10</div>
            <div className="stat-label text-sm text-white/60 uppercase tracking-wider">Languages</div>
          </div>
          <div className="text-center px-4">
            <div className="stat-value text-3xl font-bold text-gradient mb-1">AI</div>
            <div className="stat-label text-sm text-white/60 uppercase tracking-wider">Powered</div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">How It Works</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Our advanced AI pipeline translates your signs in milliseconds.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-brand-500/20 via-accent-500/50 to-brand-500/20 -translate-y-1/2 z-0"></div>
            
            {[
              { step: 1, title: 'Show Sign', icon: Camera, desc: 'Position hands in view' },
              { step: 2, title: 'AI Detects', icon: Brain, desc: 'LSTM processes motion' },
              { step: 3, title: 'Text Generated', icon: Type, desc: 'Mapped to language' },
              { step: 4, title: 'Speech Output', icon: Volume2, desc: 'Audible translation' }
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center font-bold text-lg mb-4 shadow-lg shadow-brand-500/30 border border-white/20">
                  {item.step}
                </div>
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-brand-300">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Powerful Features</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Everything you need for seamless communication.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Real-Time Translation', icon: Camera, desc: 'High-FPS sign detection using optimized MediaPipe and custom LSTM models.' },
              { title: 'Text to Speech', icon: Volume2, desc: 'Instantly convert translated text into natural-sounding localized speech.' },
              { title: 'Speech to Text', icon: Mic, desc: 'Two-way communication letting others speak and converting it to readable text.' },
              { title: 'AI Assistant', icon: Bot, desc: 'Ask questions, get help, and learn more about ISL through our smart chatbot.' },
              { title: 'Learn ISL', icon: BookOpen, desc: 'Interactive tutorials and practice sessions to improve your signing skills.' },
              { title: 'Privacy First', icon: Shield, desc: 'All processing happens securely. Your camera feed is never recorded or stored.' }
            ].map((feature, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl group hover:border-brand-500/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-brand-400" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center glass-strong rounded-3xl p-12 md:p-16 border-t border-l border-white/20">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">Ready to break the silence?</h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">Join SIGNX today and experience the future of inclusive communication.</p>
          <Link to="/register" className="btn-primary inline-flex px-10 py-4 text-lg">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="SIGNX" className="h-6 w-auto opacity-50 grayscale" />
            <span className="font-display font-bold text-lg text-white/50 tracking-tight">SIGNX</span>
          </div>
          <div className="text-white/40 text-sm text-center">
            &copy; {new Date().getFullYear()} SIGNX Platform. All rights reserved.
          </div>
          <div className="flex gap-4">
             <Link to="/about" className="text-white/40 hover:text-white/80 text-sm">About</Link>
             <Link to="/model-info" className="text-white/40 hover:text-white/80 text-sm">Model Info</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
