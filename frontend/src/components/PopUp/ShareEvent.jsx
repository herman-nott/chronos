import { useState, useEffect } from "react";
import "./NewEvent.css";

export default function ShareEvent({ event, onClose, onShared }) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("view");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [showLinkCopied, setShowLinkCopied] = useState(false);

  // Generate share link and load existing shares when component mounts
  useEffect(() => {
    if (!event || !event._id) return;
    
    const generateShareLink = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/events/${event._id}/generate-share-link`,
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ permission: 'view' }) // Public links are view-only
          }
        );

        // Check if event already has shared links
        /* if (event.shared_with && event.shared_with.length > 0) {
        const firstShare = event.shared_with[0];
        const link = `http://localhost:5173/event/shared/${firstShare.shareToken}`;
        setShareLink(link);
        } else {
          // Generate a preview token (malenkij yesho, not saved yet)
          const previewToken = btoa(event._id).replace(/=/g, '').substring(0, 32);
          const link = `http://localhost:5173/event/shared/${previewToken}`;
          setShareLink(link);
        }*/
        if (res.ok) {
          const data = await res.json();
          setShareLink(data.shareLink);
        } else {
          // Generate a preview token (malenkij yesho, not saved yet)
          const previewToken = btoa(event._id).replace(/=/g, '').substring(0, 32);
          setShareLink(`http://localhost:5173/event/shared/${previewToken}`);
        }
      } catch (err) {
        console.error('Failed to generate share link:', err);
        // Fallback: generate preview link
        const previewToken = btoa(event._id).replace(/=/g, '').substring(0, 32);
        setShareLink(`http://localhost:5173/event/shared/${previewToken}`);
      }
    };

    generateShareLink();
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
    if (!email.trim()) {
      return alert("Email is required");
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return alert("Please enter a valid email address");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/events/${event._id}/share`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: email.trim(), permission }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to share event");
      }

      const data = await response.json();
      
      alert(`Event shared with ${email}! They can now see this event in their calendar.`);

      if (onShared) onShared(data);
      
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

  // get participants from the event object
  const eventParticipants = event.participants || [];
  
  // get shares that have emails (not public links)
  const emailShares = (event.shared_with || []).filter(share => share.email);
  
  // separate participants from other shares
  const participantShares = emailShares.filter(share => 
    eventParticipants.includes(share.email)
  );
  
  const otherShares = emailShares.filter(share => 
    !eventParticipants.includes(share.email)
  );

  console.log("Event participants:", eventParticipants);
  console.log("Participant shares:", participantShares);
  console.log("Other shares:", otherShares);
  console.log("All shared_with:", event.shared_with);

  return (
    <div className="event-popup">
      <div className="popup-header">
        <h3>Share Event: {event.title}</h3>
        <i className="fa-solid fa-xmark close-icon" onClick={onClose}></i>
      </div>

      {/* Shareable Link Section */}
      <div className="popup-row" style={{ 
        marginBottom: "1rem",
        display: "flex",
        flexDirection: "column" 
      }}>
        <label>Public Shareable Link</label>

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
          {showLinkCopied ? "✓ Copied!" : "Copy Link"}
        </button>

        <small style={{ 
          color: "#666", 
          marginTop: "0.5rem", 
          display: "block" 
        }}>
          Anyone with this link can view the event details
        </small>
      </div>

      {/* Divider */}
      <div style={{ 
        borderTop: "1px solid #ddd", 
        margin: "1rem 0", 
        paddingTop: "1rem" 
      }}>
        <p style={{ 
          color: "#666", 
          fontSize: "0.9rem", 
          marginBottom: "1rem" 
        }}>
          Or share with specific users:
        </p>
      </div>

      {/* Email Invitation Section */}
      <div className="popup-row">
        <label>Email address</label>
        <input
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
      </div>

      <div className="popup-row">
        <label>Permission Level</label>
        <select
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
        >
          <option value="view">View only</option>
          <option value="edit">Can edit</option>
        </select>
        <small style={{ color: "#666", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>
          {permission === "edit" 
            ? "User can view and edit event details" 
            : "User can only view event details"}
        </small>
      </div>

      <button
        className="create-btn"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sharing..." : "Share Event"}
      </button>

      {/* Show Participants (if any) */}
      {eventParticipants.length > 0 && (
        <div style={{ 
          marginTop: "1.5rem", 
          paddingTop: "1rem", 
          borderTop: "1px solid #ddd" 
        }}>
          <label style={{ 
            marginBottom: "0.5rem", 
            display: "block",
            fontWeight: "600"
          }}>
            Event Participants ({eventParticipants.length}):
          </label>
          <small style={{ 
            color: "#666", 
            fontSize: "0.85rem", 
            display: "block",
            marginBottom: "0.5rem"
          }}>
            These users were added as participants and have edit access
          </small>
          <div style={{ maxHeight: "120px", overflowY: "auto" }}>
            {eventParticipants.map((participantEmail, index) => {
              // Find the corresponding share entry for this participant
              const shareInfo = participantShares.find(s => s.email === participantEmail);
              
              return (
                <div 
                  key={`participant-${index}`}
                  style={{ 
                    padding: "0.5rem", 
                    backgroundColor: "#e3f2fd", 
                    borderRadius: "4px",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <i className="fa-solid fa-user" style={{ color: "#1976d2" }}></i>
                  <div style={{ flex: 1 }}>
                    <div>{participantEmail}</div>
                    <small style={{ color: "#666" }}>
                      Participant · {shareInfo ? (shareInfo.permission === 'edit' ? 'Can edit' : 'View only') : 'Can edit'}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Show additional shares (not participants) */}
      {otherShares.length > 0 && (
        <div style={{ 
          marginTop: "1.5rem", 
          paddingTop: "1rem", 
          borderTop: "1px solid #ddd" 
        }}>
          <label style={{ 
            marginBottom: "0.5rem", 
            display: "block",
            fontWeight: "600"
          }}>
            Also shared with ({otherShares.length}):
          </label>
          <div style={{ maxHeight: "150px", overflowY: "auto" }}>
            {otherShares.map((share, index) => (
              <div 
                key={`share-${index}`}
                style={{ 
                  padding: "0.5rem", 
                  backgroundColor: "#f5f5f5", 
                  borderRadius: "4px",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem"
                }}
              >
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span>{share.email}</span>
                  <span style={{ 
                    color: "#666", 
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem"
                  }}>
                    {share.permission === "edit" ? (
                      <>
                        <i className="fa-solid fa-pencil"></i>
                        Can edit
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-eye"></i>
                        View only
                      </>
                    )}
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