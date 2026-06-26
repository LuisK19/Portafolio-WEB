import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { useLocation } from 'react-router-dom';
import styles from './Header.module.css';

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

  // "light": header transparente flotando sobre el hero oscuro de Home (sin scroll).
  // "solid": cualquier otro caso (Home con scroll, o cualquier otra página con fondo claro).
  const navVariant = isHomePage && !isScrolled ? 'light' : 'solid';

  return (
    <header className={`${styles.header} ${isHomePage && isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerContainer}>
        <Navbar
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          variant={navVariant}
        />
      </div>
    </header>
  );
};

export default Header;
