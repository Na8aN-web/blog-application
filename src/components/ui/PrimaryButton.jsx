import React from 'react';

function PrimaryButton({ children, variant = "solid", ...props }) {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-colors";
  const variants = {
    solid: "bg-green-600 text-white hover:bg-green-700",
    outline: "border border-green-600 text-green-600 hover:bg-green-50"
  };

  return (
    <button className={`${baseClasses} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}

export default PrimaryButton;