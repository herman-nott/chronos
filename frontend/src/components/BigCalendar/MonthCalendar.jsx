import React, { useState } from "react";
import "./MonthCalendar.css";

export default function MonthView() {
  const today = new Date();
  const [currMonth, setCurrMonth] = useState(today.getMonth());
  const [currYear, setCurrYear] = useState(today.getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate all days dynamically for the current month
  function getDays() {
    const firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
    const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
    const lastDateOfPrevMonth = new Date(currYear, currMonth, 0).getDate();

    const days = [];

    // Previous month’s ending days
    for (let i = firstDayOfMonth; i > 0; i--) {
      days.push({
        day: lastDateOfPrevMonth - i + 1,
        className: "inactive"
      });
    }

    // Current month’s days
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const isToday =
        i === today.getDate() &&
        currMonth === today.getMonth() &&
        currYear === today.getFullYear();

      days.push({
        day: i,
        className: isToday ? "active" : ""
      });
    }

    // Next month’s starting days
    for (let i = lastDayOfMonth; i < 6; i++) {
      days.push({
        day: i - lastDayOfMonth + 1,
        className: "inactive"
      });
    }

    return days;
  }

  const days = getDays();
  console.log(days)
  const handlePrevNext = (direction) => {
    let newMonth = direction === "prev" ? currMonth - 1 : currMonth + 1;
    let newYear = currYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setCurrMonth(newMonth);
    setCurrYear(newYear);
  };

  return (
    <div className="mon-calendar-box">
      <div className="mon-calendar-inner">

        {/* Header */}
        <div className="mon-calendar-header">
          <div className="mon-calendar-header-left">
            <h2 className="mon-calendar-month">
              {months[currMonth]} {currYear}
            </h2>
          </div>

          <div className="mon-calendar-header-right">
            <i
              className="fa-solid fa-chevron-left mon-calendar-arrow"
              onClick={() => handlePrevNext("prev")}
            ></i>
            <i
              className="fa-solid fa-chevron-right mon-calendar-arrow"
              onClick={() => handlePrevNext("next")}
            ></i>
          </div>
        </div>

        {/* Week Labels */}
        <ul className="mon-weeks">
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
              {dayObj.day}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
