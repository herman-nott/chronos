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

import { useSettings } from "../SettingsContext/SettingsContext";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const q = query.toLowerCase();

    const results = allEvents
      .filter(e => e.title?.toLowerCase().includes(q))
      .slice(0, 10);

    setSearchResults(results);
  };

  // const [userSettings, setUserSettings] = useState(null);

  // useEffect(() => {
  //   fetch("http://localhost:3000/api/auth/me", { credentials: "include" })
  //     .then(res => res.json())
  //     .then(user => {        
  //       if (user && user._id) {
  //         setUserSettings({
  //           country: user.country,
  //           timeFormat: user.time_format
  //         });
  //       }
  //     })
  //     .catch(() => {});
  // }, []);

  const { settings } = useSettings();

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
          // await createDefaultCalendar();
        }
      } catch (error) {
        console.error('Error fetching calendars:', error);
        setError('Failed to load calendars. Please check your connection.');
      }
    };

    fetchCalendars();
  }, []);

  // создание дефолтного календаря -- проверить, вызывает ли создание двух на рыло
  // const createDefaultCalendar = async () => {
  //   try {
  //     const response = await fetch('http://localhost:3000/api/calendars', {
  //       method: 'POST',
  //       headers: { 
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify({
  //         title: 'My Calendar',
  //         color: '#2196F3'
  //       })
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to create calendar');
  //     }

  //     const data = await response.json();
  //     setCalendarId(data._id);
  //   } catch (error) {
  //     console.error('Error creating calendar:', error);
  //     setError('Failed to create calendar. Please try again.');
  //   }
  // };

  // фетч ВСЁ
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // First, get all calendars (for colors and metadata)
      const calResponse = await fetch('http://localhost:3000/api/calendars', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (!calResponse.ok) {
        throw new Error('Failed to fetch calendars');
      }

      const calData = await calResponse.json();
      const allCalendars = [...(calData.myCalendars || []), ...(calData.otherCalendars || [])];
      setCalendars(allCalendars);

      // Get all events for user (includes shared events)
      const eventsResponse = await fetch('http://localhost:3000/api/events', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (!eventsResponse.ok) {
        throw new Error('Failed to fetch events');
      }

      const allEvents = await eventsResponse.json();
      
      // Map events to include calendarId for filtering
      const eventsWithCalendarId = allEvents.map(event => ({
        ...event,
        calendarId: event.calendar_id
      }));
      
      setAllEvents(eventsWithCalendarId);
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
      calendars: calendars,
      settings: settings,
      onDataCreated: handleDataCreated,
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
        return <YearView {...commonProps} DaySelect={handleSmallCalendarDaySelect} />;
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
              

              <div className="toolbar-left">
                <Button  className="view-btn" text="Today" onClick={handleToday} />

              <span className="toolbar-month">
                {currentInfo.year && currentInfo.month !== null
                  ? `${currentInfo.day ? currentInfo.day + " " : ""} ${months[currentInfo.month]} ${currentInfo.year}`
                  : "Loading..."}
              </span>

                <div style={{display: 'flex'}}>
                <i className="fa-solid fa-chevron-left black " onClick={handlePrev}></i>
                <i className="fa-solid fa-chevron-right black" onClick={handleNext}></i>
                </div>
              </div>
              

              <div className="toolbar-center">
                <Button className="view-btn" text="Day" onClick={() => setSelectedView('Day')} />
                <Button className="view-btn" text="Week" onClick={() => setSelectedView('Week')} />
                <Button className="view-btn" text="Month" onClick={() => setSelectedView('Month')} />
                <Button className="view-btn" text="Year" onClick={() => setSelectedView('Year')} />
                  
                <div className="toolbar-right">
                  <div style={{ position: "relative" }}>
                    <SearchView
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />

                    {searchResults.length > 0 && (
                      <div style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "white",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        maxHeight: "200px",
                        overflowY: "auto",
                        zIndex: 999,
                        borderRadius: "4px",
                        padding: "0.5em"
                      }}>
                        {searchResults.map(ev => (
                          <div
                            key={ev._id}
                            style={{
                              padding: "0.4em 0.6em",
                              cursor: "pointer",
                              borderRadius: "4px"
                            }}
                            onClick={() => {
                              setSelectedEvent(ev);
                              setSearchResults([]);
                              setSearchQuery(ev.title);
                            }}
                          >
                            {ev.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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

      {selectedEvent && (
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