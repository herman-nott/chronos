import { useState, useEffect } from 'react';
import Popup from '../PopUp/PopUp';
import NewEvent from '../PopUp/NewEvent';
import './WeekCalendar.css';

export default function WeekView({ 
  onDateChange,
  currentDate,
  events = [],
  calendars = [],
  onTimeSlotClick,
  onEventClick,
  onDataCreated,
  settings = { timeFormat: "24" } 
}) {
  const [popup, setPopup] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 200, y: 120 });
  const [myCalendars, setMyCalendars] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  
  useEffect(() => {
    onDateChange({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      day: '',
    });
  }, [currentDate]);

  const [selectedCells, setSelectedCells] = useState(new Set());

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - ((day + 6) % 7);
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentDate);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

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

  const parseTimeSlot = (slot) => {
    if (settings.timeFormat === "24") {
      return Number(slot);
    } else {
      const isPM = slot.includes("PM");
      const hour = parseInt(slot.replace(/[AP]M/, ""));

      if (isPM && hour !== 12) return hour + 12;
      if (!isPM && hour === 12) return 0;
      return hour;
    }
  };

  const formatEventTime = (date) => {
    const d = new Date(date);
    if (settings.timeFormat === "24") {
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } else {
      const hours = d.getHours();
      const minutes = d.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
  };

  const calculateEventPosition = (event) => {
    const eventDate = new Date(event.start_time || event.due_date || event.reminder_time);
    const minutes = eventDate.getMinutes();
    // Position as percentage of the 72px cell height
    const topOffset = (minutes / 60) * 72;
    return topOffset;
  };

  const calculateEventDuration = (event) => {
    if (event.start_time && event.end_time) {
      const start = new Date(event.start_time);
      const end = new Date(event.end_time);
      const durationMinutes = (end - start) / (1000 * 60);
      // Convert to pixels (72px per hour)
      return (durationMinutes / 60) * 72;
    }
    return 32; // Default minimum height
  };

  const isEventPast = (event) => {
    const eventDate = new Date(event.end_time || event.start_time || event.due_date || event.reminder_time);
    return eventDate < new Date();
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

  const getCalendarColor = (calendarId) => {
    const calendar = calendars.find(cal => cal._id === calendarId);
    return calendar?.color || '#2196F3';
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
          onClick={(e) => openPopup("event", e)}
        >
          {cellItems.map((event, index) => {
            const topPosition = calculateEventPosition(event);
            const height = calculateEventDuration(event);
            const isPast = isEventPast(event);
            
            const eventHeight = Math.max(height, 32);
            const showFullDetails = eventHeight >= 60;
            const showMinimalDetails = eventHeight >= 40 && eventHeight < 60;
            
            return (
              <div
                key={event._id}
                className={`event-block ${event.category} ${isPast ? 'past' : ''}`}
                style={{ 
                  backgroundColor: getCalendarColor(event.calendarId),
                  top: `${topPosition}px`,
                  height: `${eventHeight}px`,
                  zIndex: 10 + index
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick?.(event, e);
                }}
                title={`${event.title}\n${event.description || ''}`}
              >
                {showFullDetails ? (
                  <>
                    <div className="event-time">
                      {formatEventTime(event.start_time || event.due_date || event.reminder_time)}
                    </div>
                    <div className="event-title">{event.title}</div>
                    {event.location && <div className="event-location">{event.location}</div>}
                  </>
                ) : showMinimalDetails ? (
                  <>
                    <div className="event-time">
                      {formatEventTime(event.start_time || event.due_date || event.reminder_time)}
                    </div>
                    <div className="event-title">{event.title}</div>
                  </>
                ) : (
                  <div className="event-title-compact">
                    {formatEventTime(event.start_time || event.due_date || event.reminder_time)} {event.title}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    return <div className="time-blocks">{blocks}</div>;
  };

  const hrs = settings.timeFormat === "24"
    ? Array.from({ length: 24 }, (_, i) => i)
    : [
        ...Array.from({ length: 11 }, (_, i) => `${i + 1}AM`),
        "12PM",
        ...Array.from({ length: 11 }, (_, i) => `${i + 1}PM`)
      ];

  const openPopup = (view, e) => {
    const rect = e.target.getBoundingClientRect();
    setPopup(view);
    setPopupPosition({ x: rect.right + 10, y: rect.top });
    setShowMenu(false);
  };

  const handleEventCreated = (data) => {
    console.log("EVENT CREATED:", data);
    setPopup(null);
    if (onDataCreated) {
      onDataCreated('event', data);
    }
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
      <div className="calendar-container">
        <div className="calendar-grid">
          <div className="time-row">
            <span className='time-label'></span>
            <ul className="week">
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
          </div>

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