import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react'

// Import page components
import CalendarPage from './components/Calendar/Calendar';
import LoginPage from './components/Auth/Login/Login'
import RegisterPage from './components/Auth/Register/Register'
import VerifyEmailPage from './components/Auth/VerifyEmail/VerifyEmail';


const AppRoutes = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  
  function onLoginSuccess(userId) {
    setIsSignedIn(true);
    setUserId(userId);
  }

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<CalendarPage />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/" element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;