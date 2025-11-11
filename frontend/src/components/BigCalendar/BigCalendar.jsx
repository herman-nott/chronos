import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import './BigCalendar.css';
// import WeekView from './WeekCalendar'
// import DayView from './DayCalendar'

export default function BigCalendar({view, children }){
  
  return (
    <div className="big bg-gray-900 rounded-lg p-4 flex-1 text-white">
      {children}
    </div>
  );
};
