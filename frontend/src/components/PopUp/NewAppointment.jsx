import React, { useState } from "react";
import "./NewEvent.css";

export default function NewAppointment({ calendarId, onClose, onAppointmentCreated }) {
  const [form, setForm] = useState({
    title: "",
    start: "",
    end: "",
    location: "",
    description: "",
    guests: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const parseGuests = () => {
    return form.guests
      .split(",")
      .map((g) => g.trim())
      .filter((v) => v);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.start || !form.end) {
      return alert("Title, start time and end time are required.");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/calendars/${calendarId}/appointments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: form.title,
            start_time: form.start,
            end_time: form.end,
            location: form.location,
            description: form.description,
            participants: parseGuests(),
            reminders: [],
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create appointment");

      if (onAppointmentCreated) onAppointmentCreated(data.appointment);
      onClose();
    } catch (err) {
      alert("Failed to create appointment: " + err.message);
      console.error(err);
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
          placeholder="Title *"
          className="input-title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />
      </div>

      <div className="popup-row">
        <label>Start</label>
        <input
          type="datetime-local"
          value={form.start}
          onChange={(e) => update("start", e.target.value)}
        />
      </div>

      <div className="popup-row">
        <label>End</label>
        <input
          type="datetime-local"
          value={form.end}
          onChange={(e) => update("end", e.target.value)}
        />
      </div>

      <div className="popup-row">
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
        />
      </div>

      <div className="popup-row">
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      <div className="popup-row">
        <label>Guests (emails, comma separated)</label>
        <input
          type="text"
          placeholder="example@mail.com, anna@mail.com"
          value={form.guests}
          onChange={(e) => update("guests", e.target.value)}
        />
      </div>

      <button
        className="create-btn"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
