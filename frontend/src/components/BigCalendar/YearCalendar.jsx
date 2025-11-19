import React, { useState, useEffect } from "react";
import "./MonthCalendar.css";
import "./YearCalendar.css";
import SmallCalendar from '../SmallCalendar/SmallCalendar';

export default function YearView({ onDateChange, currentDate }) {
  useEffect(() => {
    onDateChange({
      year:  currentDate.getFullYear(),
      month:  currentDate.getMonth(),
      day: '',
    });
  }, [ currentDate]);

  // const [currMonth, setCurrMonth] = useState(today.getMonth());
  const [currYear, setCurrYear] = useState(currentDate.getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="calendar-container">
      <div className="calendar-inner">
       <div className="month-calendar">
          <ul>
            {months.map((monthName, index) => (
              <li key={monthName} className='year-month'>
                <SmallCalendar 
                  variant="inCalendar" 
                  year={currYear} 
                  month={index}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
