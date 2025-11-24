import { useState } from "react";
import "./NewEvent.css";

export default function ShareCalendar({ calendarId, onClose, onShared }) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("view");
  const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
        return alert("Email is required");
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`http://localhost:3000/api/calendars/${calendarId}/share`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ email, permission }),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to share calendar");
            }

            const data = await response.json();
            alert(`Calendar shared with ${email}!`);
            
            if (onShared) onShared(data);
            onClose();
        } catch (err) {
            alert(err.message);
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="event-popup">
            <div className="popup-header">
                <h3>Share Calendar</h3>
                <i className="fa-solid fa-xmark close-icon" onClick={onClose}></i>
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
                <select value={permission} onChange={(e) => setPermission(e.target.value)}>
                    <option value="view">View only</option>
                    <option value="edit">Can edit</option>
                </select>
            </div>

            <button
                className="create-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
            {isSubmitting ? "Sharing..." : "Share"}
            </button>
        </div>
    );
}