import Button from '../ui/Button/Button';
import SearchView from '../ui/SearchView/SearchView';
import CalendarSidebar from '../LeftSide/LeftSide';
import BigCalendar from '../BigCalendar/BigCalendar';
import React, { useState } from 'react';
import './Calendar.css';

import WeekView from '../BigCalendar/WeekCalendar'
import DayView from '../BigCalendar/DayCalendar'
import MonthView from '../BigCalendar/MonthCalendar'
import YearView from '../BigCalendar/YearCalendar'
import TodayView from '../BigCalendar/Today';

export default function Calendar() {
  const [view, setSelectedView] = useState('Week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const [currentInfo, setCurrentInfo] = useState({
    year: null,
    month: null,
    day: null
  });

  const renderView = () => {
    const commonProps = { onDateChange: setCurrentInfo, currentDate };
    switch (view) {
      case "Today":
        return <TodayView {...commonProps} />;
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

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

const handlePrev = () => {
  switch(view) {
    case 'Day':
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
      break;
    case 'Week':
      setCurrentDate(prev => new Date(prev.getFullYear(),  prev.getMonth(), prev.getDate() - 7));
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


const handleDayClick = (day) => {
  onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
};

  return (
    <>
        <div className="calendar-main">
          <div className="calendar-layout">
            <CalendarSidebar />

            <div className="calendar-content">

              <div className="calendar-toolbar">
                  <Button text="Today" onClick={() => setSelectedView('Day')} className="view-btn" />
                <div className="toolbar-left">
                  <i className="fa-solid fa-chevron-left calendar-arrow" onClick={() => handlePrev()}></i>
                  <i className="fa-solid fa-chevron-right calendar-arrow" onClick={() => handleNext()}></i>
                </div>
                
                <span>
                  {currentInfo.year && currentInfo.month !== null
                    ? `${currentInfo.day ? currentInfo.day + " " : ""} ${months[currentInfo.month]} ${currentInfo.year}`
                    : "Loading..."}
                </span>
                <div className="toolbar-center">
                  <Button text="Day" onClick={() => setSelectedView('Day')} className="view-btn" />
                  <Button text="Week" onClick={() => setSelectedView('Week')} className="view-btn"/>
                  <Button text="Month" onClick={() => setSelectedView('Month')} className="view-btn"/>
                  <Button text="Year" onClick={() => setSelectedView('Year')} className="view-btn"/>
                </div>

                <div className="toolbar-right">
                  <SearchView placeholder="Search" />
                </div>
              </div>
              <div className="big-calendar">
                {/* <BigCalendar view={view}> */}
                 <BigCalendar>
                  {renderView()}
                </BigCalendar>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};