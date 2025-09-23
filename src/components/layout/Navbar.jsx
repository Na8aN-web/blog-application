import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Plus, Search } from 'lucide-react';

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-sm transform rotate-45"></div>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Untitled UI <span className="font-normal italic">journal</span>
            </span>
          </Link>

       

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => navigate('/search')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg border border-gray-300"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button
              onClick={() => navigate('/create')}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;