
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <ul>
      <li><Link to="/">Inicio</Link></li>
      <li><Link to="/academicWorks">Trabajos</Link></li>
      <li><Link to="/sobre-mi">Sobre Mí</Link></li>
      <li><Link to="/recomendaciones">Recomendaciones</Link></li>
      <li><Link to="/hobbies">Hobbies</Link></li>
      <li><Link to="/certifications">Certificaciones</Link></li>
      <li><Link to="/contacto">Contacto</Link></li>
    </ul>
  );
};

export default Navigation;