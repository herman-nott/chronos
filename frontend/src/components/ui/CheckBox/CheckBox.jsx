import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

const CheckBox = ({
  text = "main",
  checked,
  onChange,
  disabled = false,
  checkColor = "purple-600", // 👈 control color here
  className,
  id,
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleChange = (event) => {
    if (disabled) return;
    const newChecked = event.target.checked;
    setIsChecked(newChecked);
    onChange?.(event);
  };

  return (
    <label
      htmlFor={id}
      className={twMerge(
        "flex items-center cursor-pointer select-none transition-all duration-200",
        disabled ? "opacity-60 cursor-not-allowed" : "",
        className
      )}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked !== undefined ? checked : isChecked}
        onChange={handleChange}
        disabled={disabled}
        // 👇 This sets the accent color dynamically
        className={twMerge(
          `w-4 h-4 mr-2 accent-${checkColor}`,
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        )}
        {...props}
      />
      <span className="text-lg font-normal leading-2xl text-white">{text}</span>
    </label>
  );
};

export default CheckBox;
