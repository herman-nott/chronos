import { useState, useEffect } from "react";
import { useSettings } from "../SettingsContext/SettingsContext";
import { useNavigate } from 'react-router-dom';
import "./NewEvent.css";

export default function Settings({ onClose }) {
  const navigate = useNavigate();
  
  const { settings, updateSettings } = useSettings();

  const [country, setCountry] = useState(settings.country);
  const [timeFormat, setTimeFormat] = useState(settings.timeFormat);

  const countryNames = { ua: "Ukraine", de: "Germany" };
  const timeFormats = { "24": "24-hour", "12": "12-hour" };

  useEffect(() => {
    setCountry(settings.country);
    setTimeFormat(settings.timeFormat);
  }, [settings]);

  console.log(settings);
  

  async function logout() {
    try {
      const res = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        navigate('/login')
      } else {
        console.error('Error when logout:', await res.text());
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  async function handleSubmit() {
    try {
      const res = await fetch('http://localhost:3000/api/user/settings', {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          country,
          time_format: timeFormat,
        })
      });

      if (res.ok) {
        updateSettings({ country, timeFormat });

        const meRes = await fetch("http://localhost:3000/api/sessionUser", { credentials: "include" });
        if (meRes.ok) {
          const user = await meRes.json();

          if (user && user.id) {
            const holidaysRes = await fetch(`http://localhost:3000/api/${user.id}/populate-holidays`, {
              method: "GET",
              credentials: "include",
            });

            if (!holidaysRes.ok) {
              console.error("Failed to populate holidays after changing country");
            } else {
              console.log("Holidays updated for new country");
            }
          }
        }

        onClose();
      } else {
        console.error("Failed to update settings");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  return (
    <div className="event-popup">
      <h3>Settings</h3>

      <label>Country:</label>
      <select value={country} onChange={e => setCountry(e.target.value)}>
        <option value="ua">Ukraine</option>
        <option value="de">Germany</option>
      </select>

      <label>Time Format:</label>
      <select value={timeFormat} onChange={e => setTimeFormat(e.target.value)}>
        <option value="24">24-hour</option>
        <option value="12">12-hour</option>
      </select>

      <p className="f4 link dim black db pointer underline" onClick={logout}>Log Out</p>

      <button className="create-btn" onClick={handleSubmit}>
        Save changes
      </button>
    </div>
  );
}