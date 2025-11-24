import Button from '../ui/Button/Button';
import SearchView from '../ui/SearchView/SearchView';
import CalendarSidebar from '../LeftSide/LeftSide';
import BigCalendar from '../BigCalendar/BigCalendar';
import NewEvent from '../PopUp/NewEvent';
import EventDetails from '../PopUp/EventDetails';
import ShareEvent from '../PopUp/ShareEvent';
import EditEvent from '../PopUp/EditEvent';
import Popup from '../PopUp/PopUp';

import { useState, useEffect } from 'react';
import './Calendar.css';

import WeekView from '../BigCalendar/WeekCalendar';
import DayView from '../BigCalendar/DayCalendar';
import MonthView from '../BigCalendar/MonthCalendar';
import YearView from '../BigCalendar/YearCalendar';

export default function Calendar() {
  const [view, setSelectedView] = useState('Week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentInfo, setCurrentInfo] = useState({
    year: null,
    month: null,
    day: null
  });

  const [calendarId, setCalendarId] = useState(null);
  const [calendars, setCalendars] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [visibleCalendars, setVisibleCalendars] = useState({});
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showShareEvent, setShowShareEvent] = useState(false);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 200, y: 120 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/calendars', {
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch calendars');
        }

        const data = await response.json();
        
        if (data.myCalendars && data.myCalendars.length > 0) {
          setCalendarId(data.myCalendars[0]._id);
        } else {
          await createDefaultCalendar();
        }
      } catch (error) {
        console.error('Error fetching calendars:', error);
        setError('Failed to load calendars. Please check your connection.');
      }
    };

    fetchCalendars();
  }, []);

  // создание дефолтного календаря -- проверить, вызывает ли создание двух на рыло
  const createDefaultCalendar = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/calendars', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: 'My Calendar',
          color: '#2196F3'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create calendar');
      }

      const data = await response.json();
      setCalendarId(data._id);
    } catch (error) {
      console.error('Error creating calendar:', error);
      setError('Failed to create calendar. Please try again.');
    }
  };

  // фетч ВСЁ
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/calendars', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch calendars');
      }

      const data = await response.json();
      const allCalendars = [...(data.myCalendars || []), ...(data.otherCalendars || [])];
      
      // v tom chisle tsveta
      setCalendars(allCalendars);
      
      const eventsPromises = allCalendars.map(calendar =>
        fetch(`http://localhost:3000/api/events/${calendar._id}`, {
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        })
          .then(res => res.ok ? res.json() : [])
          .then(events => events.map(event => ({ ...event, calendarId: calendar._id })))
          .catch(() => [])
      );

      const eventsArrays = await Promise.all(eventsPromises);
      const allEvents = eventsArrays.flat();
      
      setAllEvents(allEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setAllEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // фильтр видимости
  const visibleEvents = allEvents.filter(event => 
    visibleCalendars[event.calendarId] !== false
  );

  // смена видимости по клику
  const handleCalendarVisibilityChange = (newVisibleCalendars) => {
    setVisibleCalendars(newVisibleCalendars);
  };

  const handleEventCreated = (newEvent) => {
    setAllEvents([...allEvents, newEvent]);
  };

  const handleShareEvent = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(false);
    setShowShareEvent(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(false);
    setShowEditEvent(true);
  };

  // рефетч данных
  const handleDataCreated = (type, data) => {
    fetchEvents();
  };

  const handleEventDeleted = (eventId) => {
    setAllEvents(allEvents.filter(e => e._id !== eventId));
  };

  const handleEventUpdated = (updatedEvent) => {
    setAllEvents(allEvents.map(e => 
      e._id === updatedEvent._id ? updatedEvent : e
    ));
  };

  const handleSmallCalendarDaySelect = (date) => {
    setCurrentDate(date);
    setSelectedView("Day");

    setCurrentInfo({
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
    });
  };

  const renderView = () => {
    const commonProps = { 
      onDateChange: setCurrentInfo, 
      currentDate,
      events: visibleEvents,
      calendars: calendars, // Add this
      onEventClick: (event, e) => {
        const rect = e?.target?.getBoundingClientRect();
        if (rect) {
          setPopupPosition({ 
            x: rect.right + 10, 
            y: rect.top 
          });
        }
        setSelectedEvent(event);
        setShowEventDetails(true);
      },
      onTimeSlotClick: (date) => {
        setCurrentDate(date);
      }
    };

    switch (view) {
      case "Day":
        return <DayView {...commonProps} />;
      case "Month":
        return <MonthView {...commonProps} />;
      case "Year":
        return <YearView {...commonProps} />;
      case "Week":
      default:
        return <WeekView {...commonProps} />;
    }
  };

  const handlePrev = () => {
    switch(view) {
      case 'Day':
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
        break;
      case 'Week':
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));
        break;
      case 'Month':
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, prev.getDate()));
        break;
      case 'Year':
        setCurrentDate(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), prev.getDate()));
        break;
    }
  };

  const handleNext = () => {
    switch(view) {
      case 'Day':
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
        break;
      case 'Week':
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
        break;
      case 'Month':
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, prev.getDate()));
        break;
      case 'Year':
        setCurrentDate(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), prev.getDate()));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedView('Day');
  };

  if (error) {
    return (
      <div className="calendar-main">
        <div className="calendar-layout">
          <CalendarSidebar 
            onDataCreated={handleDataCreated} 
            onDaySelect={handleSmallCalendarDaySelect}
            onCalendarVisibilityChange={handleCalendarVisibilityChange}
          />
          <div className="calendar-content">
            <div style={{ padding: '20px', color: 'red' }}>
              <h3>Error Loading Calendar</h3>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  return (
    <>
      <div className="calendar-main">
        <div className="calendar-layout">
          <CalendarSidebar 
            onDataCreated={handleDataCreated} 
            onDaySelect={handleSmallCalendarDaySelect}
            onCalendarVisibilityChange={handleCalendarVisibilityChange}
          />

          <div className="calendar-content">
            <div className="calendar-toolbar">
              <Button text="Today" onClick={handleToday} />
              
              <div className="toolbar-left">
                <i className="fa-solid fa-chevron-left black " onClick={handlePrev}></i>
                <i className="fa-solid fa-chevron-right black" onClick={handleNext}></i>
              </div>
              
              <span>
                {currentInfo.year && currentInfo.month !== null
                  ? `${currentInfo.day ? currentInfo.day + " " : ""} ${months[currentInfo.month]} ${currentInfo.year}`
                  : "Loading..."}
              </span>

              <div className="toolbar-center">
                <Button text="Day" onClick={() => setSelectedView('Day')} />
                <Button text="Week" onClick={() => setSelectedView('Week')} />
                <Button text="Month" onClick={() => setSelectedView('Month')} />
                <Button text="Year" onClick={() => setSelectedView('Year')} />
              </div>

              <div className="toolbar-right">
                <SearchView placeholder="Search" />
              </div>
            </div>

            <div className="big-calendar">
              {loading ? (
                <div>Loading events...</div>
              ) : (
                <BigCalendar>
                  {renderView()}
                </BigCalendar>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Popup */}
      {showEventDetails && selectedEvent && (
        <Popup 
          position={popupPosition} 
          onClose={() => {
            setShowEventDetails(false);
            setSelectedEvent(null);
          }}
        >
          <EventDetails
            event={selectedEvent}
            onClose={() => {
              setShowEventDetails(false);
              setSelectedEvent(null);
            }}
            onEdit={handleEditEvent}
            onDelete={handleEventDeleted}
            onShare={handleShareEvent}
          />
        </Popup>
      )}

      {/* Edit Event Popup */}
      {showEditEvent && selectedEvent && (
        <Popup 
          position={popupPosition} 
          onClose={() => {
            setShowEditEvent(false);
            setSelectedEvent(null);
          }}
        >
          <EditEvent
            event={selectedEvent}
            onClose={() => {
              setShowEditEvent(false);
              setSelectedEvent(null);
            }}
            onEventUpdated={(updatedEvent) => {
              handleEventUpdated(updatedEvent);
              setShowEditEvent(false);
              setSelectedEvent(null);
            }}
          />
        </Popup>
      )}

      {/* Share Event Popup */}
      {showShareEvent && selectedEvent && (
        <Popup 
          position={popupPosition} 
          onClose={() => {
            setShowShareEvent(false);
            setSelectedEvent(null);
          }}
        >
          <ShareEvent
            event={selectedEvent}  // Pass event object, not eventId
            onClose={() => {
              setShowShareEvent(false);
              setSelectedEvent(null);
            }}
            onShared={(data) => {
              console.log('Event shared:', data);
              fetchEvents();
            }}
          />
        </Popup>
      )}

      {showNewEvent && calendarId && (
        <NewEvent
          calendarId={calendarId}
          onClose={() => setShowNewEvent(false)}
          onEventCreated={handleEventCreated}
        />
      )}
    </>
  );
}