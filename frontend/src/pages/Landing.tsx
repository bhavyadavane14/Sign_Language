import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../components/SplashScreen';
import WelcomeScreen from '../components/WelcomeScreen';

export default function Landing() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  // Auto-transition from Splash to Welcome after 2.4 seconds, or instant on click
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <WelcomeScreen
      onGetStarted={() => navigate('/login')}
      onSkip={() => navigate('/login')}
    />
  );
}
