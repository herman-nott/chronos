import { useState, useEffect } from 'react';
import Popup from '../PopUp/PopUp';
import NewEvent from '../PopUp/NewEvent';
import CurrentTimeLine from '../CurrentTimeLine/CurrentTimeLine';

// layout calc func
function calculateEventLayout(events) {
  if (!events || events.length === 0) return [];

  const sortedEvents = [...events].sort((a, b) => {
    const aStart = new Date(a.start_time || a.due_date || a.reminder_time);
    const bStart = new Date(b.start_time || b.due_date || b.reminder_time);
    
    if (aStart.getTime() !== bStart.getTime()) {
      return aStart - bStart;
    }
    
    const aDuration = a.end_time ? 
      new Date(a.end_time) - aStart : 60 * 60 * 1000;
    const bDuration = b.end_time ? 
      new Date(b.end_time) - bStart : 60 * 60 * 1000;
    
    return bDuration - aDuration;
  });

  const eventLayouts = sortedEvents.map(event => ({
    event,
    column: 0,
    totalColumns: 1
  }));

  for (let i = 0; i < eventLayouts.length; i++) {
    const currentLayout = eventLayouts[i];
    const currentEvent = currentLayout.event;
    const currentStart = new Date(currentEvent.start_time || currentEvent.due_date || currentEvent.reminder_time);
    const currentEnd = currentEvent.end_time ? 
      new Date(currentEvent.end_time) : 
      new Date(currentStart.getTime() + 60 * 60 * 1000);

    const overlappingLayouts = [];
    for (let j = 0; j < i; j++) {
      const prevLayout = eventLayouts[j];
      const prevEvent = prevLayout.event;
      const prevStart = new Date(prevEvent.start_time || prevEvent.due_date || prevEvent.reminder_time);
      const prevEnd = prevEvent.end_time ? 
        new Date(prevEvent.end_time) : 
        new Date(prevStart.getTime() + 60 * 60 * 1000);

      if (currentStart < prevEnd && currentEnd > prevStart) {
        overlappingLayouts.push(prevLayout);
      }
    }

    if (overlappingLayouts.length > 0) {
      const usedColumns = overlappingLayouts.map(l => l.column);
      let column = 0;
      while (usedColumns.includes(column)) {
        column++;
      }
      currentLayout.column = column;

      const maxColumn = Math.max(column, ...usedColumns);
      const totalColumns = maxColumn + 1;
      
      currentLayout.totalColumns = totalColumns;
      overlappingLayouts.forEach(layout => {
        layout.totalColumns = Math.max(layout.totalColumns, totalColumns);
      });
    }
  }

  return eventLayouts;
}

export default function DayView({ 
  onDateChange, 
  currentDate, 
  events = [], 
  calendars = [], 
  onEventClick, 
  onTimeSlotClick,
  onDataCreated,
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
      onEventClick(item, e);
    }
  };

  const handleEventCreated = (data) => {
    setPopup(null);
    if (onDataCreated) {
      onDataCreated('event', data);
    }
  };

  const getCalendarColor = (calendarId) => {
    const calendar = calendars.find(cal => cal._id === calendarId);
    return calendar?.color || '#2196F3';
  };

  const getEventColor = (event) => {
    // Use event's own color if set, otherwise fall back to calendar color
    return event.color || getCalendarColor(event.calendarId);
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 66, g: 133, b: 244 };
  };

  const renderTimeBlocks = (timeSlot) => {
    const days = 1;
    const blocks = [];

    for (let dayIndex = 0; dayIndex < days; dayIndex++) {
      const cellKey = `${timeSlot}-${dayIndex}`;
      const isSelected = selectedCells.has(cellKey);
      const cellItems = getItemsForTimeSlot(timeSlot, dayIndex);
      
      // Calculate layout for overlapping events
      const eventLayouts = calculateEventLayout(cellItems);

      blocks.push(
        <div
          key={dayIndex}
          className={`calendar-cell ${isSelected ? 'selected' : ''}`}
          onClick={(e) => openPopup("event", e)}
        >
          {eventLayouts.map(({ event, column, totalColumns }, index) => {
            const topPosition = calculateEventPosition(event);
            const height = calculateEventDuration(event);
            const isPast = isEventPast(event);
            
            const eventHeight = Math.max(height, 32);
            const showFullDetails = eventHeight >= 60;
            const showMinimalDetails = eventHeight >= 40 && eventHeight < 60;
            
            const eventColor = getEventColor(event);
            const calendarColor = getCalendarColor(event.calendarId);
            const rgb = hexToRgb(eventColor);
            const bgColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.75)`;
            const textColor = "white";
            
            // Calculate width and position based on columns
            const widthPercent = 100 / totalColumns;
            const leftPercent = column * widthPercent;
            
            return (
              <div
                key={event._id}
                className={`event-block ${event.category} ${isPast ? 'past' : ''}`}
                style={{ 
                  backgroundColor: bgColor,
                  borderLeftColor: calendarColor,
                  top: `${topPosition}px`,
                  height: `${eventHeight}px`,
                  left: `${leftPercent}%`,
                  width: `calc(${widthPercent}% - 8px)`,
                  right: 'auto',
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
                    <div className="event-time" style={{ color: textColor, opacity: 0.8 }}>
                      {formatEventTime(event.start_time || event.due_date || event.reminder_time)}
                    </div>
                    <div className="event-title" style={{ color: textColor }}>
                      {event.title}
                    </div>
                    {event.location && (
                      <div className="event-location" style={{ color: textColor, opacity: 0.7 }}>
                        {event.location}
                      </div>
                    )}
                  </>
                ) : showMinimalDetails ? (
                  <>
                    <div className="event-time" style={{ color: textColor, opacity: 0.8 }}>
                      {formatEventTime(event.start_time || event.due_date || event.reminder_time)}
                    </div>
                    <div className="event-title" style={{ color: textColor }}>
                      {event.title}
                    </div>
                  </>
                ) : (
                  <div className="event-title-compact" style={{ color: textColor }}>
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
      <div className="calendar-container w-100" style={{ position: 'relative' }}>
        <div className="calendar-grid">
          <CurrentTimeLine startHour={0} endHour={24} hourHeight={72} offsetTop={30} />

          <span className='' style={{display:'flex', justifyContent: 'center'}}>
            {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
          </span>
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