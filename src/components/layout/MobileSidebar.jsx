import React from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Search } from 'lucide-react';

function MobileSidebar({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="fixed right-0 top-0 h-full w-full bg-white shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold">Menu</span>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
    
          
          <div className="mt-8 space-y-3">
            <Link
              to="/search"
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2 text-gray-600 px-4 py-3 rounded-lg border border-gray-300"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Link>
            <Link
              to="/create"
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileSidebar;