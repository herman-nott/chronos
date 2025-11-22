import React from "react";
import "./CheckBox.css";

export default function CheckBox({ id, text, checked, onChange, color }) {
  return (
    <label className="calendar-checkbox">
      <span
        className="checkbox-color"
        style={{
          backgroundColor: checked ? color : "transparent",
          border: `2px solid ${color}`,
        }}
      >
        {checked && (
          <i className="fa-solid fa-check checkmark-icon"></i>
        )}
      </span>

      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        hidden
      />

      <span className="checkbox-label">{text}</span>
    </label>
  );
}
