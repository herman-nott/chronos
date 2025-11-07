import React, { useState } from 'react';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const checkboxClasses = cva(
  'flex items-center cursor-pointer transition-all duration-200',
  {
    variants: {
      size: {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  }
);

const CheckBox = ({
  // Required parameters with defaults
  text = "main",
  text_font_size = "text-lg",
  text_font_family = "Inter",
  text_font_weight = "font-normal",
  text_line_height = "leading-2xl",
  text_text_align = "left",
  text_color = "text-text-white",
  layout_align_self = "center",
  
  // Optional parameters (no defaults)
  layout_gap,
  layout_width,
  padding,
  position,
  margin,
  
  // Standard React props
  checked,
  onChange,
  disabled = false,
  className,
  size,
  id,
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(checked || false);

  // Safe validation for optional parameters
  const hasValidGap = layout_gap && typeof layout_gap === 'string' && layout_gap?.trim() !== '';
  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width?.trim() !== '';
  const hasValidPadding = padding && typeof padding === 'string' && padding?.trim() !== '';
  const hasValidPosition = position && typeof position === 'string' && position?.trim() !== '';
  const hasValidMargin = margin && typeof margin === 'string' && margin?.trim() !== '';

  // Build optional Tailwind classes
  const optionalClasses = [
    hasValidGap ? `gap-[${layout_gap}]` : 'gap-2',
    hasValidWidth ? `w-[${layout_width}]` : '',
    hasValidPadding ? `p-[${padding}]` : '',
    hasValidPosition ? position : '',
    hasValidMargin ? `m-[${margin}]` : '',
    layout_align_self === 'center' ? 'self-center' : layout_align_self === 'start' ? 'self-start' : layout_align_self === 'end' ? 'self-end' : ''
  ]?.filter(Boolean)?.join(' ');

  // Build required style classes
  const requiredClasses = [
    text_font_size || "text-lg",
    text_font_weight || "font-normal",
    text_line_height || "leading-2xl",
    text_color || "text-text-white",
  ]?.filter(Boolean)?.join(' ');

  const handleChange = (event) => {
    if (disabled) return;
    const newChecked = event?.target?.checked;
    setIsChecked(newChecked);
    if (typeof onChange === 'function') {
      onChange(event);
    }
  };

  return (
    <label
      className={twMerge(
        checkboxClasses({ size }),
        requiredClasses,
        optionalClasses,
        className
      )}
      style={{ 
        fontFamily: text_font_family || 'Inter',
        textAlign: text_text_align || 'left'
      }}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked !== undefined ? checked : isChecked}
        onChange={handleChange}
        disabled={disabled}
        className="w-4 h-4 mr-2 accent-purple-600 cursor-pointer"
        {...props}
      />
      <span>{text}</span>
    </label>
  );
};

export default CheckBox;