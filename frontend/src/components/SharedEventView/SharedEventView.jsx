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

      <style jsx>{`
        .shared-event-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .shared-event-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .shared-event-header {
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
        }

        .shared-event-header h1 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .shared-by {
          color: #666;
          font-size: 0.9rem;
          margin: 0;
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-row {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .detail-row i {
          color: #667eea;
          margin-top: 0.25rem;
          min-width: 20px;
        }

        .detail-row strong {
          display: block;
          margin-bottom: 0.25rem;
        }

        .detail-row p {
          margin: 0.5rem 0 0 0;
          color: #555;
          line-height: 1.6;
        }

        .shared-event-actions {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 2px solid #f0f0f0;
        }

        .shared-event-actions button {
          width: 100%;
          padding: 0.75rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }

        .shared-event-actions button:hover {
          background: #5568d3;
        }
      `}</style>
    </div>
  );
}