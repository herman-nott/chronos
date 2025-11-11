import Button from '../ui/Button/Button';
import SearchView from '../ui/SearchView/SearchView';
import CalendarSidebar from '../LeftSide/LeftSide';
import BigCalendar from '../BigCalendar/BigCalendar';
import React, { useState } from 'react';
import './Calendar.css';

import WeekView from '../BigCalendar/WeekCalendar'
import DayView from '../BigCalendar/DayCalendar'
import MonthView from '../BigCalendar/MonthCalendar'

export default function Calendar() {
  const [view, setSelectedView] = useState('Week');

    const renderView = () => {
  switch (view) {
    case "Day":
      return <DayView />;
    case "Month":
      return <MonthView />;
    case "Year":
      return <YearView />;
    case "Week":
      return <WeekView />;
    default:
      return <WeekView />;
  }
};
  return (
    <>
      {/* <Helmet>
        <title>Weekly Calendar View | Calendar Pro</title>
      </Helmet> */}
        <div className="calendar-main">
          <div className="calendar-layout">
            <CalendarSidebar />

            <div className="calendar-content">

              <div className="calendar-toolbar">
                <div className="toolbar-left">
                  <i className="fa-solid fa-chevron-left"></i>
                  <Button text="Today" onClick={() => {}} />
                  <i className="fa-solid fa-chevron-right"></i>
                </div>

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
                <BigCalendar view={view}>
                  {renderView()}
                </BigCalendar>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};