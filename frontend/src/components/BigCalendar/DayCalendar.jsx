import React, { useState, useEffect } from 'react';

export default function DayView({ 
  onDateChange, 
  currentDate, 
  events = [], 
  onEventClick, 
  onTimeSlotClick 
}) {
  const [selectedCells, setSelectedCells] = useState(new Set());

  useEffect(() => {
    onDateChange({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      day: currentDate.getDate(),
    });
  }, [currentDate]); 

  const getItemsForDay = () => {
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
        compareDate.getDate() === currentDate.getDate() &&
        compareDate.getMonth() === currentDate.getMonth() &&
        compareDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const getItemsForTimeSlot = (timeSlot) => {
    const items = getItemsForDay();
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
      const hour = parseTimeSlot(timeSlot);
      const clickedDate = new Date(currentDate);
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

  const handleItemClick = (item, e) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(item);
    }
  };

  const renderTimeBlocks = (timeSlot) => {
    const days = 1;
    const blocks = [];

    for (let dayIndex = 0; dayIndex < days; dayIndex++) {
      const cellKey = `${timeSlot}-${dayIndex}`;
      const isSelected = selectedCells.has(cellKey);
      const cellItems = getItemsForTimeSlot(timeSlot);

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
              onClick={(e) => handleItemClick(event, e)}
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
      <div className="calendar-container w-100">
        <div className="calendar-grid">
          <span className='' style={{display:'flex', justifyContent: 'center'}}>{currentDate.toLocaleDateString('en-US', { weekday: 'long' })}</span>
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