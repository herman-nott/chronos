import { useState, useEffect } from 'react';

import CheckBox from '../ui/CheckBox/CheckBox';
import MiniCalendar from '../SmallCalendar/SmallCalendar';
/*import Popup from '../PopUp/PopUp';
import NewEvent from '../PopUp/NewEvent';
import Settings from '../PopUp/Settings';
import NewCalendar from '../PopUp/NewClendar';
import EditCalendar from '../PopUp/EditCalendar';
import InviteUsers from '../PopUp/InviteUsers';
import ManageMembers from '../PopUp/ManageMembers';*/

import PopupController from '../PopUp/PopUpController';

import './LeftSide.css';

const LeftSide = ({ onDataCreated, onDaySelect, onCalendarVisibilityChange }) => {
  const [myCalendarsOpen, setMyCalendarsOpen] = useState(true);
  const [otherCalendarsOpen, setOtherCalendarsOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const [myCalendars, setMyCalendars] = useState([]);
  const [otherCalendars, setOtherCalendars] = useState([]);

  const [popup, setPopup] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 200, y: 120 });

  const [visibleCalendars, setVisibleCalendars] = useState({});

  const [menuCalendarId, setMenuCalendarId] = useState(null);
  const [editingCalendar, setEditingCalendar] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [inviteCalendarId, setInviteCalendarId] = useState(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuCalendarId) {
        const menuEl = document.getElementById(`calendar-menu-${menuCalendarId}`);
        if (menuEl && !menuEl.contains(event.target)) {
          setMenuCalendarId(null);
          setShowMenu(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuCalendarId]);

  const openPopup = (view, e, extra = {}) => {
    const rect = e.target.getBoundingClientRect();

    setPopup(view);
    setPopupPosition({ x: rect.right + 10, y: rect.top });
    setInviteCalendarId(extra.calendarId ?? null);
    setEditingCalendar(extra.editingCalendar ?? null);
    setShowMenu(false);
  };

  const openCalendarMenu = (calendarId, e) => {
    e.stopPropagation();
    setMenuCalendarId(calendarId);
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

  const handleDeleteCalendar = (calendarId) => {
    if (!window.confirm("Are you sure you want to delete this calendar?")) return;

    fetch(`http://localhost:3000/api/calendars/${calendarId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete calendar");
        return res.json();
      })
      .then(() => {
        setMyCalendars(prev => prev.filter(c => c._id !== calendarId));
        setOtherCalendars(prev => prev.filter(c => c._id !== calendarId));
        setMenuCalendarId(null);
        setPopup(null);
        setShowMenu(false);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to delete calendar.");
      });
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/calendars", {
      method: "GET",
      credentials: "include",
    })
      .then(async response => response.json())
      .then(data => {
        setMyCalendars(data.myCalendars || []);
        setOtherCalendars(data.otherCalendars || []);

        const visibility = {};
        [...(data.myCalendars || []), ...(data.otherCalendars || [])].forEach(c => {
          visibility[c._id] = c.is_visible ?? true;
        });
        setVisibleCalendars(visibility);
      })
      .catch(err => console.error("Failed to fetch calendars:", err));
  }, []);

  const handleEventCreated = (data) => {
    console.log("EVENT CREATED:", data);
    setPopup(null);
    if (onDataCreated) {
      onDataCreated('event', data);
    }
  };
  
  // When a new calendar is created
  const handleCalendarCreated = (data) => {
    fetch("http://localhost:3000/api/calendars", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(newCalendar => {
        setMyCalendars(prev => [...prev, newCalendar]);
        setPopup(null);
      })
      .catch(err => {
        console.error("Failed to create calendar:", err);
        alert("Failed to create calendar");
      });
  };

  // When a calendar is edited
  const handleCalendarEdited = (updatedData) => {
    if (!editingCalendar) return;

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
      })
      .catch(err => console.error("Failed to update calendar:", err));
    };

  return (
    <div className={`left-side ${collapsed ? 'collapsed' : ''}`}>
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

        <div className="header mt-5">
          <button className="menu-item mr-4" onClick={(e) => openPopup("event", e)}>
            <span className="menu-text gap-1">Create event </span>
            <i className="fa-solid fa-chevron-right white"></i>
          </button>

          <PopupController
            popup={popup}
            position={popupPosition}
            onClose={() => setPopup(null)}
            context={{
              calendarId: inviteCalendarId,
              editingCalendar,
              primaryCalendarId: myCalendars[0]?._id
            }}
            callbacks={{
              onEventCreated: handleEventCreated,
              onCalendarCreated: handleCalendarCreated,
              onCalendarEdited: handleCalendarEdited
            }}
          />

          {/* settings */}
          <button className="mr-4 menu-item" onClick={(e) => openPopup("settings", e)}>
            <i className="fa-solid fa-gear white"></i>
          </button>
        </div>

        <div className="smallCalendar">
          {!collapsed && <MiniCalendar onDaySelect={onDaySelect}/>}
        </div>

        <div className="menu-item gap-2" onClick={(e) => openPopup("calendar", e)}> 
          <span className="menu-text mr-2">Add Calendar</span>
          <i className="fa-solid fa-plus transition-transform white"></i>
        </div>

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
                          const newVisibility = {
                            ...visibleCalendars,
                            [calendar._id]: !visibleCalendars[calendar._id]
                          };
                          setVisibleCalendars(newVisibility);
                          if (onCalendarVisibilityChange) {
                            onCalendarVisibilityChange(newVisibility);
                          }
                        }}
                      />
                      {/* Only show menu for non-primary calendars */}
                      {calendar._id !== myCalendars[0]?._id && (
                        <div style={{display: 'flex', position: 'relative'}}>
                          <i
                            className="fa-solid fa-ellipsis-vertical calendar-arrow pointer"
                            onClick={(e) => {openCalendarMenu(calendar._id, e); setShowMenu(!showMenu)}}
                          ></i>
                          {menuCalendarId === calendar._id && showMenu && (
                            <div
                              id={`calendar-menu-${menuCalendarId}`}
                              style={{position: 'absolute', zIndex: 1000, marginLeft: '1rem'}}
                            >
                              <div className="calendar-menu">
                                <div 
                                  className="calendar-menu-item" 
                                  onClick={(e) => {
                                    handleEditCalendar(calendar, e);
                                    setMenuCalendarId(null);
                                  }}
                                >
                                  Edit calendar
                                </div>

                                <div 
                                  className="calendar-menu-item" 
                                  onClick={(e) => {
                                    openPopup('invite', e, { calendarId: calendar._id });
                                    setMenuCalendarId(null); 
                                  }}
                                >
                                  Invite people
                                </div>

                                <div 
                                  className="calendar-menu-item"
                                  onClick={(e) => {
                                    openPopup('manage-members', e, { calendarId: calendar._id });
                                    setMenuCalendarId(null);
                                  }}
                                >
                                  Manage members
                                </div>

                                <div 
                                  className="calendar-menu-item delete"
                                  onClick={() => handleDeleteCalendar(menuCalendarId)}
                                >
                                  Delete calendar
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
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
                        id={`other-${calendar._id}`}
                        color={calendar.color}
                        checked={visibleCalendars[calendar._id]}
                        onChange={() => {
                          const newVisibility = {
                            ...visibleCalendars,
                            [calendar._id]: !visibleCalendars[calendar._id]
                          };
                          setVisibleCalendars(newVisibility);
                          if (onCalendarVisibilityChange) {
                            onCalendarVisibilityChange(newVisibility);
                          }
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