import { useState } from "react";
import { useSettings } from "../SettingsContext/SettingsContext";
import "./NewEvent.css";

export default function Settings({ onClose }) {
  const { settings, updateSettings } = useSettings();

  const [country, setCountry] = useState(settings.country);
  const [timeFormat, setTimeFormat] = useState(settings.timeFormat);
  const [isLoggedOut, setIsLoggedOut] = useState(settings.isLoggedOut);

  function handleSubmit() {
    updateSettings({
      country,
      timeFormat,
      isLoggedOut,
    });
    onClose();
  }

  return (
    <div className="event-popup">
      <h3>Settings</h3>

      <label>Country:</label>
      <select value={country} onChange={e => setCountry(e.target.value)}>
        <option>Ukraine</option>
        <option>USA</option>
        <option>UK</option>
        <option>Germany</option>
      </select>

      <label>Time Format:</label>
      <select value={timeFormat} onChange={e => setTimeFormat(e.target.value)}>
        <option value="24h">24-hour</option>
        <option value="12h">12-hour</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={isLoggedOut}
          onChange={() => setIsLoggedOut(!isLoggedOut)}
        />
        Log out on next start
      </label>

      <button className="create-btn" onClick={handleSubmit}>
        Save changes
      </button>
    </div>
  );
}