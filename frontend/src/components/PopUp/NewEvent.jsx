import { useState, useEffect } from "react";
import "./NewEvent.css";

export default function NewEvent({ 
  onClose, 
  onCreate,
  onEventCreated,
  defaultCategory = "arrangement",
  calendarId: propCalendarId
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("arrangement");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState(15); // minutes before
  const [reminderDateTime, setReminderDateTime] = useState("");
  const [participants, setParticipants] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [calendarId, setCalendarId] = useState("");
  const [myCalendars, setMyCalendars] = useState([]);
  const [otherCalendars, setOtherCalendars] = useState([]);

  useEffect(() => {
    setCategory(defaultCategory);
  }, [defaultCategory]);

  useEffect(() => {
    if (propCalendarId) {
      setCalendarId(propCalendarId);
    }
  }, [propCalendarId]);

  useEffect(() => {
    //fetch(`${import.meta.env.VITE_API_URL}/api/calendars`, {
    fetch(`http://localhost:3000/api/calendars`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setMyCalendars(data.myCalendars ?? []);
        setOtherCalendars(data.otherCalendars ?? []);
        
        // Auto-select first calendar if not provided
        if (!calendarId && data.myCalendars?.length > 0) {
          setCalendarId(data.myCalendars[0]._id);
        }
      })
      .catch(err => console.error("Calendar load error:", err));
  }, []);

  function combine(date, time) {
    return new Date(`${date}T${time}:00`);
  }

  async function handleSubmit() {
    if (!title) return alert("Title is required");
    if (!calendarId) return alert("Choose a calendar");

    let eventData = { 
      title, 
      description, 
      category, 
      reminders: reminderMinutes ? [reminderMinutes] : [] 
    };

    if (category === "arrangement") {
      if (!date) return alert("Date is required for arrangement");
      if (!allDay && (!startTime || !endTime)) return alert("Start & End time required");
      if (!allDay && combine(date, startTime) >= combine(date, endTime))
        return alert("Start time must be before end time");

      eventData.start_time = allDay ? combine(date, "00:00") : combine(date, startTime);
      eventData.end_time = allDay ? combine(date, "23:59") : combine(date, endTime);
      eventData.location = location;
      eventData.participants = participants
        .split(",")
        .map(p => p.trim())
        .filter(p => p);
    } else if (category === "reminder") {
      if (!reminderDateTime) return alert("Date and time are required for reminder");
      eventData.reminder_time = new Date(reminderDateTime);
    } else if (category === "task") {
      if (!dueDate) return alert("Due date required for task");
      eventData.due_date = new Date(dueDate);
      eventData.is_completed = false;
    }

    try {
      //const res = await fetch(`${import.meta.env.VITE_API_URL}/api/calendars/${calendarId}/events`, {
      const res = await fetch(`http://localhost:3000/api/calendars/${calendarId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(eventData)
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Error: " + (error.error || "Failed to create event"));
        return;
      }

      const saved = await res.json();
      
      // Call both callbacks if provided
      if (onCreate) onCreate(saved);
      if (onEventCreated) onEventCreated(saved);
      
      onClose();

    } catch (err) {
      console.error("Event create error:", err);
      alert("Failed to create event. Please try again.");
    }
  }

  return (
    <div className="event-popup">
      <div className="popup-header">
        <h3>
          {category === "task" ? "Create Task" : 
           category === "reminder" ? "Create Reminder" : 
           "Create Event"}
        </h3>
        <i className="fa-solid fa-xmark close-icon" onClick={onClose}></i>
      </div>

      <label>Choose calendar:</label>
      <select value={calendarId} onChange={e => setCalendarId(e.target.value)}>
        <option value="">Select a calendar</option>
        <optgroup label="My calendars">
          {myCalendars.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
        </optgroup>
        <optgroup label="Shared with me">
          {otherCalendars.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
        </optgroup>
      </select>

      <div className="popup-row">
        <input
          type="text"
          placeholder="Add title *"
          className="input-title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div className="popup-row">
        <label>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="arrangement">Arrangement</option>
          <option value="reminder">Reminder</option>
          <option value="task">Task</option>
        </select>
      </div>

      {category === "arrangement" && (
        <>
          <div className="popup-row">
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <div className="popup-row checkbox-row">
            <input
              type="checkbox"
              checked={allDay}
              onChange={e => {
                setAllDay(e.target.checked);
                if (e.target.checked) {
                  setStartTime(""); setEndTime("");
                }
              }}
            />
            <span>All day</span>
          </div>

          {!allDay && (
            <>
              <div className="popup-row">
                <label>Start time</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
              </div>

              <div className="popup-row">
                <label>End time</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
              </div>
            </>
          )}

          <div className="popup-row">
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>

          <div className="popup-row">
            <input
              type="text"
              placeholder="Participants (emails, comma separated)"
              value={participants}
              onChange={e => setParticipants(e.target.value)}
            />
          </div>
        </>
      )}

      {category === "task" && (
        <div className="popup-row">
          <label>Due Date</label>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
      )}

      {category === "reminder" && (
        <div className="popup-row">
          <label>Reminder Date & Time</label>
          <input 
            type="datetime-local" 
            value={reminderDateTime} 
            onChange={e => setReminderDateTime(e.target.value)} 
          />
        </div>
      )}

      <div className="popup-row">
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      {category === "arrangement" && (
        <div className="popup-row">
          <label>Reminder (minutes before)</label>
          <input 
            type="number" 
            value={reminderMinutes} 
            onChange={e => setReminderMinutes(Number(e.target.value))} 
          />
        </div>
      )}

      <button className="create-btn" onClick={handleSubmit}>Save</button>
    </div>
  );
}
