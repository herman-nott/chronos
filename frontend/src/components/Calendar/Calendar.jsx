import Button from '../ui/Button/Button';
import SearchView from '../ui/SearchView/SearchView';
import CalendarSidebar from '../LeftSide/LeftSide';
import BigCalendar from '../BigCalendar/BigCalendar';
import NewEvent from '../PopUp/NewEvent';
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
  const [allEvents, setAllEvents] = useState([]);
  const [visibleCalendars, setVisibleCalendars] = useState({});
  const [showNewEvent, setShowNewEvent] = useState(false);
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

  // рефетч данных
  const handleDataCreated = (type, data) => {
    fetchEvents();
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
      onEventClick: (event) => console.log('Event clicked:', event),
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
                <i className="fa-solid fa-chevron-left calendar-arrow" onClick={handlePrev}></i>
                <i className="fa-solid fa-chevron-right calendar-arrow" onClick={handleNext}></i>
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