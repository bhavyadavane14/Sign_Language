import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Translator from './pages/Translator';
import ISLLearning from './pages/ISLLearning';
import History from './pages/History';
import Settings from './pages/Settings';
import About from './pages/About';
import ChatbotPage from './pages/ChatbotPage';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import SignXAssistantDrawer from './components/SignXAssistantDrawer';
import { MessageSquare } from 'lucide-react';

function GlobalAssistantWrapper() {
  const location = useLocation();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Hide floating assistant button on splash/welcome/login screens
  const hideFloatingOn = ['/', '/login', '/register', '/splash', '/welcome'];
  const showFloating = !hideFloatingOn.includes(location.pathname);

  return (
    <>
      {showFloating && (
        <div className="fixed bottom-6 right-6 z-30">
          <button
            onClick={() => setIsAssistantOpen(true)}
            aria-label="Open SignX Assistant"
            className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-coral-500 via-coral-600 to-forest-700 text-white shadow-btn hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            </div>
            <span className="font-bold text-xs tracking-wide font-display hidden sm:inline">
              SignX Assistant
            </span>
          </button>
        </div>
      )}

      <SignXAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#FAF7F2] text-charcoal-900 font-sans selection:bg-coral-200 selection:text-coral-900">
            <Routes>
              {/* Primary Entry Flow: Screen 1 & Screen 2 */}
              <Route path="/" element={<Landing />} />
              <Route path="/splash" element={<SplashScreen onFinish={() => window.location.href = '/welcome'} />} />
              <Route path="/welcome" element={<WelcomeScreen onGetStarted={() => window.location.href = '/translator'} onSkip={() => window.location.href = '/translator'} />} />

              {/* Screen 3: Login & Sign Up */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Login />} />

              {/* Screen 4 & Screen 5: Home / Live ISL Detection & Translation Output */}
              <Route path="/translator" element={<Translator />} />
              <Route path="/dashboard" element={<Translator />} />

              {/* Screen 7: Learn Sign Language */}
              <Route path="/learn" element={<ISLLearning />} />

              {/* Screen 8: Translation History */}
              <Route path="/history" element={<History />} />

              {/* Screen 9: Settings */}
              <Route path="/settings" element={<Settings />} />

              {/* Screen 10: About SignX */}
              <Route path="/about" element={<About />} />

              {/* Existing Chatbot Page Route */}
              <Route path="/chatbot" element={<ChatbotPage />} />

              {/* Fallback */}
              <Route path="*" element={<Landing />} />
            </Routes>

            {/* Global Assistant Drawer on all relevant views */}
            <GlobalAssistantWrapper />
          </div>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
