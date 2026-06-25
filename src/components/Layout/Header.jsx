import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Solo aplicar el efecto de scroll en la página principal
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${isHomePage && isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <nav id="main-nav" className={isMenuOpen ? 'active' : ''}>
          
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? '✕' : '☰'}
          </button>

          <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </nav>
      </div>
    </header>
  );
};

export default Header;