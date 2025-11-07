import React, { useState } from 'react';
import CheckBox from '../ui/CheckBox/CheckBox';
import MiniCalendar from '../SmallCalendar/SmallCalendar';

const LeftSide = () => {
  const [myCalendarsOpen, setMyCalendarsOpen] = useState(true);
  const [otherCalendarsOpen, setOtherCalendarsOpen] = useState(true);

  return (
    <div className="w-full lg:w-[400px] lg:flex-shrink-0 mb-7 lg:mb-0">
      <div className="flex flex-col gap-2 w-full p-4 lg:p-0">
        {/* Header Section Container */}
        <div className="w-full">
          <header className="flex flex-col lg:flex-row justify-start lg:justify-start items-start w-full gap-4 lg:gap-0 mb-2">
            {/* Menu Item - Hidden on mobile, shown on larger screens */}
            <div className="hidden lg:flex items-center justify-start bg-gradient-to-r from-white/30 to-gray-200/30 rounded-base px-1 py-1 shadow-md">
              <img 
                src="/images/img_icon.svg" 
                alt="Menu icon"
                className="w-[24px] h-[24px]"
              />
              <span className="text-md font-normal leading-lg text-white ml-3">
                Create
              </span>
              <img 
                src="/images/img_icon_gray_100_01.svg" 
                alt="Additional icon"
                className="w-[24px] h-[24px] ml-9"
              />
            </div>
          </header>
        </div>

        {/* Mini Calendar Container */}
        <MiniCalendar 
          month="Month 2000"
          width="w-full max-w-[304px] lg:max-w-none"
          height="h-[254px]"
        />
        
        {/* Calendar Lists Container */}
        <div className="w-full">
          <div className="flex flex-col gap-6 w-full">
            {/* My Calendars */}
            <div className="flex flex-col gap-1 justify-start items-start w-full px-3 lg:px-3">
              <div 
                className="flex justify-between items-center w-full cursor-pointer px-2"
                onClick={() => setMyCalendarsOpen(!myCalendarsOpen)}
              >
                <span className="text-lg font-normal leading-2xl text-white">
                  My calendars   
                </span>
                <img 
                  src="/images/img_arrow_down.svg" 
                  alt="Toggle my calendars"
                  className={`w-[24px] h-[24px] transition-transform ${myCalendarsOpen ? 'rotate-0' : 'rotate-180'}`}
                />
              </div>
              
              {myCalendarsOpen && (
                <>
                  <div className="flex justify-between items-start w-full pl-2">
                    <CheckBox 
                      text="main"
                      layout_gap="16px"
                      padding="6px"
                      layout_width="auto"
                      position="relative"
                      margin="0"
                      checked={false}
                      onChange={() => {}}
                      className=""
                      size="md"
                      id="main-calendar"
                    />
                    <img 
                      src="/images/img_frame_16.svg" 
                      alt="Options"
                      className="w-[4px] h-[4px] mt-2"
                    />
                  </div>
                  
                  <div className="flex justify-between items-start w-full pl-2 py-1">
                    <CheckBox 
                      text="KHPI"
                      layout_gap="16px"
                      margin="8px"
                      layout_width="auto"
                      position="relative"
                      padding="6px"
                      checked={false}
                      onChange={() => {}}
                      className=""
                      size="md"
                      id="khpi-calendar"
                    />
                    <img 
                      src="/images/img_frame_16.svg" 
                      alt="Options"
                      className="w-[4px] h-[4px]"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Other Calendars */}
            <div className="flex flex-col gap-1 justify-start items-start w-full px-3 lg:px-3">
              <div 
                className="flex justify-between items-center w-full cursor-pointer px-2"
                onClick={() => setOtherCalendarsOpen(!otherCalendarsOpen)}
              >
                <span className="text-lg font-normal leading-2xl text-white">
                  Other calendars   
                </span>
                <img 
                  src="/images/img_arrow_down.svg" 
                  alt="Toggle other calendars"
                  className={`w-[24px] h-[24px] transition-transform ${otherCalendarsOpen ? 'rotate-0' : 'rotate-180'}`}
                />
              </div>
              
              {otherCalendarsOpen && (
                <>
                  <div className="flex justify-between items-start w-full pl-2">
                    <CheckBox 
                      text="Feiertage"
                      layout_gap="16px"
                      padding="6px"
                      layout_width="auto"
                      position="relative"
                      margin="0"
                      checked={false}
                      onChange={() => {}}
                      className=""
                      size="md"
                      id="feiertage-calendar"
                    />
                    <img 
                      src="/images/img_frame_16.svg" 
                      alt="Options"
                      className="w-[4px] h-[4px] mt-2"
                    />
                  </div>
                  
                  <div className="flex justify-start items-start w-full pl-2 py-1">
                    <div className="flex justify-start items-center self-center flex-1 px-2">
                      <div className="flex justify-center w-[24px] h-[24px]">
                        <div className="w-[18px] h-[18px] bg-primary-dark rounded-xs relative">
                          <img 
                            src="/images/img_check_small.svg" 
                            alt="Checked"
                            className="absolute inset-0 w-[24px] h-[24px]"
                          />
                        </div>
                      </div>
                      <span className="text-lg font-normal leading-2xl text-white ml-3">
                        teams
                      </span>
                    </div>
                    <img 
                      src="/images/img_frame_16.svg" 
                      alt="Options"
                      className="w-[4px] h-[4px]"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSide;