import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Button from '../ui/Button/Button';
import SearchView from '../ui/SearchView/SearchView';
import CalendarSidebar from '../LeftSide/LeftSide';

const Calendar = () => {
  const [selectedView, setSelectedView] = useState('Week');
  // State to track selected grid cells - using timeSlot-dayIndex as keys
  const [selectedCells, setSelectedCells] = useState(new Set());

  // Function to handle cell clicks
  const handleCellClick = (timeSlot, dayIndex) => {
    const cellKey = `${timeSlot}-${dayIndex}`;
    setSelectedCells(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(cellKey)) {
        newSet?.delete(cellKey);
      } else {
        newSet?.add(cellKey);
      }
      return newSet;
    });
  };

  // Function to render grid blocks for each time slot
  const renderTimeBlocks = (timeSlot) => {
    const days = 7; // Sunday to Saturday
    const blocks = [];
    
    for (let dayIndex = 0; dayIndex < days; dayIndex++) {
      const cellKey = `${timeSlot}-${dayIndex}`;
      const isSelected = selectedCells?.has(cellKey);
      
      blocks?.push(
        <div
          key={dayIndex}
          className={`flex-1 h-[72px] border border-gray-200 cursor-pointer transition-colors duration-200 ${
            isSelected ? 'bg-pink-400' : 'bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={() => handleCellClick(timeSlot, dayIndex)}
        />
      );
    }
    
    return (
      <div className="flex w-full max-w-[1012px] ml-4">
        {blocks}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Weekly Calendar View | Calendar Pro - Advanced Schedule Management</title>
        <meta 
          name="description" 
          content="Manage your weekly schedule with Calendar Pro's advanced weekly view. View appointments from 7 AM to 4 PM across seven days, manage multiple calendars, and stay organized with our intuitive interface." 
        />
        <meta property="og:title" content="Weekly Calendar View | Calendar Pro - Advanced Schedule Management" />
        <meta property="og:description" content="Manage your weekly schedule with Calendar Pro's advanced weekly view. View appointments from 7 AM to 4 PM across seven days, manage multiple calendars, and stay organized with our intuitive interface." />
      </Helmet>

      <main 
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/img_.png')" }}
      >
        {/* Main Container - keeps everything left aligned and contained */}
        <div className="container mx-auto px-4 max-w-full">
          <div className="flex flex-col lg:flex-row w-full min-h-screen justify-start items-start">
            {/* Left Sidebar Container */}
            <CalendarSidebar />

            {/* Main Calendar Area Container */}
            <div className="w-full lg:flex-1 relative lg:ml-6">
              {/* Navigation and Controls Container */}
              <div className="w-full bg-white p-4 lg:p-4 mb-8">
                <div className="w-full">
                  <div className="flex flex-col lg:flex-row justify-start items-start gap-4 lg:gap-6">
                    {/* Left Navigation */}
                    <div className="flex justify-start items-center gap-2">
                      <button className="w-[28px] h-[28px] bg-secondary-dark rounded-md flex items-center justify-center">
                        <img 
                          src="/images/img_arrow_left.svg" 
                          alt="Previous"
                          className="w-[20px] h-[20px]"
                        />
                      </button>
                      <Button 
                        text="Today"
                        text_font_size="text-sm"
                        text_color="text-secondary-foreground"
                        fill_background_color="bg-secondary-dark"
                        padding="6px 16px"
                        border_border_radius="8px"
                        layout_width="auto"
                        position="relative"
                        variant="default"
                        size="md"
                        className=""
                        onClick={() => {}}
                      />
                      <button className="w-[28px] h-[28px] bg-secondary-dark rounded-md flex items-center justify-center">
                        <img 
                          src="/images/img_arrow_right_gray_900.svg" 
                          alt="Next"
                          className="w-[20px] h-[20px]"
                        />
                      </button>
                    </div>

                    {/* Center View Controls */}
                    <div className="flex justify-start items-center lg:flex-1">
                      <div className="flex justify-start items-center gap-4">
                        <button 
                          className={`px-4 py-1 text-sm font-medium leading-md transition-colors ${
                            selectedView === 'Day' ?'text-primary-background' :'text-text-muted'
                          }`}
                          onClick={() => setSelectedView('Day')}
                        >
                          Day
                        </button>
                        <Button 
                          text="Week"
                          text_font_size="text-base"
                          text_font_weight="font-medium"
                          text_line_height="leading-md"
                          text_color="text-white"
                          fill_background_color="bg-primary-background"
                          border_border_radius="8px"
                          padding="4px 16px"
                          layout_width="auto"
                          position="relative"
                          variant="default"
                          size="md"
                          className=""
                          onClick={() => {}}
                        />
                        <button 
                          className={`px-4 py-1 text-sm font-medium leading-md transition-colors ${
                            selectedView === 'Month' ?'text-primary-background' :'text-text-muted'
                          }`}
                          onClick={() => setSelectedView('Month')}
                        >
                          Month
                        </button>
                        <button 
                          className={`px-4 py-1 text-sm font-medium leading-md transition-colors ${
                            selectedView === 'Year' ?'text-primary-background' :'text-text-muted'
                          }`}
                          onClick={() => setSelectedView('Year')}
                        >
                          Year
                        </button>
                      </div>
                    </div>

                    {/* Right Search */}
                    <div className="w-full lg:w-auto">
                      <SearchView 
                        placeholder="Search"
                        text_font_size="text-sm"
                        text_color="text-text-disabled"
                        fill_background_color="bg-secondary-dark"
                        border_border_radius="rounded-sm"
                        layout_gap="8px"
                        padding="4px 12px 4px 32px"
                        layout_width="100%"
                        position="relative"
                        value=""
                        onChange={() => {}}
                        onFocus={() => {}}
                        onBlur={() => {}}
                        className=""
                        size="md"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Grid Container */}
              <div className="w-full px-4 lg:px-4 mb-8 overflow-x-auto">
              {/* Week Days Section Container */}
            <div className="w-full overflow-x-auto lg:overflow-x-visible">
              <div className="flex flex-row min-w-max lg:min-w-0">
                {/* Sunday */}
                <div className="flex flex-col justify-start items-start min-w-[80px] lg:min-w-[90px] px-2 py-2 bg-secondary-light shadow-sm">
                  <span className="text-xs font-bold leading-xs text-text-muted">SUN</span>
                  <span className="text-xl font-medium leading-3xl text-text-primary mb-3">21</span>
                </div>

                {/* Monday */}
                <div className="flex flex-col justify-start items-start min-w-[80px] lg:min-w-[90px] px-2 py-2 bg-secondary-background shadow-sm border-l border-gray-200">
                  <span className="text-xs font-bold leading-xs text-text-muted">MON</span>
                  <span className="text-xl font-medium leading-3xl text-text-primary mb-3">22</span>
                </div>

                {/* Tuesday */}
                <div className="flex flex-col justify-start items-start min-w-[80px] lg:min-w-[90px] px-2 py-2 bg-secondary-background shadow-sm border-l border-gray-200">
                  <span className="text-xs font-bold leading-xs text-text-muted">TUE</span>
                  <span className="text-xl font-medium leading-3xl text-text-primary mb-3">23</span>
                </div>

                {/* Wednesday */}
                <div className="flex flex-col justify-start items-start min-w-[80px] lg:min-w-[90px] px-2 py-2 bg-secondary-background shadow-sm border-l border-gray-200">
                  <span className="text-xs font-bold leading-xs text-text-muted">WED</span>
                  <span className="text-xl font-medium leading-3xl text-text-primary mb-3">24</span>
                </div>

                {/* Thursday - Highlighted */}
                <div className="flex flex-col justify-start items-start min-w-[80px] lg:min-w-[90px] px-2 py-2 bg-primary-light shadow-sm border-l border-gray-200">
                  <span className="text-xs font-bold leading-xs text-text-muted">THU</span>
                  <span className="text-xl font-medium leading-3xl text-text-primary mb-3">25</span>
                </div>

                {/* Friday */}
                <div className="flex flex-row justify-start items-center min-w-[80px] lg:min-w-[90px] px-2 py-4 bg-secondary-background shadow-sm border-l border-gray-200">
                  <span className="text-xl font-medium leading-3xl text-text-primary">26</span>
                </div>

                {/* Saturday */}
                <div className="flex flex-col justify-start items-start min-w-[80px] lg:min-w-[90px] px-2 py-2 bg-secondary-light shadow-sm border-l border-gray-200">
                  <span className="text-xs font-bold leading-xs text-text-muted">SAT</span>
                  <span className="text-xl font-medium leading-3xl text-text-primary mb-3">27</span>
                </div>
              </div>
            </div>
                <div className="flex flex-col justify-start items-start w-full min-w-[800px]">
                  {/* 7 AM */}
                  <div className="flex justify-start items-start w-full">
                    <span className="text-sm font-medium leading-sm text-text-muted min-w-[48px] text-left">7 AM</span>
                    {renderTimeBlocks('7AM')}
                  </div>

                  {/* 8 AM */}
                  <div className="flex justify-start items-start w-full">
                    <span className="text-sm font-normal leading-sm text-text-muted min-w-[48px] text-left">8 AM</span>
                    {renderTimeBlocks('8AM')}
                  </div>

                  {/* 9 AM */}
                  <div className="flex justify-start items-start w-full bg-white">
                    <span className="text-sm font-normal leading-sm text-text-muted min-w-[48px] text-left">9 AM</span>
                    {renderTimeBlocks('9AM')}
                  </div>

                  {/* 10 AM */}
                  <div className="flex justify-start items-start w-full">
                    <span className="text-sm font-normal leading-sm text-text-muted min-w-[48px] text-left">10 AM</span>
                    {renderTimeBlocks('10AM')}
                  </div>

                  {/* 11 AM */}
                  <div className="flex justify-start items-start w-full">
                    <span className="text-sm font-normal leading-sm text-text-muted min-w-[48px] text-left">11 AM</span>
                    {renderTimeBlocks('11AM')}
                  </div>

                  {/* 12 PM */}
                  <div className="flex justify-start items-start w-full">
                    <span className="text-sm font-normal leading-sm text-text-muted min-w-[48px] text-left">12 PM</span>
                    {renderTimeBlocks('12PM')}
                  </div>

                  {/* 1 PM */}
                  <div className="flex justify-start items-start w-full">
                    <span className="text-sm font-normal leading-sm text-text-muted min-w-[48px] text-left">1 PM</span>
                    {renderTimeBlocks('1PM')}
                  </div>

                  {/* 2 PM */}
                  <div className="flex justify-start items-start w-full">
                    <span className="text-sm font-normal leading-sm text-text-muted min-w-[48px] text-left">2 PM</span>
                    {renderTimeBlocks('2PM')}
                  </div>

                  {/* 3 PM */}
                  <div className="flex justify-start items-start w-full">
                    <span className="text-sm font-normal leading-base text-text-muted min-w-[48px] text-left">3 PM</span>
                    {renderTimeBlocks('3PM')}
                  </div>

                  {/* 4 PM */}
                  <div className="flex justify-start items-start w-full">
                    <span className="text-sm font-normal leading-base text-text-muted min-w-[48px] text-left">4 PM</span>
                    {renderTimeBlocks('4PM')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Calendar;