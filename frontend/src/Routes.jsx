import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'

// Import page components
import CalendarPage from './components/Calendar/Calendar';
import LoginPage from './components/Auth/Login/Login'
import RegisterPage from './components/Auth/Register/Register'
import VerifyEmailPage from './components/Auth/VerifyEmail/VerifyEmail';
import ParticleBackground from './components/ParticleBackground/ParticleBackground'

const AppRoutes = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const location = useLocation();

  const authRoutes = ['/login', '/register', '/verify-email', '/password-reset'];
  const showParticle = authRoutes.includes(location.pathname);
  
  function onLoginSuccess(userId) {
    setIsSignedIn(true);
    setUserId(userId);
  }

  const path = window.location.pathname;
    if (path.startsWith("/password-reset/")) {
      const token = path.split("/")[2];
      setPasswordResetToken(token);
      setRoute("password-reset");
    }

  return (
   <>
      {showParticle && <ParticleBackground />}
        <Routes>
          <Route path="/home" element={<CalendarPage />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/" element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
        </Routes>
   </>
  );
};

export default AppRoutes;