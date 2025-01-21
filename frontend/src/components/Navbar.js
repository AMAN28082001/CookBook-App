import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  // Toggle state for mobile menu
  const [isOpen, setIsOpen] = useState(false);

  // Check if user is logged in (dummy logic)
  const token = localStorage.getItem('token');

  // Logout clears token & userId, then reload
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.reload();
  };

  return (
    // Added "sticky top-0 z-50" to keep the navbar at top
    <nav className="sticky top-0 z-50 bg-gray-100 border-b border-gray-200">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: brand + hamburger */}
        <div className="flex justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-lg font-bold hover:text-blue-500">
              CookBook
            </Link>
          </div>

          {/* HAMBURGER (mobile only: md:hidden) */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700
                hover:text-white hover:bg-gray-700 focus:outline-none
                focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-white"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  // X icon when menu is open
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  // Hamburger icon when menu is closed
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* DESKTOP NAV LINKS (hidden on mobile) */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {token ? (
              <>
                <Link
                  to="/create"
                  className="text-sm text-gray-700 hover:text-blue-600"
                >
                  Create
                </Link>
                <Link
                  to="/favorites"
                  className="text-sm text-gray-700 hover:text-blue-600"
                >
                  Favorites
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="text-sm hover:text-blue-600">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU (only visible if isOpen=true AND screen < md) */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {token ? (
              <>
                <Link
                  to="/create"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-200"
                >
                  Create
                </Link>
                <Link
                  to="/favorites"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-200"
                >
                  Favorites
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
