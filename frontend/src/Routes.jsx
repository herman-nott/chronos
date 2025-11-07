import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import CalendarPage from './components/BigCalendar/BigCalendar';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;