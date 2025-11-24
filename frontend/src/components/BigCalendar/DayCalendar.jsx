import { useState, useEffect } from 'react';
import Popup from '../PopUp/PopUp';
import NewEvent from '../PopUp/NewEvent';

export default function DayView({ 
  onDateChange, 
  currentDate, 
  events = [], 
  calendars = [], 
  onEventClick, 
  onTimeSlotClick,
  settings = { timeFormat: "24" }
}) {
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [popup, setPopup] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 200, y: 120 });
  const [myCalendars, setMyCalendars] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

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
    if (settings.timeFormat === "24") {
      return Number(slot); // slot is already "0"…"23"
    } else {
      const isPM = slot.includes("PM");
      const hour = parseInt(slot.replace(/[AP]M/, ""));

      if (isPM && hour !== 12) return hour + 12;
      if (!isPM && hour === 12) return 0;
      return hour;
    }
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

  const handleEventCreated = (data) => {
    console.log("EVENT CREATED:", data);
    setPopup(null);
    if (onDateChange) {
      onDataCreated('event', data);
    }
  };

  const getCalendarColor = (calendarId) => {
    const calendar = calendars.find(cal => cal._id === calendarId);
    return calendar?.color || '#2196F3'; // Default
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
          onClick={(e) => openPopup("event", e)}
        >
          {cellItems.map(event => (
            <div
              key={event._id}
              className={`event-block ${event.category}`}
              style={{ backgroundColor: getCalendarColor(event.calendarId) }}
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

  const hrs = settings.timeFormat === "24"
  ? Array.from({ length: 24 }, (_, i) => i)  // 0–23
  : [
      ...Array.from({ length: 11 }, (_, i) => `${i + 1}AM`),
      "12PM",
      ...Array.from({ length: 11 }, (_, i) => `${i + 1}PM`)
    ];
    
  const openPopup = (view, e) => {
    const rect = e.target.getBoundingClientRect();

    setPopup(view);
    setPopupPosition({ x: rect.right + 10, y: rect.top });
    // setInviteCalendarId(extra.calendarId ?? null);
    // setEditingCalendar(extra.editingCalendar ?? null);
    setShowMenu(false);
  };
  
  return (
    <>
    {popup === "event" && (
      <Popup position={popupPosition} onClose={() => setPopup(null)}>
        <NewEvent
          calendarId={myCalendars[0]?._id}
          onClose={() => setPopup(null)}
          onEventCreated={handleEventCreated}
        />
      </Popup>
    )}
      <div className="calendar-container w-100">
        <div className="calendar-grid">
          <span className='' style={{display:'flex', justifyContent: 'center'}}>{currentDate.toLocaleDateString('en-US', { weekday: 'long' })}</span>
          {hrs.map((slot) => (
            <div key={slot} className="time-row">
              <span className="time-label">
                {settings.timeFormat === "24" ? `${slot}:00` : slot}
              </span>
              {renderTimeBlocks(slot)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}