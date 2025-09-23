import React from 'react';

function Loader({ size = "md", message = "Loading..." }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`animate-spin rounded-full border-b-2 border-green-600 ${sizes[size]} mb-4`}></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}

export default Loader;