import React, { useState, useEffect } from 'react';
import CheckBox from '../ui/CheckBox/CheckBox';
import MiniCalendar from '../SmallCalendar/SmallCalendar';
import Popup from '../PopUp/PopUp';
import NewEvent from '../PopUp/NewEvent';
import NewTask from "../PopUp/NewTask";
import NewAppointment from "../PopUp/NewAppointment";
import NewCalendar from '../PopUp/NewClendar';

import './LeftSide.css';

const LeftSide = ({ onDataCreated, onDaySelect }) => {
  const [myCalendarsOpen, setMyCalendarsOpen] = useState(true);
  const [otherCalendarsOpen, setOtherCalendarsOpen] = useState(true);
  const [newCalendarOpen, setNewCalendarOpen] = useState(false);
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  // const [isCheked, setCheck] = useState(false);

  const [myCalendars, setMyCalendars] = useState([]);
  const [otherCalendars, setOtherCalendars] = useState([]);

  const [popup, setPopup] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 200, y: 120 });

  const openPopup = (view, e) => {
    const rect = e.target.getBoundingClientRect();
    setPopup(view);
    setPopupPosition({ x: rect.right + 10, y: rect.top });
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/calendars", {
      method: "GET",
      credentials: "include",
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error("Server error");
        }
        return await response.json();
      })
      .then(data => {
        setMyCalendars(data.myCalendars);
        setOtherCalendars(data.otherCalendars);
      })
      .catch(err => {
        console.error("Failed to load calendars:", err);
      });
  }, []);
  
  return (
    <div className={`left-side ${collapsed ? 'collapsed' : ''}`}>
      {/* Collapse/Expand Button */}
      <button
        className="collapse-btn"
        onClick={() => setCollapsed(!collapsed)}
      >
        <i className={`fa-solid fa-chevron-left ${collapsed ? 'rotate-180' : ''}`}></i>
      </button>

     {!collapsed && (
      <div className="left-side-container">
        <div className='logo'>
          <img src="../src/assets/images/logo.svg" alt='logo' className='logo-pick white'></img>
          <h1>Calendar</h1>
        </div>
        {/* Header Section */}
        <div className="header mt-5">
          <button className="menu-item mr-4" onClick={() => setNewEventOpen(!newEventOpen)}>
            <span className="menu-text gap-1">Create event </span>
            <i className={`fa-solid fa-chevron-right ${newEventOpen ? 'rotate-0' : 'rotate-180'} white`}></i>
          </button>
          {newEventOpen && (
            <ul className='options'>
              <li onClick={(e) => openPopup("event", e)}>Event</li>
              <li onClick={(e) => openPopup("task", e)}>Task</li>
              <li onClick={(e) => openPopup("appointment", e)}>Appointment</li>
            </ul>
          )}

          {popup === "event" && (
            <Popup position={popupPosition} onClose={() => setPopup(null)}>
              <NewEvent
                calendarId={myCalendars[0]?._id}
                onClose={() => setPopup(null)}
                onEventCreated={(data) => {
                  console.log("EVENT CREATED:", data);
                  setPopup(null);
                  // Call generic callback if provided
                  if (onDataCreated) {
                    onDataCreated('event', data);
                  }
                }}
              />
            </Popup>
          )}
          
          {popup === "task" && (
            <Popup position={popupPosition} onClose={() => setPopup(null)}>
              <NewTask
                calendarId={myCalendars[0]?._id}
                onClose={() => setPopup(null)}
                onTaskCreated={(data) => {
                  console.log("TASK CREATED:", data);
                  setPopup(null);
                  if (onDataCreated) {
                    onDataCreated('task', data);
                  }
                }}
              />
            </Popup>
          )}

          {popup === "appointment" && (
            <Popup position={popupPosition} onClose={() => setPopup(null)}>
              <NewAppointment
                calendarId={myCalendars[0]?._id}
                onClose={() => setPopup(null)}
                onAppointmentCreated={(data) => {
                  console.log("APPOINTMENT CREATED:", data);
                  setPopup(null);
                  if (onDataCreated) {
                    onDataCreated('appointment', data);
                  }
                }}
              />
            </Popup>
          )}

          <button className="menu-item mr-4">
            <i className="fa-solid fa-gear"></i>
          </button>
        </div>

        {/* Mini Calendar */}
        <div className="smallCalendar">
          {!collapsed && <MiniCalendar onDaySelect={onDaySelect}/>}
        </div>

        <div className="gap-2"
        onClick={(e) => openPopup("calendar", e)}> 
          <span className="mr-2">Add Calendar</span>
          <i className="fa-solid fa-plus transition-transform white"></i>
        </div>

        {popup === "calendar" && (
          <Popup position={popupPosition} onClose={() => setPopup(null)}>
            <NewCalendar
              onClose={() => setPopup(null)}
              onCreate={(data) => {
                console.log("CALENDAR CREATED:", data);
                // send to backend
                fetch("http://localhost:3000/api/calendars", {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data)
                })
                  .then(res => res.json())
                  .then(newCalendar => {
                    setMyCalendars(prev => [...prev, newCalendar]);
                  });
              }}
            />
          </Popup>
        )}

        {/* Calendar Lists */}
        {!collapsed && (
          <div className="calendar-section">
            {/* My Calendars */}
            <div>
              <div
                className="calendar-header"
                onClick={() => setMyCalendarsOpen(!myCalendarsOpen)}
              >
                <span>My calendars</span>
                <i className={`fa-solid fa-chevron-down transition-transform calendar-arrow ${myCalendarsOpen ? 'rotate-0' : 'rotate-180'}`}></i>
              </div>
              {myCalendarsOpen && (
                <>
                  {myCalendars.map(calendar => (
                    <div className="calendar-item" key={calendar._id}>
                      <CheckBox
                        text={calendar.title}
                        id={`my-${calendar._id}`}
                        onChange={() => {}}
                      />
                      <i className="fa-solid fa-ellipsis-vertical calendar-arrow"></i>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Other Calendars */}
            <div>
              <div
                className="calendar-header"
                onClick={() => setOtherCalendarsOpen(!otherCalendarsOpen)}
              >
                <span>Other calendars</span>
                <i className={`fa-solid fa-chevron-down transition-transform calendar-arrow ${otherCalendarsOpen ? 'rotate-0' : 'rotate-180'}`}></i>
              </div>
              {otherCalendarsOpen && (
                <>
                  {otherCalendars.map(calendar => (
                    <div className="calendar-item" key={calendar._id}>
                      <CheckBox
                        text={calendar.title}
                        id={`other-${calendar._id}`}
                        onChange={() => {}}
                      />
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default LeftSide;