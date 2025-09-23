import React from 'react';

function SectionHeading({ children, className = "" }) {
  return (
    <h2 className={`text-3xl font-bold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
}

export default SectionHeading;