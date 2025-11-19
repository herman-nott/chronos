import React from "react";
import "./Button.css"; // import CSS for colors

const Button = ({
  text = "Click",
  size = "medium",        // small, medium, large
  className = "",
  disabled = false,
  onClick,
  type = "button",
  children,
}) => {
  // size mapping
  const sizeClasses = {
    small: "text-sm px-3 py-1.5",
    medium: "text-base px-4 py-2",
    large: "text-lg px-6 py-3",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn ${sizeClasses[size] || sizeClasses.medium} ${className}`}
      aria-disabled={disabled}
    >
      {children || text}
    </button>
  );
};

export default Button;
