import React, { useState, useEffect } from "react";
import "./NewEvent.css";

export default function ShareEvent({ event, onClose, onShared }) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("view");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [showLinkCopied, setShowLinkCopied] = useState(false);

  // Generate share link immediately when component mounts
  useEffect(() => {
    if (!event || !event._id) return;
    
    // Check if event already has shared links
    if (event.shared_with && event.shared_with.length > 0) {
      // Use the first existing share token
      const firstShare = event.shared_with[0];
      const link = `http://localhost:5173/event/shared/${firstShare.shareToken}`;
      setShareLink(link);
    } else {
      // Generate a preview token (malenkij yesho, not saved yet)
      const previewToken = btoa(event._id).replace(/=/g, '').substring(0, 32);
      const link = `http://localhost:5173/event/shared/${previewToken}`;
      setShareLink(link);
    }
  }, [event]);

  if (!event || !event._id) {
    return (
      <div className="event-popup">
        <div className="popup-header">
          <h3>Share Event</h3>
          <i className="fa-solid fa-xmark close-icon" onClick={onClose}></i>
        </div>
        <p>Loading event...</p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!email) {
      return alert("Email is required");
    }

    if (!event || !event._id) {
      return alert("Invalid event");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/events/${event._id}/share`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, permission }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to share event");
      }

      const data = await response.json();
      setShareLink(data.shareLink);
      alert(`Event shared with ${email}!`);

      if (onShared) onShared(data);
      
      // Clear email field for next share
      setEmail("");
    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyLinkToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setShowLinkCopied(true);
      setTimeout(() => setShowLinkCopied(false), 2000);
    }
  };

  return (
    <div className="event-popup">
      <div className="popup-header">
        <h3>Share Event: {event.title}</h3>
        <i className="fa-solid fa-xmark close-icon" onClick={onClose}></i>
      </div>

      {/* Show shareable link first */}
      <div className="popup-row" style={{ 
            marginBottom: "1rem",
            display: "flex",
            flexDirection: "column" }}>
        <label>Shareable Link</label>

        <input
            type="text"
            value={shareLink}
            readOnly
            style={{
            width: "100%",
            backgroundColor: "#f5f5f5",
            marginTop: "0.5rem"
            }}
        />

        <button
            onClick={copyLinkToClipboard}
            className="create-btn"
            style={{
            width: "auto",
            padding: "0.5rem 1rem",
            marginTop: "0.5rem"
            }}
        >
            {showLinkCopied ? "Copied!" : "Copy"}
        </button>

        <small
            style={{
            color: "#666",
            marginTop: "0.5rem",
            display: "block"
            }}
        >
            Anyone with this link can view the event
        </small>
        </div>

      {/* Divider */}
      <div style={{ 
        borderTop: "1px solid #ddd", 
        margin: "1rem 0", 
        paddingTop: "1rem" 
      }}>
        <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1rem" }}>
          Or send an email invitation:
        </p>
      </div>

      <div className="popup-row">
        <label>Email address</label>
        <input
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="popup-row">
        <label>Permission</label>
        <select
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
        >
          <option value="view">View only</option>
          <option value="edit">Can edit</option>
        </select>
      </div>

      <button
        className="create-btn"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Invitation"}
      </button>

      {/* Show list of already shared users */}
      {event.shared_with && event.shared_with.length > 0 && (
        <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #ddd" }}>
          <label style={{ marginBottom: "0.5rem", display: "block" }}>Shared with:</label>
          <div style={{ maxHeight: "150px", overflowY: "auto" }}>
            {event.shared_with.map((share, index) => (
              <div 
                key={index}
                style={{ 
                  padding: "0.5rem", 
                  backgroundColor: "#f5f5f5", 
                  borderRadius: "4px",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{share.email}</span>
                  <span style={{ color: "#666", fontSize: "0.8rem" }}>
                    {share.permission === "edit" ? "Can edit" : "View only"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}