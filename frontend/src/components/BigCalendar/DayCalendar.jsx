import React, { useState, useEffect } from 'react';

export default function DayView({ 
  onDateChange, 
  currentDate, 
  events = [], 
  tasks = [], 
  appointments = [], 
  onEventClick, 
  onTaskClick, 
  onAppointmentClick,
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

  // Get all items (events, tasks, appointments) -- for the current day
  const getItemsForDay = () => {
    const filterByDate = (arr, dateField = 'start_time') => arr.filter(item => {
      const itemDate = new Date(item[dateField]);
      return (
        itemDate.getDate() === currentDate.getDate() &&
        itemDate.getMonth() === currentDate.getMonth() &&
        itemDate.getFullYear() === currentDate.getFullYear()
      );
    });

    return [
      ...filterByDate(events).map(e => ({ ...e, type: 'event' })),
      ...filterByDate(tasks, 'due_date').map(t => ({ 
        ...t, 
        type: 'task', 
        start_time: t.due_date 
      })),
      ...filterByDate(appointments).map(a => ({ ...a, type: 'appointment' }))
    ];
  };

  // Get items for a specific time slot
  const getItemsForTimeSlot = (timeSlot) => {
    const items = getItemsForDay();
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

  // Handle item click based on type
  const handleItemClick = (item, e) => {
    e.stopPropagation();
    if (item.type === 'event' && onEventClick) {
      onEventClick(item);
    } else if (item.type === 'task' && onTaskClick) {
      onTaskClick(item);
    } else if (item.type === 'appointment' && onAppointmentClick) {
      onAppointmentClick(item);
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
          {cellItems.map(item => (
            <div
              key={item._id}
              className={`event-block ${item.type}`}
              onClick={(e) => handleItemClick(item, e)}
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
      <div className="calendar-container w-100">
        <div className="calendar-grid">
          <div className="day-header">
            <div className="day-name">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
            </div>
            <div className="day-date">
              {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

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