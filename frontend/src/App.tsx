import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Translator from './pages/Translator';
import TextToSpeech from './pages/TextToSpeech';
import SpeechToText from './pages/SpeechToText';
import ChatbotPage from './pages/ChatbotPage';
import ISLLearning from './pages/ISLLearning';
import History from './pages/History';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import About from './pages/About';
import ModelInformation from './pages/ModelInformation';

function AppLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  
  return (
    <div className="min-h-screen bg-surface-900 text-white font-sans relative overflow-hidden">
      {!isLanding && <Navbar />}
      <main className={isLanding ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20'}>
        <Routes>
          {/* Publicly accessible studio & learning routes for seamless testing */}
          <Route path="/" element={<Landing />} />
          <Route path="/translator" element={<Translator />} />
          <Route path="/learn" element={<ISLLearning />} />
          <Route path="/tts" element={<TextToSpeech />} />
          <Route path="/stt" element={<SpeechToText />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/model-info" element={<ModelInformation />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />

          {/* Account profile route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </main>
      {!isLanding && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
