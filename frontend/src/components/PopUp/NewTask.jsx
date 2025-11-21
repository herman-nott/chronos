import React, { useState } from "react";
import "./NewEvent.css";

export default function NewTask({ calendarId, onClose, onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [hasTime, setHasTime] = useState(false);
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [reminder, setReminder] = useState(10);
  const [loading, setLoading] = useState(false);

  function buildDueDate() {
    if (!date) return null;

    if (!hasTime || !time) {
      return `${date}T00:00:00`;
    }

    return `${date}T${time}:00`;
  }

  async function handleSubmit() {
    if (!title || !date) {
      alert("Title and date are required");
      return;
    }

    const dueDate = buildDueDate();

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/calendars/${calendarId}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title,
            description,
            due_date: dueDate,
            reminders: reminder ? [Number(reminder)] : []
          })
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create task");
      }

      const data = await response.json();
      if (onTaskCreated) onTaskCreated(data.task);

      onClose();

    } catch (err) {
      console.error("Task create error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="event-popup">
      <div className="popup-header">
        <h3>Create Task</h3>
        <i className="fa-solid fa-xmark close-icon" onClick={onClose}></i>
      </div>

      <div className="popup-row">
        <input
          type="text"
          placeholder="Task title *"
          className="input-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="popup-row">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="popup-row checkbox-row">
        <input
          type="checkbox"
          checked={hasTime}
          onChange={(e) => setHasTime(e.target.checked)}
        />
        <span>Add time</span>
      </div>

      {hasTime && (
        <div className="popup-row">
          <label>Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      )}

      <div className="popup-row">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="popup-row">
        <label>Reminder (min before)</label>
        <input
          type="number"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
        />
      </div>

      <button
        className="create-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
