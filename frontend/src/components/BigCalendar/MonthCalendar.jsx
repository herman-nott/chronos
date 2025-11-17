import React, { useState, useEffect } from "react";
import "./MonthCalendar.css";

export default function MonthView({ onDateChange, currentDate }) {
  const [currMonth, setCurrMonth] = useState(currentDate.getMonth());
  const [currYear, setCurrYear] = useState(currentDate.getFullYear());
  const [days, setDays] = useState([])
  
  useEffect(() => {
    onDateChange({
      year:  currentDate.getFullYear(),
      month:  currentDate.getMonth(),
      day: '',
    });
    setCurrMonth(currentDate.getMonth());
    setCurrYear(currentDate.getFullYear());
    setDays(getDays());
  }, [ currentDate ]);

  // const months = [
  //   "January", "February", "March", "April", "May", "June",
  //   "July", "August", "September", "October", "November", "December"
  // ];

  // Generate all days dynamically for the current month
  function getDays() {
    let newDays = [];
    const firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
    const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
    const lastDateOfPrevMonth = new Date(currYear, currMonth, 0).getDate();

    // Previous month’s ending days
    for (let i = firstDayOfMonth; i > 0; i--) {
      newDays.push({
        day: lastDateOfPrevMonth - i + 1,
        className: "inactive",
        events: []
      });
    }

    // Current month’s days
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const isToday =
        i === currentDate.getDate() &&
        currMonth === currentDate.getMonth() &&
        currYear === currentDate.getFullYear();

      newDays.push({
        day: i,
        className: isToday ? "active" : "",
        events: [] // You can populate this with real events
      });
    }

    // Next month’s starting days
    for (let i = lastDayOfMonth; i < 6; i++) {
      newDays.push({
        day: i - lastDayOfMonth + 1,
        className: "inactive",
        events: []
      });
    }

    return newDays;
  }


  return (
    <div className="mon-calendar-box">
      <div className="mon-calendar-inner">

        {/* Week Labels */}
        <ul className="weeks">
          <li>Sun</li>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
        </ul>

        {/* Days */}
        <ul className="mon-days">
          {days.map((dayObj, index) => (
            <li key={index} className={dayObj.className}>
              <div className="day-number">{dayObj.day}</div>
              
              {/* Day slots for events */}
              <div className="day-slots">
                {dayObj.events.length === 0 
                  ? <span className="empty-slot">No events</span>
                  : dayObj.events.map((event, idx) => (
                      <div key={idx} className="event-slot">
                        {event.title}
                      </div>
                  ))
                }
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}