import React, { useState } from 'react';
import CheckBox from '../ui/CheckBox/CheckBox';
import MiniCalendar from '../SmallCalendar/SmallCalendar';
import './LeftSide.css';

const LeftSide = () => {
  const [myCalendarsOpen, setMyCalendarsOpen] = useState(true);
  const [otherCalendarsOpen, setOtherCalendarsOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [isCheked, setCheck] = useState(false);
  
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
        {/* Header Section */}
        <logo><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g data-name="World Earth day"><path d="M58 10h-1V8a4 4 0 0 0-8 0v2h-6V8a4 4 0 0 0-8 0v2h-6V8a4 4 0 0 0-8 0v2h-6V8a4 4 0 0 0-8 0v2H6a6.006 6.006 0 0 0-6 6v38a6.006 6.006 0 0 0 6 6h52a6.006 6.006 0 0 0 6-6V16a6.006 6.006 0 0 0-6-6zm-7-2a2 2 0 0 1 4 0v6a2 2 0 0 1-4 0zM37 8a2 2 0 0 1 4 0v6a2 2 0 0 1-4 0zM23 8a2 2 0 0 1 4 0v6a2 2 0 0 1-4 0zM9 8a2 2 0 0 1 4 0v6a2 2 0 0 1-4 0zm-3 4h1v2a4 4 0 0 0 8 0v-2h6v2a4 4 0 0 0 8 0v-2h6v2a4 4 0 0 0 8 0v-2h6v2a4 4 0 0 0 8 0v-2h1a4 4 0 0 1 4 4v6H2v-6a4 4 0 0 1 4-4zm52 46H6a4 4 0 0 1-4-4V24h60v30a4 4 0 0 1-4 4z" style="fill:#202023"/><path d="M32 27a14 14 0 1 0 14 14 14.049 14.049 0 0 0-14-14zm11.027 18.726A34.391 34.391 0 0 1 39.8 42.64a4.106 4.106 0 0 1-1.044-3.19 1.046 1.046 0 0 1 .663-.781A6.8 6.8 0 0 0 42.5 35.2a11.954 11.954 0 0 1 .529 10.525zM32 29a11.929 11.929 0 0 1 2.615.3C32.144 30.266 31 32.08 31 34.928a2.343 2.343 0 0 1-1.74 2.205 2.507 2.507 0 0 1-2.892-.987 4.853 4.853 0 0 0-4.043-2.215A11.979 11.979 0 0 1 32 29zm-9.708 19.025a4.878 4.878 0 0 0 4.185-1.725A2.843 2.843 0 0 1 29 44.918a2.9 2.9 0 0 1 2.058 2.054 31.839 31.839 0 0 0 2.84 5.862 11.817 11.817 0 0 1-11.61-4.809zm13.693 4.28a24.59 24.59 0 0 1-3.047-6.027 4.842 4.842 0 0 0-3.628-3.336 4.713 4.713 0 0 0-4.41 2.132c-1 1.29-3.018.977-3.866.773a11.888 11.888 0 0 1 .026-9.747 3.108 3.108 0 0 1 3.655 1.176 4.46 4.46 0 0 0 3.72 1.99 4.8 4.8 0 0 0 1.415-.217A4.29 4.29 0 0 0 33 34.928c0-2.394.822-3.883 4.911-4.358a12.091 12.091 0 0 1 3.238 2.683c-.413 1.12-1.343 3.1-2.484 3.564a3.046 3.046 0 0 0-1.853 2.163 6.027 6.027 0 0 0 1.472 4.964 38.13 38.13 0 0 0 3.771 3.583 12.038 12.038 0 0 1-6.07 4.778z" style="fill:#202023"/></g></svg></logo>
        <div className="header mt-5 gap-2">
          <div className="menu-item mr-4">
            <span className="menu-text gap-1">Create</span>
            <i className="fa-solid fa-chevron-right"></i>
          </div>
            <i className="fa-solid fa-gear menu-item"></i>
        </div>

        {/* Mini Calendar */}
        <div className="smallCalendar">
          {!collapsed && <MiniCalendar />}
        </div>

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
              {/* Заменить на запрос из базы */}
              {myCalendarsOpen && (
                <>
                  <div className="calendar-item">
                    <CheckBox text="main" onChange={() => {}} id="main-calendar"/>
                    <i className="fa-solid fa-ellipsis-vertical calendar-arrow"></i>
                  </div>
                  <div className="calendar-item">
                    <CheckBox text="KHPI" onChange={() => {}}  id="khpi-calendar"/>
                    <i className="fa-solid fa-ellipsis-vertical calendar-arrow"></i>
                  </div>
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
                  <div className="calendar-item">
                    {/* Добавить апі + брать с дб  */}
                    <CheckBox text="Feiertage" onChange={() => {}} id="feiertage-calendar"/>
                    <i className="fa-solid fa-ellipsis-vertical calendar-arrow"></i>
                  </div>
                   <div className="calendar-item">
                    <CheckBox text="Свята" onChange={() => {}}  id="feiertage-calendar"/>
                    <i className="fa-solid fa-ellipsis-vertical calendar-arrow"></i>
                  </div>
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
