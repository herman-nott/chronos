import React from 'react';

const SmallCalendar = ({ 
  month = "November 2025",
  className = "",
  width = "w-full max-w-[304px] lg:max-w-none",
  height = "h-[254px]"
}) => {
  return (
    <div className={`${width} ${className}`}>
      <div className={`relative w-full ${height} mb-6 shadow-lg rounded-xl`}>
        <img 
          src="/images/img_rectangle.png" 
          alt="Calendar background"
          className="absolute inset-0 w-full h-full object-cover rounded-xl"
        />
        
        {/* Calendar Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-xl border border-white/20">
          <div className="flex flex-col justify-start items-start w-full h-full px-5 py-2">
            {/* Calendar Header */}
            <div className="flex justify-between items-start w-full mb-4">
              <div className="flex gap-7 justify-start items-start flex-1">
                <h2 className="text-lg lg:text-lg font-bold leading-4xl text-white">
                  {month}
                </h2>
                <img 
                  src="/images/img_arrow_right.svg" 
                  alt="Next month"
                  className="w-[4px] h-[10px] mt-1"
                />
              </div>
              
              <div className="flex justify-end items-center gap-5 mt-1">
                <img 
                  src="/images/img_vector_3.svg" 
                  alt="Previous"
                  className="w-[4px] h-[10px]"
                />
                <img 
                  src="/images/img_arrow_right.svg" 
                  alt="Next"
                  className="w-[4px] h-[10px]"
                />
              </div>
            </div>

            {/* Day Labels */}
            <div className="flex justify-between items-center w-full mb-1">
              <span className="text-md font-normal leading-xl text-text-light text-center">M</span>
              <span className="text-md font-normal leading-xl text-text-light text-center">Tu</span>
              <span className="text-md font-normal leading-xl text-text-light text-center">W</span>
              <span className="text-md font-normal leading-xl text-text-light text-center">Th</span>
              <span className="text-md font-normal leading-xl text-text-light text-center">F</span>
              <span className="text-md font-normal leading-xl text-text-light text-center">S</span>
              <span className="text-md font-normal leading-xl text-text-light text-center">Su</span>
            </div>

            {/* Calendar Grid */}
            <div className="flex flex-col gap-0 w-full">
              {/* Week 1 */}
              <div className="flex justify-center items-center gap-3 lg:gap-4 w-full">
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white text-center">28</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white text-center">29</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white text-center">30</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white text-center">31</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white text-center">1</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white text-center">2</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white text-center">3</span>
              </div>
              
              {/* Week 2 */}
              <div className="flex justify-between items-center w-full mt-0">
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white self-end">4</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">5</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">6</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">7</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">8</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">9</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">10</span>
              </div>
              
              {/* Week 3 */}
              <div className="flex justify-between items-center w-full mt-0">
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">11</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">12</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">13</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">14</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">15</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">16</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">17</span>
              </div>
              
              {/* Week 4 */}
              <div className="flex justify-between items-center w-full mt-0">
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">18</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">19</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">20</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">21</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">22</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">23</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">24</span>
              </div>
              
              {/* Week 5 */}
              <div className="flex justify-center items-center gap-3 lg:gap-4 w-full mt-0">
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">25</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">26</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">27</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">28</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">29</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">30</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">31</span>
              </div>
              
              {/* Week 6 */}
              <div className="flex justify-between items-center w-full px-2 mt-0">
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">1</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">2</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">3</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">4</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">5</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">6</span>
                <span className="text-lg lg:text-lg font-normal leading-4xl text-white">7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallCalendar;