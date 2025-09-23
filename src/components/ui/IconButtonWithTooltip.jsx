import React, { useState } from 'react';

function IconButtonWithTooltip({ 
  icon: Icon, 
  tooltip, 
  onClick, 
  variant = "default",
  size = "md"
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const variants = {
    default: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
    primary: "text-green-600 hover:text-green-700 hover:bg-green-50",
    danger: "text-red-600 hover:text-red-700 hover:bg-red-50"
  };

  const sizes = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`rounded-lg transition-colors ${variants[variant]} ${sizes[size]}`}
      >
        <Icon className={iconSizes[size]} />
      </button>
      
      {showTooltip && tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}

export default IconButtonWithTooltip;