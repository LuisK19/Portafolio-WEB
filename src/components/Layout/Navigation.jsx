
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <ul>
      <li><Link to="/">Inicio</Link></li>
      <li> <a href='/#about'>Sobre Mí</a></li>
      <li><Link to="/academicWorks">Trabajos</Link></li>
      <li> <a href='/#recomendaciones'>Recomendaciones</a></li>
      <li> <a href='/#hobbies'>Hobbies</a></li>
      <li><Link to="/certifications">Certificaciones</Link></li>
      <li> <a href='/#contacto'>Contacto</a></li>
    </ul>
  );
};

export default Navigation;