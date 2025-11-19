import React, { useState, useEffect } from "react";
import "./MonthCalendar.css";

export default function MonthView({ 
  onDateChange, 
  currentDate, 
  events = [], 
  tasks = [], 
  appointments = [], 
  onEventClick, 
  onTaskClick, 
  onAppointmentClick 
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

  // Get all items (events, tasks, appointments) for a specific day
  const getItemsForDay = (day, month, year) => {
    const filterByDate = (arr, dateField = 'start_time') => arr.filter(item => {
      const itemDate = new Date(item[dateField]);
      return (
        itemDate.getDate() === day &&
        itemDate.getMonth() === month &&
        itemDate.getFullYear() === year
      );
    });

    // Combine all items with type identifiers
    return [
      ...filterByDate(events).map(e => ({ ...e, type: 'event' })),
      ...filterByDate(tasks, 'due_date').map(t => ({ ...t, type: 'task', start_time: t.due_date })),
      ...filterByDate(appointments).map(a => ({ ...a, type: 'appointment' }))
    ].sort((a, b) => new Date(a.start_time) - new Date(b.start_time)); // Sort by time
  };

  // Generate all days dynamically for the current month
  function getDays() {
    const firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
    const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
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

  // Handle item click based on type
  const handleItemClick = (item) => {
    if (item.type === 'event' && onEventClick) {
      onEventClick(item);
    } else if (item.type === 'task' && onTaskClick) {
      onTaskClick(item);
    } else if (item.type === 'appointment' && onAppointmentClick) {
      onAppointmentClick(item);
    }
  };

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
              
              {/* Day slots for all items */}
              <div className="day-slots">
                {dayObj.items.length === 0 ? (
                  <span className="empty-slot"></span>
                ) : (
                  dayObj.items.slice(0, 3).map((item) => (
                    <div
                      key={item._id}
                      className={`event-slot ${item.type}`}
                      onClick={() => handleItemClick(item)}
                      title={`${item.title}${item.description ? '\n' + item.description : ''}`}
                    >
                      <span className="event-time">
                        {new Date(item.start_time).toLocaleTimeString('en-US', {
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