import React from 'react';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const searchClasses = cva(
  'flex items-center transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500',
  {
    variants: {
      size: {
        small: 'text-sm px-2 py-1',
        medium: 'text-base px-3 py-2',
        large: 'text-lg px-4 py-3',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  }
);

const SearchView = ({
  // Required parameters with defaults
  placeholder = "Search",
  text_font_size = "text-sm",
  text_font_family = "Inter",
  text_font_weight = "font-normal",
  text_line_height = "leading-sm",
  text_text_align = "left",
  text_color = "text-text-disabled",
  fill_background_color = "bg-secondary-dark",
  border_border_radius = "rounded-sm",
  
  // Optional parameters (no defaults)
  layout_gap,
  layout_width,
  padding,
  position,
  
  // Standard React props
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  className,
  size,
  ...props
}) => {
  // Safe validation for optional parameters
  const hasValidGap = layout_gap && typeof layout_gap === 'string' && layout_gap?.trim() !== '';
  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width?.trim() !== '';
  const hasValidPadding = padding && typeof padding === 'string' && padding?.trim() !== '';
  const hasValidPosition = position && typeof position === 'string' && position?.trim() !== '';

  // Build optional Tailwind classes
  const optionalClasses = [
    hasValidGap ? `gap-[${layout_gap}]` : '',
    hasValidWidth ? `w-[${layout_width}]` : 'w-full',
    hasValidPadding ? `p-[${padding}]` : '',
    hasValidPosition ? position : '',
  ]?.filter(Boolean)?.join(' ');

  // Build required style classes
  const requiredClasses = [
    text_font_size || "text-sm",
    text_font_weight || "font-normal",
    text_line_height || "leading-sm",
    fill_background_color || "bg-secondary-dark",
    border_border_radius || "rounded-sm",
  ]?.filter(Boolean)?.join(' ');

  return (
    <div
      className={twMerge(
        searchClasses({ size }),
        requiredClasses,
        optionalClasses,
        className
      )}
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
        style={{ 
          fontFamily: text_font_family || 'Inter',
          textAlign: text_text_align || 'left'
        }}
        className={twMerge(
          'flex-1 bg-transparent border-none outline-none',
          text_color || "text-text-disabled",
          'placeholder:' + (text_color || "text-text-disabled")
        )}
        {...props}
      />
    </div>
  );
};

export default SearchView;