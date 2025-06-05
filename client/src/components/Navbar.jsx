import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../img/logo.png";

/**
 * Navbar Component - Responsive Navigation Bar
 * 
 * Features:
 * - Responsive design with mobile hamburger menu
 * - Category navigation links
 * - User authentication status display
 * - Mobile-first design approach
 * - Smooth animations and transitions
 */
const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Toggle mobile menu visibility
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  /**
   * Close mobile menu when link is clicked
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  /**
   * Handle logout and close mobile menu
   */
  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <div className="navbar">
      <div className="container">
        {/* Logo Section */}
        <div className="logo">
          <Link to="/" onClick={closeMobileMenu}>
            <img src={Logo} alt="Blog Logo" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <div className={`links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {/* Category Links */}
          <Link className="link" to="/?cat=futurology" onClick={closeMobileMenu}>
            <h6>FUTUROLOGY</h6>
          </Link>
          <Link className="link" to="/?cat=science" onClick={closeMobileMenu}>
            <h6>SCIENCE</h6>
          </Link>
          <Link className="link" to="/?cat=technology" onClick={closeMobileMenu}>
            <h6>TECHNOLOGY</h6>
          </Link>
          <Link className="link" to="/?cat=philosophy" onClick={closeMobileMenu}>
            <h6>PHILOSOPHY</h6>
          </Link>
          <Link className="link" to="/?cat=sociology" onClick={closeMobileMenu}>
            <h6>SOCIOLOGY</h6>
          </Link>
          
          {/* User Info */}
          {currentUser && (
            <span className="username">
              {currentUser?.username.toUpperCase()}
            </span>
          )}
          
          {/* Authentication Links */}
          {currentUser ? (
            <span onClick={handleLogout} className="auth-link">
              LOGOUT
            </span>
          ) : (
            <Link className="link auth-link" to="/login" onClick={closeMobileMenu}>
              LOGIN
            </Link>
          )}
          
          {/* Write Button */}
          <Link className="write" to="/write" onClick={closeMobileMenu}>
            Write
          </Link>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="mobile-overlay" 
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
