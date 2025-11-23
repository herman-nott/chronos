import React, { useState, useEffect } from 'react';
import './WeekCalendar.css';

export default function WeekView({ onDateChange, currentDate, events = [], tasks = [], appointments = [], onTimeSlotClick, onEventClick, onTaskClick, onAppointmentClick }) {
  const [popup, setPopup] = useState(null);
  useEffect(() => {
    onDateChange({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      day: '',
    });
  }, [currentDate]);

  const [selectedCells, setSelectedCells] = useState(new Set());

  // Get the start of the week (Sunday)
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - ((day + 6) % 7);
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentDate);

  // Generate the 7 days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  // Filter events for this week
  const getItemsForDay = (day) => {
    return events.filter(event => {
      let compareDate;
      
      if (event.category === 'task') {
        compareDate = new Date(event.due_date);
      } else if (event.category === 'reminder') {
        compareDate = new Date(event.reminder_time);
      } else {
        compareDate = new Date(event.start_time);
      }
      
      return (
        compareDate.getDate() === day.getDate() &&
        compareDate.getMonth() === day.getMonth() &&
        compareDate.getFullYear() === day.getFullYear()
      );
    });
  };

  const getItemsForTimeSlot = (timeSlot, dayIndex) => {
    const day = weekDays[dayIndex];
    const items = getItemsForDay(day);
    const slotHour = parseTimeSlot(timeSlot);

    return items.filter(event => {
      const eventDate = event.start_time || event.due_date || event.reminder_time;
      const eventHour = new Date(eventDate).getHours();
      return eventHour === slotHour;
    });
  };

  // Parse time slot like "9AM" to hour number
  const parseTimeSlot = (slot) => {
    const isPM = slot.includes('PM');
    const hour = parseInt(slot.replace(/[AP]M/, ''));
    
    if (isPM && hour !== 12) return hour + 12;
    if (!isPM && hour === 12) return 0;
    return hour;
  };

  const handleCellClick = (timeSlot, dayIndex) => {
    if (onTimeSlotClick) {
      const day = weekDays[dayIndex];
      const hour = parseTimeSlot(timeSlot);
      const clickedDate = new Date(day);
      clickedDate.setHours(hour, 0, 0, 0);
      onTimeSlotClick(clickedDate);
    }

    const cellKey = `${timeSlot}-${dayIndex}`;
    setSelectedCells(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cellKey)) {
        newSet.delete(cellKey);
      } else {
        newSet.add(cellKey);
      }
      return newSet;
    });
  };

  const renderTimeBlocks = (timeSlot) => {
    const days = 7;
    const blocks = [];

    for (let dayIndex = 0; dayIndex < days; dayIndex++) {
      const cellKey = `${timeSlot}-${dayIndex}`;
      const isSelected = selectedCells.has(cellKey);
      const cellItems = getItemsForTimeSlot(timeSlot, dayIndex);

      blocks.push(
        <div
          key={dayIndex}
          className={`calendar-cell ${isSelected ? 'selected' : ''}`}
          onClick={() => handleCellClick(timeSlot, dayIndex)}
        >
          {cellItems.map(event => (
            <div
              key={event._id}
              className={`event-block ${event.category}`}
              onClick={(e) => {
                e.stopPropagation();
                onEventClick?.(event);
              }}
              title={`${event.title}\n${event.description || ''}`}
            >
              <div className="event-title">{event.title}</div>
              {event.location && <div className="event-location">{event.location}</div>}
            </div>
          ))}
        </div>
      );
    }

    return <div className="time-blocks">{blocks}</div>;
  };

  const hrs = [
    ...Array.from({ length: 11 }, (_, i) => `${i + 1}AM`),
    '12PM',
    ...Array.from({ length: 11 }, (_, i) => `${i + 1}PM`)
  ];

  return (
    <>
      <div className="calendar-container">
        <div className="calendar-grid">
          <ul className="weeks">
            <li className='time-label mr-2' ></li>
            {weekDays.map((day, index) => (
              <li className='calendar-cell' key={index}>
                <div className="week-day-header">
                  <div className="day-name">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="day-number">{day.getDate()}</div>
                </div>
              </li>
            ))}
          </ul>

          {hrs.map((slot) => (
            <div key={slot} className="time-row">
              <span className="time-label">{slot}</span>
              {renderTimeBlocks(slot)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}