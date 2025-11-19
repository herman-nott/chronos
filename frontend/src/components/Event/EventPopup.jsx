import React, { useState } from "react";
import "./NewEvent.css";

export default function EventPopup({newEvent}) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [reminder, setReminder] = useState(10); // minutes before

    onCreate({
      title,
      description,
      start_time: start,
      end_time: end,
      location,
      reminders: [reminder],
      is_all_day: allDay
    });

  };

  return (
    <div className="event-popup">
      {/* Header */}
      <div className="popup-header">
        
        <i className="fa-solid fa-xmark close-icon" onClick={onClose}></i>
      </div>

      <div className="popup-content">
        <h3>{newEvent.title}</h3>
        <span>newEvent.start_time</span>
      </div>

      <div className="popup-row">
        <label>Start</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>

      <div className="popup-row">
        <label>End</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>

      <div className="popup-row checkbox-row">
        <input
          type="checkbox"
          checked={allDay}
          onChange={(e) => setAllDay(e.target.checked)}
        />
        <span>All day</span>
      </div>

      <div className="popup-row">
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="popup-row">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="popup-row">
        <label>Reminder (min)</label>
        <input
          type="number"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
        />
      </div>

      <button className="create-btn" onClick={handleSubmit}>
        Save
      </button>
    </div>
  );
}
