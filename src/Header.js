import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <nav className="navbar">
        {/* Brand / Logo Section */}
        <div className="brand">
          {/* Replace the emoji with your actual logo/icon if you prefer */}
          <span className="logo" role="img" aria-label="house icon">🏠</span>
          <span className="brand-text">batdongsan24h.</span>
        </div>

        {/* Navigation Links */}
        <ul className="nav-items">
          <li>News</li>
          <li>Rent</li>
          <li>Sell</li>
          <li>Mortgages</li>
          <li>Agent Finder</li>
          <li>Articles</li>
          <li>About</li>
        </ul>

        {/* Right Side: Language & Sign Up Button */}
        <div className="nav-right">
          <span className="language">USA</span>
          <button className="signup-btn">Sign Up</button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
