import { useEffect, useState } from "react";
import "./NewEvent.css";

const ManageMembers = ({ calendarId, onClose }) => {
  const [members, setMembers] = useState([]);  

  useEffect(() => {
    fetch(`http://localhost:3000/api/calendars/${calendarId}/members`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setMembers(data.members || []));
  }, [calendarId]);

  const removeMember = (userId) => {
    if (!window.confirm("Remove this user from calendar?")) return;

    fetch(`http://localhost:3000/api/calendars/${calendarId}/members/remove`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setMembers(prev => prev.filter(m => m._id !== userId));
        }
      });
  };

  return (
    <div className="event-popup">
      <div className="invite-manager">
        <h2>Manage Members</h2>

        {members.length === 0 && <p>No members yet</p>}

        {members.map(m => (
          <div className="member-row" key={m._id}>
            <span>{m.username} ({m.email})</span>
            <button onClick={() => removeMember(m._id)} className="remove-btn">
              Remove
            </button>
          </div>
        ))}

      <button className="close-btn " onClick={onClose} style={{
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#b4b0eaff',
        }}>
          Close</button>
      </div>
    </div>
  );
};

export default ManageMembers;
