import React, { useState } from "react";
import "./NewEvent.css";

export default function NewTask({ calendarId, onClose, onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [hasTime, setHasTime] = useState(false);
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [reminder, setReminder] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title || !date) {
      return alert("Title & Date required");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${calendarId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          time: hasTime ? time : null,
          description,
          due_date: date,
          is_completed: false,
          reminders: reminder ? [reminder] : []
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }

      const data = await response.json();
      
      // Notify parent component that task was created
      if (onTaskCreated) {
        onTaskCreated(data.task);
      }

      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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