import React, { useState, useEffect } from 'react';
import './WeekCalendar.css';

export default function WeekView({ onDateChange, currentDate, events = [], tasks = [], appointments = [], onTimeSlotClick, onEventClick, onTaskClick, onAppointmentClick }) {
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
    const diff = d.getDate() - day;
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
    const filterByDate = (arr) => arr.filter(item => {
      const itemDate = new Date(item.start_time);
      return (
        itemDate.getDate() === day.getDate() &&
        itemDate.getMonth() === day.getMonth() &&
        itemDate.getFullYear() === day.getFullYear()
      );
    });

    return [
      ...filterByDate(events).map(e => ({ ...e, type: 'event' })),
      ...filterByDate(
        tasks.map(t => ({
          ...t,
          type: 'task',
          start_time: t.due_date,
        }))
      ),
      ...filterByDate(appointments).map(a => ({ ...a, type: 'appointment' })),
    ];
  };


  const getItemsForTimeSlot = (timeSlot, dayIndex) => {
    const day = weekDays[dayIndex];
    const items = getItemsForDay(day);

    const slotHour = parseTimeSlot(timeSlot);

    return items.filter(item => {
      const itemHour = new Date(item.start_time).getHours();
      return itemHour === slotHour;
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
          {cellItems.map(item => (
            <div
              key={item._id}
              className={`event-block ${item.type}`} // CSS can color differently
              onClick={(e) => {
                e.stopPropagation();
                if(item.type === 'event') onEventClick?.(item);
                if(item.type === 'task') onTaskClick?.(item);
                if(item.type === 'appointment') onAppointmentClick?.(item);
              }}
              title={`${item.title}\n${item.description || ''}`}
            >
              <div className="event-title">{item.title}</div>
              {item.location && <div className="event-location">{item.location}</div>}
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
            {weekDays.map((day, index) => (
              <li key={index}>
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