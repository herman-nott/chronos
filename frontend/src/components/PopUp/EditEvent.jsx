import React, { useState } from "react";
import "./NewEvent.css";

export default function EditEvent({ event, onClose, onEventUpdated }) {
  const [title, setTitle] = useState(event.title || "");
  const [category, setCategory] = useState(event.category || "arrangement");
  
  // Arrangement fields
  const [startTime, setStartTime] = useState(
    event.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : ""
  );
  const [endTime, setEndTime] = useState(
    event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : ""
  );
  const [location, setLocation] = useState(event.location || "");
  const [participants, setParticipants] = useState(
    event.participants?.join(", ") || ""
  );

  // Reminder fields
  const [reminderTime, setReminderTime] = useState(
    event.reminder_time ? new Date(event.reminder_time).toISOString().slice(0, 16) : ""
  );

  // Task fields
  const [dueDate, setDueDate] = useState(
    event.due_date ? new Date(event.due_date).toISOString().slice(0, 16) : ""
  );
  const [isCompleted, setIsCompleted] = useState(event.is_completed || false);

  // Common fields
  const [description, setDescription] = useState(event.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title) {
      return alert("Title is required");
    }

    // Category-specific validation
    if (category === "arrangement" && (!startTime || !endTime)) {
      return alert("Start time and end time are required for arrangements");
    }
    if (category === "reminder" && !reminderTime) {
      return alert("Reminder time is required for reminders");
    }
    if (category === "task" && !dueDate) {
      return alert("Due date is required for tasks");
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        title,
        category,
        description,
      };

      // Add category-specific fields
      if (category === "arrangement") {
        updateData.start_time = new Date(startTime).toISOString();
        updateData.end_time = new Date(endTime).toISOString();
        updateData.location = location;
        updateData.participants = participants
          .split(",")
          .map(p => p.trim())
          .filter(p => p);
      } else if (category === "reminder") {
        updateData.reminder_time = new Date(reminderTime).toISOString();
      } else if (category === "task") {
        updateData.due_date = new Date(dueDate).toISOString();
        updateData.is_completed = isCompleted;
      }

      const response = await fetch(`http://localhost:3000/api/events/${event._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update event");
      }

      const updatedEvent = await response.json();
      
      if (onEventUpdated) onEventUpdated(updatedEvent);
      onClose();
    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="event-popup" onClick={(e) => e.stopPropagation()}>
      <div className="popup-header">
        <h3>Edit Event</h3>
        <i className="fa-solid fa-xmark close-icon" onClick={onClose}></i>
      </div>

      <div className="popup-row">
        <label>Title *</label>
        <input
          type="text"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="popup-row">
        <label>Category *</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="arrangement">Arrangement</option>
          <option value="reminder">Reminder</option>
          <option value="task">Task</option>
        </select>
      </div>

      {category === "arrangement" && (
        <>
          <div className="popup-row">
            <label>Start Time *</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="popup-row">
            <label>End Time *</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <div className="popup-row">
            <label>Location</label>
            <input
              type="text"
              placeholder="Add location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="popup-row">
            <label>Participants (comma-separated emails)</label>
            <input
              type="text"
              placeholder="email1@example.com, email2@example.com"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
            />
          </div>
        </>
      )}

      {category === "reminder" && (
        <div className="popup-row">
          <label>Reminder Time *</label>
          <input
            type="datetime-local"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>
      )}

      {category === "task" && (
        <>
          <div className="popup-row">
            <label>Due Date *</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="popup-row">
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
              />
              Mark as completed
            </label>
          </div>
        </>
      )}

      <div className="popup-row">
        <label>Description</label>
        <textarea
          placeholder="Add description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
        />
      </div>

      <button
        className="create-btn"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Updating..." : "Update Event"}
      </button>
    </div>
  );
}