import { useState, useEffect } from 'react';
import "./NewEvent.css";

const InviteUsers = ({ calendarId, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

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

  const handleInvite = async () => {
    try {
      for (const user of selectedUsers) {
        console.log(calendarId);
        
        const res = await fetch(`http://localhost:3000/api/calendars/${calendarId}/invite`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });
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
      <h3>Invite Users</h3>
      <div className="popup-row">
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
                <li key={user._id} onClick={() => addUser(user)} style={{listStyle: 'none'}}>
                {user.login} ({user.email})
              </li>
            ))}
          </ul>
        )}

      {selectedUsers.length > 0 && (
        <div className="selected-users gap-1">
          {selectedUsers.map(user => (
            <span key={user._id} className="selected-user mr-2">
                {user.login} 
              <button onClick={() => removeUser(user._id)}
                style={{
                  borderRadius: '5px',
                  backgroundColor: '#b4b0eaff',
                }}>x</button>
              </span>
          ))}
        </div>
      )}

      <button className="create-btn" onClick={handleInvite} disabled={selectedUsers.length === 0}>Invite</button>
    </div>
  );
};

export default InviteUsers;