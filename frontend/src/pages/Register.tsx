import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    language: 'English'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registering:', formData);
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Floating Orbs Background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="glass-card bg-white/5 backdrop-blur-xl w-full max-w-md p-8 rounded-3xl border border-white/10 relative z-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="SIGNX Logo" className="h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold text-white mb-2">
            Create <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-accent-400 to-brand-300">Account</span>
          </h2>
          <p className="text-gray-400 text-sm">Join the SIGNX community today.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-glass w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-transparent transition-all backdrop-blur-md"
              placeholder="John Doe"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-glass w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-transparent transition-all backdrop-blur-md"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-glass w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-transparent transition-all backdrop-blur-md"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Preferred Language</label>
            <select 
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="input-glass w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-transparent transition-all appearance-none backdrop-blur-md [&>option]:bg-surface-900"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all mt-4"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
