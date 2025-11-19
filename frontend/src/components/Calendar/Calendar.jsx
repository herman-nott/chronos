import Button from '../ui/Button/Button';
import SearchView from '../ui/SearchView/SearchView';
import CalendarSidebar from '../LeftSide/LeftSide';
import BigCalendar from '../BigCalendar/BigCalendar';
import NewEvent from '../PopUp/NewEvent';
import NewTask from '../PopUp/NewTask';
import NewAppointment from '../PopUp/NewAppointment';
import React, { useState, useEffect } from 'react';
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
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [loading, setLoading] = useState({
    events: true,
    tasks: true,
    appointments: true
  });
  const [error, setError] = useState(null);

  // Fetch user's calendars
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

  // Create default calendar if none exists
  const createDefaultCalendar = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/calendar', {
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

  // Fetch events for the selected calendar
  const fetchEvents = async () => {
    if (!calendarId) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/events/${calendarId}`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks for the selected calendar
  const fetchTasks = async () => {
    if (!calendarId) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${calendarId}`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks for the selected calendar
  const fetchAppointments = async () => {
    if (!calendarId) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/appointments/${calendarId}`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchTasks();
    fetchAppointments();
  }, [calendarId]);

  // Handle event creation from toolbar
  const handleEventCreated = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleAppointmentCreated = (newAppointment) => {
    setAppointments([...appointments, newAppointment]);
  };

  // Handle data creation from sidebar (events, tasks, appointments)
  const handleDataCreated = (type, data) => {
    if (type === 'event') {
      fetchEvents();
    } else if (type === 'task') {
      fetchTasks();
    } else if (type === 'appointment') {
      fetchAppointments();
    }
  };

  const renderView = () => {
    const commonProps = { 
      onDateChange: setCurrentInfo, 
      currentDate,
      events,
      tasks,
      appointments,
      onEventClick: (event) => console.log('Event clicked:', event),
      onTaskClick: (task) => console.log('Task clicked:', task),
      onAppointmentClick: (appointment) => console.log('Appointment clicked:', appointment),
      onTimeSlotClick: (date) => {
        setCurrentDate(date);
        // setShowNewEvent(true); -- modals so far are meaningless unless we make up some kind of dropdown menu for these
        // setShowNewTask(true);
        // setShowNewAppointment(true);
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
  };

  if (error) {
    return (
      <div className="calendar-main">
        <div className="calendar-layout">
          <CalendarSidebar onDataCreated={handleDataCreated} />
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

  return (
    <>
      <div className="calendar-main">
        <div className="calendar-layout">
          <CalendarSidebar onDataCreated={handleDataCreated} />

          <div className="calendar-content">
            <div className="calendar-toolbar">
              <Button text="Today" onClick={handleToday} />
              
              <div className="toolbar-left">
                <i className="fa-solid fa-chevron-left calendar-arrow" onClick={handlePrev}></i>
                <i className="fa-solid fa-chevron-right calendar-arrow" onClick={handleNext}></i>
              </div>
              
              <span>
                {currentInfo.year && currentInfo.month !== null
                  ? `${currentInfo.day ? currentInfo.day + " " : ""}${currentInfo.month + 1}/${currentInfo.year}`
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
              {loading.events || loading.tasks || loading.appointments ? (
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

      {showNewTask && calendarId && (
        <NewTask
          calendarId={calendarId}
          onClose={() => setShowNewTask(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {showNewAppointment && calendarId && (
        <NewAppointment
          calendarId={calendarId}
          onClose={() => setShowNewAppointment(false)}
          onAppointmentCreated={handleAppointmentCreated}
        />
      )}
    </>
  );
}