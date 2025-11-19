// Popup.jsx
import React, { useEffect } from 'react';
import "./Popup.css";

export default function Popup({ children, position, onClose }) {

  // close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!document.getElementById("popup-box")?.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div 
      id="popup-box"
      className="popup-container"
      // style={{
      //   top: position?.y || 50,
      //   left: position?.x || 50
      // }}
    >
      {children}
    </div>
  );
}
