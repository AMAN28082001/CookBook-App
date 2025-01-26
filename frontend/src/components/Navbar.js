import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
 // <-- Import the plain CSS file

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsOpen(false); 
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Brand */}
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            CookBook
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-menu-desktop">
            {token ? (
              <>
                <NavLink to="/my-recipes" isActive={isActive('/my-recipes')} label="My Recipes" />
                <NavLink to="/favorites" isActive={isActive('/favorites')} label="Favorites" />
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" isActive={isActive('/login')} label="Login" />
                <NavLink to="/register" isActive={isActive('/register')} label="Register" />
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMenu} aria-label="Toggle navigation menu" className="navbar-toggle">
            {/* Simple "hamburger" icon or "X" if open */}
            {isOpen ? (
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-items">
            {token ? (
              <>
                <MobileNavLink to="/my-recipes" label="My Recipes" closeMenu={closeMenu} />
                <MobileNavLink to="/favorites" label="Favorites" closeMenu={closeMenu} />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" label="Login" closeMenu={closeMenu} />
                <MobileNavLink to="/register" label="Register" closeMenu={closeMenu} />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

const NavLink = ({ to, isActive, label }) => (
  <Link to={to} className={isActive ? 'nav-link nav-link-active' : 'nav-link'}>
    {label}
  </Link>
);

const MobileNavLink = ({ to, label, closeMenu }) => (
  <Link to={to} onClick={closeMenu} className="mobile-nav-link">
    {label}
  </Link>
);

export default Navbar;
