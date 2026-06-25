
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

const Navigation = ({ isMenuOpen, setIsMenuOpen }) => {
  const { t } = useLanguage();
  
  // Función para cerrar el menú
  const handleClick = () => {
    if (isMenuOpen && setIsMenuOpen) {
      setIsMenuOpen(false);
    }
  };
  return (
    <ul>
      <li><Link to="/" onClick={handleClick}>{t('nav.home')}</Link></li>
      <li><Link to="/about" onClick={handleClick}>{t('nav.about')}</Link></li>
      <li><Link to="/academicWorks" onClick={handleClick}>{t('nav.academicWorks')}</Link></li>
      <li><Link to="/certifications" onClick={handleClick}>{t('nav.certifications')}</Link></li>
    </ul>
  );
};

export default Navigation;