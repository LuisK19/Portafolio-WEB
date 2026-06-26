import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import styles from './Navbar.module.css';

const Navbar = ({ isMenuOpen, setIsMenuOpen, variant = 'solid' }) => {
  const { t } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Función para cerrar el menú al hacer click en un link
  const handleClick = () => {
    if (isMenuOpen && setIsMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const navClassName = `${styles.nav} ${variant === 'light' ? styles.light : ''} ${isMenuOpen ? styles.active : ''}`;

  return (
    <nav className={navClassName}>
      <button className={styles.menuToggle} onClick={toggleMenu}>
        {isMenuOpen ? '✕' : '☰'}
      </button>

      <ul>
        <li><Link to="/" onClick={handleClick}>{t('nav.home')}</Link></li>
        <li><Link to="/about" onClick={handleClick}>{t('nav.about')}</Link></li>
        <li><Link to="/projects" onClick={handleClick}>{t('nav.academicWorks')}</Link></li>
        <li><Link to="/certifications" onClick={handleClick}>{t('nav.certifications')}</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;