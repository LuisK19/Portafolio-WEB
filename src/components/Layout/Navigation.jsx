
import { Link } from 'react-router-dom';

const Navigation = ({ isMenuOpen, setIsMenuOpen }) => {
  // Función para cerrar el menú
  const handleClick = () => {
    if (isMenuOpen && setIsMenuOpen) {
      setIsMenuOpen(false);
    }
  };
  return (
    <ul>
      <li><Link to="/" onClick={handleClick}>Inicio</Link></li>
      <li><Link to="/about" onClick={handleClick}>Sobre Mí</Link></li>
      <li><Link to="/academicWorks" onClick={handleClick}>Trabajos</Link></li>
      <li><a href='/#recomendaciones' onClick={handleClick}>Recomendaciones</a></li>
      <li><a href='/#hobbies' onClick={handleClick}>Hobbies</a></li>
      <li><Link to="/certifications" onClick={handleClick}>Certificaciones</Link></li>
      <li><a href='/#contacto' onClick={handleClick}>Contacto</a></li>
    </ul>
  );
};

export default Navigation;