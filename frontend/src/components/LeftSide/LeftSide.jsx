import React, { useState, useEffect } from 'react';
import CheckBox from '../ui/CheckBox/CheckBox';
import MiniCalendar from '../SmallCalendar/SmallCalendar';
import Popup from '../PopUp/PopUp';
import NewEvent from '../PopUp/NewEvent';
import NewTask from "../PopUp/NewTask";
import NewAppointment from "../PopUp/NewAppointment";
import NewCalendar from '../PopUp/NewClendar';
import EditCalendar from '../PopUp/EditCalendar';

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
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const [visibleCalendars, setVisibleCalendars] = useState({});

  const [menuCalendarId, setMenuCalendarId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  
  
  const [editingCalendar, setEditingCalendar] = useState(null);

  const openCalendarMenu = (calendarId, e) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    setMenuCalendarId(calendarId);
    setMenuPosition({ x: rect.right + 5, y: rect.bottom });
  };

  const handleEditCalendar = (calendar, e) => {
    const rect = e.target.getBoundingClientRect();

    setPopupPosition({
      x: rect.right + 5,
      y: rect.top
    });

    setEditingCalendar(calendar);
    setPopup("edit-calendar");
  };

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
      .then(async response => response.json())
      .then(data => {
        setMyCalendars(data.myCalendars);
        setOtherCalendars(data.otherCalendars);

        const visibility = {};
        [...data.myCalendars, ...data.otherCalendars].forEach(c => {
          visibility[c._id] = c.is_visible ?? true;
        });
        setVisibleCalendars(visibility);
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
          <h1>Chronos</h1>
        </div>
        {/* Header Section */}
        <div className="header">
          <button className="menu-item mr-4 gap-2" onClick={(e) => openPopup("event", e)}>
            <span className="menu-text gap-1">Create event</span>
            <i className={`fa-solid fa-chevron-right ${newEventOpen ? 'rotate-0' : 'rotate-180'} white`}></i>
          </button>

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

          {popup === "edit-calendar" && (
            <Popup position={popupPosition} onClose={() => {setMenuCalendarId(null); setPopup(null);}}>
              <EditCalendar
                calendar={editingCalendar}
                onClose={() => setPopup(null)}
                onSave={(updatedData) => {
                  fetch(`http://localhost:3000/api/calendars/${editingCalendar._id}`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedData)
                  })
                    .then(res => res.json())
                    .then(updated => {
                      setMyCalendars(prev =>
                        prev.map(c => (c._id === updated._id ? updated : c))
                      );
                      setPopup(null);
                    });
                }}
              />
            </Popup>
          )}

          <button className="mr-4 menu-item">
            <i className="fa-solid fa-gear white"></i>
          </button>
        </div>

        {/* Mini Calendar */}
        <div className="smallCalendar">
          {!collapsed && <MiniCalendar onDaySelect={onDaySelect}/>}
        </div>

        <div className="menu-item gap-2"
        onClick={(e) => openPopup("calendar", e)}> 
          <span className="menu-text">Add Calendar</span>
          <i className="fa-solid fa-plus transition-transform white ml-3"></i>
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

        {menuCalendarId && (
          <Popup position={menuPosition} onClose={() => setMenuCalendarId(null)}>
            <div className="calendar-menu">
              <div 
                className="calendar-menu-item" 
                onClick={(e) => {
                  const calendar = [...myCalendars, ...otherCalendars].find(c => c._id === menuCalendarId);
                  handleEditCalendar(calendar, e);
                  setMenuCalendarId(null);
                }}
              >
                Edit calendar
              </div>

              <div 
                className="calendar-menu-item" 
                // onClick={() => handleInvite(menuCalendarId)}
              >
                Invite people
              </div>

              <div 
                className="calendar-menu-item delete"
                // onClick={() => handleDeleteCalendar(menuCalendarId)}
              >
                Delete calendar
              </div>
            </div>
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
                        color={calendar.color}
                        checked={visibleCalendars[calendar._id]}
                        onChange={() => {
                          setVisibleCalendars(prev => ({
                            ...prev,
                            [calendar._id]: !prev[calendar._id]
                          }));
                        }}
                      />
                      {calendar._id !== myCalendars[0]?._id && (
                        <i
                          className="fa-solid fa-ellipsis-vertical calendar-arrow"
                          onClick={(e) => openCalendarMenu(calendar._id, e)}
                        ></i>
                      )}
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
                        id={`my-${calendar._id}`}
                        color={calendar.color}
                        checked={visibleCalendars[calendar._id]}
                        onChange={() => {
                          setVisibleCalendars(prev => ({
                            ...prev,
                            [calendar._id]: !prev[calendar._id]
                          }));
                        }}
                      />
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