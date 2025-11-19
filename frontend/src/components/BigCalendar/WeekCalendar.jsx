import React, { useState, useEffect } from 'react';
import './WeekCalendar.css'

export default function WeekView({ onDateChange, currentDate }) {
  useEffect(() => {
    onDateChange({
      year:  currentDate.getFullYear(),
      month:  currentDate.getMonth(),
      day: '',
    });
  }, [ currentDate ]);

  const [selectedCells, setSelectedCells] = useState(new Set());

  const handleCellClick = (timeSlot, dayIndex) => {
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

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const renderTimeBlocks = (timeSlot) => {
    const days = 7;
    const blocks = [];

    for (let dayIndex = 0; dayIndex < days; dayIndex++) {
      const cellKey = `${timeSlot}-${dayIndex}`;
      const isSelected = selectedCells.has(cellKey);
      blocks.push(
        <div
          key={dayIndex}
          className={`calendar-cell ${isSelected ? 'selected' : ''}`}
          onClick={() => handleCellClick(timeSlot, dayIndex)}
        />
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
          <div className="time-row">
          <span className="time-label mr-1"></span> {/* empty top-left corner */}
            <div className="time-blocks"> 
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const weekIndex = ((currentDate.getDay() + 6) %7 + dayIndex - 1);
                const date = (currentDate.getDate() + dayIndex -1); 
                return(
                  <div key={dayIndex} className='calendar-cell'>
                    <span className=''>
                      {weekDays[weekIndex]}
                    </span>
                    <span> 
                      {date}
                    </span>
                  </div>
                )
              })}
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
};
