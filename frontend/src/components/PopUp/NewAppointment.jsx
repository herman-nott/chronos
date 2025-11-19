// NewAppointment.jsx
import React, { useState } from "react";
import "./NewEvent.css";

export default function NewAppointment({ calendarId, onClose, onAppointmentCreated }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [guests, setGuests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title || !start || !end) {
      return alert("Required fields missing");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:3000/api/appointments/${calendarId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          start_time: start,
          end_time: end,
          description,
          location,
          participants: guests
            .split(",")
            .map((g) => g.trim())
            .filter((v) => v),
          reminders: []
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create appointment');
      }

      const data = await response.json();
      
      // Notify parent component that appointment was created
      if (onAppointmentCreated) {
        onAppointmentCreated(data.appointment);
      }

      onClose();
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="event-popup">
      <div className="popup-header">
        <h3>Create Appointment</h3>
        <i className="fa-solid fa-xmark close-icon" onClick={onClose}></i>
      </div>

      <div className="popup-row">
        <input
          type="text"
          placeholder="Appointment title *"
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
        <label>Guests (emails, comma separated)</label>
        <input
          type="text"
          placeholder="e.g. john@mail.com, anna@mail.com"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
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