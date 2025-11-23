import { useState } from "react";
import "./SmallCalendar.css";

export default function SmallCalendar({ variant='default', year, month, onDaySelect }) {
  const today = new Date();
  const [currMonth, setCurrMonth] = useState(month ?? today.getMonth()); 
  const [currYear, setCurrYear] = useState(year ?? today.getFullYear());
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate all days dynamically for the current month
  function getDays() {
    const jsFirstDay = new Date(currYear, currMonth, 1).getDay();
    const firstDayOfMonth = (jsFirstDay + 6) % 7;
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

  const handlePrevNext = (direction) => {
    if (variant === "inCalendar") return;

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
   <div className={`calendar-box ${variant}`}>
      <div className="calendar-inner">

        {/* Header */}
        <div className="calendar-header">
          <div className="calendar-header-left">
            <span className="calendar-month">
              {months[currMonth]} 
              {variant === "default" && (<span> {currYear}</span>)}
            </span>
          </div>

          <div className="calendar-header-right">
            {variant === "default" && (
              <>
                <i className="fa-solid fa-chevron-left calendar-arrow" onClick={() => handlePrevNext("prev")}></i>
                <i className="fa-solid fa-chevron-right calendar-arrow" onClick={() => handlePrevNext("next")}></i>
              </>
            )}
          </div>
        </div>

        {/* Week Labels */}
        <ul className="weeks">
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
          <li>Sun</li>
        </ul>

        {/* Days */}
        <ul className="days">
          {days.map((dayObj, index) => (
            <li key={index} className={dayObj.className} onClick={() => {
              if (dayObj.className === 'inactive') return;
              onDaySelect?.(new Date(currYear, currMonth, dayObj.day));
            }} >
              {dayObj.day}
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
}