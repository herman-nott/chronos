import React, { useState, useEffect } from 'react';
import DayCalendar from './DayCalendar'

export default function TodayView({ }) {
  const today = new Date();
  console.log(today);

  return (
    <>
      <div className="calendar-container">
       <DayCalendar today={today}>
       </DayCalendar>
      </div>
    </>
  );
};
