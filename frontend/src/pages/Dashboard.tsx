import React from 'react';
import { Camera, Volume2, Mic, Bot, BookOpen, Clock, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Translations', value: '0' },
  { label: 'Sessions', value: '0' },
  { label: 'Signs Learned', value: '0' },
  { label: 'Streak', value: '0 days' },
];

const quickActions = [
  { title: 'Sign Translator', icon: Camera, path: '/translator', gradient: 'from-brand-500 to-indigo-600', description: 'Real-time ISL recognition' },
  { title: 'Text to Speech', icon: Volume2, path: '/tts', gradient: 'from-purple-500 to-accent-600', description: 'Convert text to spoken words' },
  { title: 'Speech to Text', icon: Mic, path: '/stt', gradient: 'from-blue-500 to-cyan-600', description: 'Convert speech to text' },
  { title: 'AI Assistant', icon: Bot, path: '/chatbot', gradient: 'from-pink-500 to-rose-600', description: 'Ask questions about ISL' },
  { title: 'Learn ISL', icon: BookOpen, path: '/learn', gradient: 'from-green-500 to-emerald-600', description: 'Interactive learning modules' },
  { title: 'History', icon: Clock, path: '/history', gradient: 'from-orange-500 to-amber-600', description: 'View your past translations' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-900 text-white p-6 md:p-8 pt-24 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="flex items-center gap-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold">
            Welcome back, <span className="text-gradient">User</span> <span className="inline-block animate-pulse origin-bottom-right">👋</span>
          </h1>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card glass-card p-6 rounded-2xl flex flex-col items-center justify-center border border-white/10 bg-white/5 backdrop-blur-xl">
              <span className="stat-value text-3xl font-bold text-white mb-2">{stat.value}</span>
              <span className="stat-label text-sm text-gray-400 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2"><Activity className="w-6 h-6 text-brand-400" /> Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, i) => (
              <Link to={action.path} key={i} className="glass-card bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300 block group">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
          <div className="glass-card bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl text-center flex flex-col items-center justify-center min-h-[200px]">
            <Clock className="w-12 h-12 text-gray-500 mb-4 opacity-50" />
            <p className="text-gray-400">No recent activity yet. Start translating to see your history here.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
