import React, { useState } from "react";
import "./NewEvent.css";

export default function NewEvent({ calendarId, onClose, onEventCreated }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [reminder, setReminder] = useState(10); // minutes before
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title || !start || !end) {
      return alert("Title & Time required");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:3000/api/events/${calendarId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          description,
          start_time: start,
          end_time: end,
          location,
          reminders: [reminder],
          is_all_day: allDay
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      const data = await response.json();
      
      // Notify parent component that event was created
      if (onEventCreated) {
        onEventCreated(data.event);
      }

      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="event-popup">
      {/* Header */}
      <div className="popup-header">
        <h3>Create Event</h3>
        <i className="fa-solid fa-xmark close-icon" onClick={onClose}></i>
      </div>

      <div className="popup-row">
        <input
          type="text"
          placeholder="Add title *"
          className="input-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
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
          onChange={(e) => setReminder(Number(e.target.value))}
        />
      </div>

      <button 
        className="create-btn" 
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}