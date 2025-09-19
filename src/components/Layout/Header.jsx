import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Solo aplicar el efecto de scroll en la página principal
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(false); // Forzar header completo en otras páginas
      return;
    }

    const handleScroll = () => {
      const heroSection = document.getElementById('inicio');
      if (!heroSection) return;
      
      const heroBottom = heroSection.offsetHeight;
      setIsScrolled(window.scrollY > heroBottom - 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${!isHomePage ? 'full-size' : ''}`}>
      <div className="container">
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