import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'

// Import page components
import CalendarPage from './components/Calendar/Calendar';
import LoginPage from './components/Auth/Login/Login'
import RegisterPage from './components/Auth/Register/Register'
import VerifyEmailPage from './components/Auth/VerifyEmail/VerifyEmail';
import ParticleBackground from './components/ParticleBackground/ParticleBackground'
import BodyClassController from './components/BodyClassController/BodyClassController'
import PasswordResetWithTocken from './components/Auth/PasswordReset/PasswordReset';

const AppRoutes = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const location = useLocation();

  const [passwordResetToken, setPasswordResetToken] = useState('');

  const authRoutes = ['/login', '/register', '/verify-email', '/password-reset', '/'];
  const showParticle = authRoutes.includes(location.pathname);

  function onLoginSuccess(userId) {
    setIsSignedIn(true);
    setUserId(userId);
  }

  return (
   <>
      {showParticle && <ParticleBackground />}
       <BodyClassController route={location.pathname} />
        <Routes>
          <Route path="/home" element={<CalendarPage />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/" element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
          <Route path='/password-reset/:token' element={<PasswordResetWithTocken />} />
        </Routes>
   </>
  );
};

export default AppRoutes;