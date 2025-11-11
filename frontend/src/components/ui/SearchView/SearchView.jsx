import React from "react";
import "./SearchView.css"; // optional CSS for colors if needed

const SearchView = ({
  placeholder = "Search",
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  size = "medium", // small, medium, large
  className = "",
  ...props
}) => {
  // size mapping
  const sizeClasses = {
    small: "text-sm px-2 py-1",
    medium: "text-base px-3 py-2",
    large: "text-lg px-4 py-3",
  };

  return (
    <div
      className={`search-view flex items-center bg-gray-700 rounded ${sizeClasses[size] || sizeClasses.medium} ${className}`}
    >
      <svg
        className="w-4 h-4 mr-2 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400"
        {...props}
      />
    </div>
  );
};

export default SearchView;
