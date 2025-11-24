import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SharedCalendarView.css"

export default function SharedCalendarView() {
  const { shareToken } = useParams();
  const [calendar, setCalendar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedCalendar = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/calendars/shared/${shareToken}`,
          { credentials: "include" }
        );

        if (!response.ok) {
          throw new Error("Calendar not found or link is invalid");
        }

        const data = await response.json();
        setCalendar(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedCalendar();
  }, [shareToken]);

  if (loading) {
    return (
      <div className="shared-calendar-container">
        <div className="shared-calendar-card">
          <p>Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-calendar-container">
        <div className="shared-calendar-card">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.href = "/"}>
            Go to Calendar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-calendar-container">
      <div className="shared-calendar-card">
        <div className="shared-calendar-header">
          <h1>{calendar.calendar.title}</h1>
          {calendar.sharedBy && (
            <p className="shared-by">
              Shared by {calendar.sharedBy.username} ({calendar.sharedBy.email})
            </p>
          )}
        </div>

        <div className="calendar-details">
          <div className="detail-row">
            <i className="fa-solid fa-palette"></i>
            <div>
              <strong>Color:</strong>
              <span 
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  backgroundColor: calendar.calendar.color,
                  marginLeft: "0.5rem",
                  borderRadius: "4px"
                }}
              ></span>
            </div>
          </div>

          {calendar.calendar.description && (
            <div className="detail-row">
              <i className="fa-solid fa-align-left"></i>
              <div>
                <strong>Description:</strong>
                <p>{calendar.calendar.description}</p>
              </div>
            </div>
          )}

          <div className="detail-row">
            <i className="fa-solid fa-lock"></i>
            <div>
              <strong>Permission:</strong>{" "}
              {calendar.permission === "edit" ? "Can edit" : "View only"}
            </div>
          </div>
        </div>

        <div className="shared-calendar-actions">
          <button onClick={() => window.location.href = "/"}>
            Open in Chronos App
          </button>
        </div>
      </div>
    </div>
  );
}