import { useState, useEffect } from 'react';
import "./NewEvent.css";

const InviteUsers = ({ calendarId, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [shareLink, setShareLink] = useState("");
  const [showLinkCopied, setShowLinkCopied] = useState(false);
  const [permission, setPermission] = useState("view");

  useEffect(() => {
    if (!calendarId) return;
    
    const generateShareLink = async () => {
      try {
        // Generate share link
        const res = await fetch(
          `http://localhost:3000/api/calendars/${calendarId}/generate-share-link`,
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ permission })
          }
        );
        
        if (res.ok) {
          const data = await res.json();
          setShareLink(data.shareLink);
        } else {
          // Fallback: generate preview link
          const previewToken = btoa(calendarId).replace(/=/g, '').substring(0, 32);
          setShareLink(`http://localhost:5173/calendar/shared/${previewToken}`);
        }
      } catch (err) {
        console.error('Failed to generate share link:', err);
        // Fallback: generate preview link
        const previewToken = btoa(calendarId).replace(/=/g, '').substring(0, 32);
        setShareLink(`http://localhost:5173/calendar/shared/${previewToken}`);
      }
    };

    generateShareLink();
  }, [calendarId, permission]);

  useEffect(() => {
    if (!query) return setSuggestions([]);
    
    const fetchUsers = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/search?query=${query}`, {
          credentials: 'include'
        });
        const data = await res.json();
        setSuggestions(data.users || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, [query]);

  const addUser = (user) => {
    if (!selectedUsers.some(u => u._id === user._id)) {
      setSelectedUsers(prev => [...prev, user]);
    }
    setQuery('');
    setSuggestions([]);
  };

  const removeUser = (userId) => {
    setSelectedUsers(prev => prev.filter(u => u._id !== userId));
  };

  const copyLinkToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setShowLinkCopied(true);
      setTimeout(() => setShowLinkCopied(false), 2000);
    }
  };

  const handleInvite = async () => {
    if (selectedUsers.length === 0) {
      return alert('Please select at least one user to invite');
    }

    try {
      for (const user of selectedUsers) {
        const res = await fetch(
          `http://localhost:3000/api/calendars/${calendarId}/invite`,
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: user.email,
              permission: permission
            })
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
      }
      
      alert('Users invited successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="event-popup">
      <div className="popup-header">
        <h3>Invite Users</h3>
        <i className="fa-solid fa-xmark close-icon" onClick={onClose}></i>
      </div>
      
      {/* Share Link Section */}
      <div className="popup-row" style={{ 
        marginBottom: "1rem",
        display: "flex",
        flexDirection: "column" 
      }}>
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
          {showLinkCopied ? "Copied!" : "Copy Link"}
        </button>
        <small style={{ 
          color: "#666", 
          marginTop: "0.5rem", 
          display: "block" 
        }}>
          Anyone with this link can access the calendar
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
          Or invite specific users:
        </p>
      </div>

      {/* Permission Selection */}
      <div className="popup-row">
        <label>Permission Level</label>
        <select 
          value={permission} 
          onChange={(e) => setPermission(e.target.value)}
        >
          <option value="view">View only</option>
          <option value="edit">Can edit</option>
        </select>
      </div>

      {/* User Search Section */}
      <div className="popup-row">
        <label>Search Users</label>
        <input
          type="text"
          placeholder="Type email or username..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map(user => (
            <li 
              key={user._id} 
              onClick={() => addUser(user)} 
              style={{listStyle: 'none'}}
            >
              {user.login} ({user.email})
            </li>
          ))}
        </ul>
      )}

      {selectedUsers.length > 0 && (
        <div className="selected-users gap-1">
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Selected Users:
          </label>
          {selectedUsers.map(user => (
            <span key={user._id} className="selected-user mr-2">
              {user.login} 
              <button 
                onClick={() => removeUser(user._id)}
                style={{
                  borderRadius: '5px',
                  backgroundColor: '#b4b0eaff',
                  marginLeft: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}

      <button 
        className="create-btn" 
        onClick={handleInvite} 
        disabled={selectedUsers.length === 0}
      >
        Invite Selected Users
      </button>
    </div>
  );
};

export default InviteUsers;