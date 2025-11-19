import React, { useState, useEffect } from 'react';

export default function DayView({ onDateChange, currentDate, today}) {
  const [selectedCells, setSelectedCells] = useState(new Set());

  if (today !== undefined) currentDate = today;
  
  useEffect(() => {
    onDateChange({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      day: currentDate.getDate(), // week view doesn't have a single day
    });
  }, [currentDate]); 

  // useEffect(() => {
  //   onDateChange({
  //     year: today.getFullYear(),
  //     month: today.getMonth(),
  //     day: today.getDate(),
  //   });
  // }, []);
  
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

  const renderTimeBlocks = (timeSlot) => {
    const days = 1;
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

  const weekDays = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <>
      <div className="calendar-container w-100">
        <div className="calendar-grid">
          <span className='' style={{display:'flex', justifyContent: 'center'}}>{weekDays[currentDate.getDay()]}</span>
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
