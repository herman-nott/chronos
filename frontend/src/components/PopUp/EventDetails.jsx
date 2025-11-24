import React, { useState } from "react";
import "./NewEvent.css";

export default function EventDetails({ event, onClose, onEdit, onDelete, onShare }) {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = () => {
    if (onEdit) onEdit(event);
    // Don't close here - let the parent handle it
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/events/${event._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      if (onDelete) onDelete(event._id);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
    }
  };

  const handleShare = () => {
    if (onShare) onShare(event);
    // Don't close here - let the parent handle it
  };

  return (
    <div className="event-popup" onClick={(e) => e.stopPropagation()}>
      <div className="popup-header">
        <h3>{event.title}</h3>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <i
            className="fa-solid fa-ellipsis-vertical"
            style={{ cursor: "pointer", padding: "0.5rem" }}
            onClick={() => setShowMenu(!showMenu)}
          ></i>
          <i className="fa-solid fa-xmark close-icon" onClick={onClose}></i>
        </div>
      </div>

      {showMenu && (
        <div className="event-details-menu">
          <div className="menu-item" onClick={handleEdit}>
            <i className="fa-solid fa-pen"></i> Edit event
          </div>
          <div className="menu-item" onClick={handleShare}>
            <i className="fa-solid fa-share"></i> Share event
          </div>
          <div className="menu-item delete" onClick={handleDelete}>
            <i className="fa-solid fa-trash"></i> Delete event
          </div>
        </div>
      )}

      <div className="event-details-content">
        {event.category === "arrangement" && (
          <>
            <div className="detail-row">
              <i className="fa-solid fa-clock"></i>
              <div>
                <strong>Start:</strong>
                <p>{formatDate(event.start_time)}</p>
              </div>
            </div>

            <div className="detail-row">
              <i className="fa-solid fa-clock"></i>
              <div>
                <strong>End:</strong>
                <p>{formatDate(event.end_time)}</p>
              </div>
            </div>

            {event.location && (
              <div className="detail-row">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <strong>Location:</strong>
                  <p>{event.location}</p>
                </div>
              </div>
            )}

            {event.participants && event.participants.length > 0 && (
              <div className="detail-row">
                <i className="fa-solid fa-users"></i>
                <div>
                  <strong>Participants:</strong>
                  <p>{event.participants.join(", ")}</p>
                </div>
              </div>
            )}
          </>
        )}

        {event.category === "reminder" && (
          <div className="detail-row">
            <i className="fa-solid fa-bell"></i>
            <div>
              <strong>Reminder Time:</strong>
              <p>{formatDate(event.reminder_time)}</p>
            </div>
          </div>
        )}

        {event.category === "task" && (
          <>
            <div className="detail-row">
              <i className="fa-solid fa-calendar-check"></i>
              <div>
                <strong>Due Date:</strong>
                <p>{formatDate(event.due_date)}</p>
              </div>
            </div>

            <div className="detail-row">
              <i className="fa-solid fa-check-circle"></i>
              <div>
                <strong>Status:</strong>
                <p>{event.is_completed ? "Completed" : "Not Completed"}</p>
              </div>
            </div>
          </>
        )}

        {event.description && (
          <div className="detail-row">
            <i className="fa-solid fa-align-left"></i>
            <div>
              <strong>Description:</strong>
              <p>{event.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}