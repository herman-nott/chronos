import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Calendar/Calendar.css";
import "./SharedEventView.css";

export default function SharedEventView() {
  const { shareToken } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/events/shared/${shareToken}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Event not found or link is invalid");
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedEvent();
  }, [shareToken]);

  if (loading) {
    return (
      <div className="shared-event-container">
        <div className="shared-event-card">
          <p>Loading event...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-event-container">
        <div className="shared-event-card">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.href = "/"}>
            Go to Calendar
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="shared-event-container">
      <div className="shared-event-card">
        <div className="shared-event-header">
          <h1>{event.event.title}</h1>
          {event.sharedBy && (
            <p className="shared-by">
              Shared by {event.sharedBy.username} ({event.sharedBy.email})
            </p>
          )}
        </div>

        <div className="event-details">
          {event.event.category === "arrangement" && (
            <>
              <div className="detail-row">
                <i className="fa-solid fa-calendar"></i>
                <div>
                  <strong>Start:</strong> {formatDate(event.event.start_time)}
                </div>
              </div>

              <div className="detail-row">
                <i className="fa-solid fa-calendar"></i>
                <div>
                  <strong>End:</strong> {formatDate(event.event.end_time)}
                </div>
              </div>
            </>
          )}

          {event.event.category === "reminder" && (
            <div className="detail-row">
              <i className="fa-solid fa-bell"></i>
              <div>
                <strong>Reminder Time:</strong> {formatDate(event.event.reminder_time)}
              </div>
            </div>
          )}

          {event.event.category === "task" && (
            <>
              <div className="detail-row">
                <i className="fa-solid fa-calendar-check"></i>
                <div>
                  <strong>Due Date:</strong> {formatDate(event.event.due_date)}
                </div>
              </div>

              <div className="detail-row">
                <i className="fa-solid fa-check-circle"></i>
                <div>
                  <strong>Status:</strong> {event.event.is_completed ? "Completed" : "Not Completed"}
                </div>
              </div>
            </>
          )}

          {event.event.location && (
            <div className="detail-row">
              <i className="fa-solid fa-location-dot"></i>
              <div>
                <strong>Location:</strong> {event.event.location}
              </div>
            </div>
          )}

          {event.event.description && (
            <div className="detail-row">
              <i className="fa-solid fa-align-left"></i>
              <div>
                <strong>Description:</strong>
                <p>{event.event.description}</p>
              </div>
            </div>
          )}

          {event.calendar && (
            <div className="detail-row">
              <i className="fa-solid fa-folder"></i>
              <div>
                <strong>Calendar:</strong> {event.calendar.title}
              </div>
            </div>
          )}

          <div className="detail-row">
            <i className="fa-solid fa-lock"></i>
            <div>
              <strong>Permission:</strong>{" "}
              {event.permission === "edit" ? "Can edit" : "View only"}
            </div>
          </div>
        </div>

        <div className="shared-event-actions">
          <button onClick={() => window.location.href = "/"}>
            Open in Chronos App
          </button>
        </div>
      </div>
    </div>
  );
}