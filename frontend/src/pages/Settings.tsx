import React, { useState } from 'react';
import { 
  ChevronLeft, Globe, Volume2, Type, Sun, 
  Bell, Camera, Shield, MessageSquare, ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  // Functional Settings States
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Bengali'>('English');
  const [textSize, setTextSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [theme, setTheme] = useState<'Light' | 'Cream'>('Light');

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-charcoal-900 font-sans flex flex-col justify-between select-none">
      
      {/* Top Header matching Screen 9: Back Arrow + "Settings" */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-cream-300 px-4 py-3 sm:px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/translator')}
              aria-label="Back to home"
              className="w-10 h-10 rounded-2xl bg-white border border-cream-300 flex items-center justify-center text-charcoal-700 hover:text-coral-500 transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-extrabold text-charcoal-900 font-display">
              Settings
            </h1>
          </div>
        </div>
      </header>

      {/* Main Settings List matching Screen 9 */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 space-y-3">
        
        <div className="signx-card p-2 bg-white divide-y divide-cream-200 shadow-card">
          
          {/* 1. Language matching Screen 9: "English >" */}
          <div 
            onClick={() => {
              const langs: ('English' | 'Hindi' | 'Bengali')[] = ['English', 'Hindi', 'Bengali'];
              const nextIdx = (langs.indexOf(language) + 1) % langs.length;
              setLanguage(langs[nextIdx]);
            }}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-cream-50 transition-colors rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-charcoal-600" />
              <span className="text-sm font-semibold text-charcoal-800">Language</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-600">
              <span>{language}</span>
              <ChevronRight className="w-4 h-4 text-charcoal-400" />
            </div>
          </div>

          {/* 2. Voice Output matching Screen 9: Toggle switch (green) */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-charcoal-600" />
              <span className="text-sm font-semibold text-charcoal-800">Voice Output</span>
            </div>
            <button
              onClick={() => setVoiceOutput(!voiceOutput)}
              aria-label="Toggle voice output"
              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                voiceOutput ? 'bg-forest-600' : 'bg-cream-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  voiceOutput ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 3. Text Size matching Screen 9: "Medium >" */}
          <div 
            onClick={() => {
              const sizes: ('Small' | 'Medium' | 'Large')[] = ['Small', 'Medium', 'Large'];
              const nextIdx = (sizes.indexOf(textSize) + 1) % sizes.length;
              setTextSize(sizes[nextIdx]);
            }}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-cream-50 transition-colors rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-charcoal-600" />
              <span className="text-sm font-semibold text-charcoal-800">Text Size</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-600">
              <span>{textSize}</span>
              <ChevronRight className="w-4 h-4 text-charcoal-400" />
            </div>
          </div>

          {/* 4. Theme matching Screen 9: "Light >" */}
          <div 
            onClick={() => {
              setTheme(theme === 'Light' ? 'Cream' : 'Light');
            }}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-cream-50 transition-colors rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-charcoal-600" />
              <span className="text-sm font-semibold text-charcoal-800">Theme</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-600">
              <span>{theme}</span>
              <ChevronRight className="w-4 h-4 text-charcoal-400" />
            </div>
          </div>

          {/* 5. Notifications matching Screen 9: Toggle switch (green) */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-charcoal-600" />
              <span className="text-sm font-semibold text-charcoal-800">Notifications</span>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              aria-label="Toggle notifications"
              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                notifications ? 'bg-forest-600' : 'bg-cream-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  notifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 6. Camera Settings matching Screen 9 */}
          <div 
            onClick={() => alert("Camera settings: Using primary WebRTC user-facing video stream at 30 FPS.")}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-cream-50 transition-colors rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-charcoal-600" />
              <span className="text-sm font-semibold text-charcoal-800">Camera Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-charcoal-400" />
          </div>

          {/* 7. Privacy & Security matching Screen 9 */}
          <div 
            onClick={() => alert("Privacy & Security: Optical video frames are processed ephemerally on-device with zero server recording.")}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-cream-50 transition-colors rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-charcoal-600" />
              <span className="text-sm font-semibold text-charcoal-800">Privacy & Security</span>
            </div>
            <ChevronRight className="w-4 h-4 text-charcoal-400" />
          </div>

          {/* 8. App Feedback matching Screen 9 */}
          <div 
            onClick={() => alert("Thank you for your feedback! Please reach out to support@signx.in.")}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-cream-50 transition-colors rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-charcoal-600" />
              <span className="text-sm font-semibold text-charcoal-800">App Feedback</span>
            </div>
            <ChevronRight className="w-4 h-4 text-charcoal-400" />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="py-3 text-center border-t border-cream-200 text-[11px] text-charcoal-500 font-medium">
        SignX v1.0.0 • Designed for Accessibility
      </footer>

    </div>
  );
}
