import React, { useState, useEffect } from "react";
import "./MonthCalendar.css";

export default function MonthView({ 
  onDateChange, 
  currentDate, 
  events = [], 
  onEventClick,
  onTimeSlotClick
}) {
  useEffect(() => {
    onDateChange({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      day: '',
    });
  }, [currentDate]);

  const [currMonth, setCurrMonth] = useState(currentDate.getMonth());
  const [currYear, setCurrYear] = useState(currentDate.getFullYear());

  // Update currMonth and currYear when currentDate changes
  useEffect(() => {
    setCurrMonth(currentDate.getMonth());
    setCurrYear(currentDate.getFullYear());
  }, [currentDate]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getItemsForDay = (day, month, year) => {
    return events.filter(event => {
      let compareDate;
      
      // Use appropriate date field based on category
      if (event.category === 'task') {
        compareDate = new Date(event.due_date);
      } else if (event.category === 'reminder') {
        compareDate = new Date(event.reminder_time);
      } else { // arrangement
        compareDate = new Date(event.start_time);
      }
      
      return (
        compareDate.getDate() === day &&
        compareDate.getMonth() === month &&
        compareDate.getFullYear() === year
      );
    }).sort((a, b) => {
      const aDate = a.start_time || a.due_date || a.reminder_time;
      const bDate = b.start_time || b.due_date || b.reminder_time;
      return new Date(aDate) - new Date(bDate);
    });
  };

  // Generate all days dynamically for the current month
  function getDays() {
    function getMondayFirstDay(jsDay) {
      return (jsDay + 6) % 7;
    }

    const firstDayOfMonth = getMondayFirstDay(
      new Date(currYear, currMonth, 1).getDay()
    );
    const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
     const lastDayOfMonth = getMondayFirstDay(
    new Date(currYear, currMonth, lastDateOfMonth).getDay()
  );
    const lastDateOfPrevMonth = new Date(currYear, currMonth, 0).getDate();

    const days = [];

    // Previous month's ending days
    for (let i = firstDayOfMonth; i > 0; i--) {
      const day = lastDateOfPrevMonth - i + 1;
      const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
      const prevYear = currMonth === 0 ? currYear - 1 : currYear;
      
      days.push({
        day,
        className: "inactive",
        items: getItemsForDay(day, prevMonth, prevYear)
      });
    }

    // Current month's days
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const isToday =
        i === new Date().getDate() &&
        currMonth === new Date().getMonth() &&
        currYear === new Date().getFullYear();

      days.push({
        day: i,
        className: isToday ? "active" : "",
        items: getItemsForDay(i, currMonth, currYear)
      });
    }

    // Next month's starting days
    for (let i = lastDayOfMonth; i < 6; i++) {
      const day = i - lastDayOfMonth + 1;
      const nextMonth = currMonth === 11 ? 0 : currMonth + 1;
      const nextYear = currMonth === 11 ? currYear + 1 : currYear;
      
      days.push({
        day,
        className: "inactive",
        items: getItemsForDay(day, nextMonth, nextYear)
      });
    }

    return days;
  }

  const days = getDays();

  const handleItemClick = (item) => {
    onEventClick(item);
  };

  return (
    <div className="mon-calendar-box">
      <div className="mon-calendar-inner">

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
        <ul className="mon-days">
          {days.map((dayObj, index) => (
            <li key={index} className={dayObj.className}>
              <div className="day-number">{dayObj.day}</div>
              
              {/* Day slots for all items */}
              <div className="day-slots">
                {dayObj.items.length === 0 ? (
                  <span className="empty-slot"></span>
                ) : (
                  dayObj.items.slice(0, 3).map((event) => (
                    <div
                      key={event._id}
                      className={`event-slot ${event.category}`}
                      onClick={() => handleItemClick(event)}
                      title={`${event.title}${event.description ? '\n' + event.description : ''}`}
                    >
                      <span className="event-time">
                        {new Date(
                          event.start_time || event.due_date || event.reminder_time
                        ).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                  ))
                )}
                {dayObj.items.length > 3 && (
                  <div className="more-events">
                    +{dayObj.items.length - 3} more
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}