import { Link } from 'react-router-dom'; // Importa Link

const Navigation = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ul>
      <li><a href="#inicio" onClick={(e) => { e.preventDefault(); scrollToSection('inicio'); }}>Inicio</a></li>
      <li><a href="#trabajos" onClick={(e) => { e.preventDefault(); scrollToSection('trabajos'); }}>Trabajos</a></li>
      <li><a href="#sobre-mi" onClick={(e) => { e.preventDefault(); scrollToSection('sobre-mi'); }}>Sobre Mí</a></li>
      <li><a href="#recomendaciones" onClick={(e) => { e.preventDefault(); scrollToSection('recomendaciones'); }}>Recomendaciones</a></li>
      <li><a href="#hobbies" onClick={(e) => { e.preventDefault(); scrollToSection('hobbies'); }}>Hobbies</a></li>
      <li><Link to="./CertificationsPage">Certificaciones</Link></li> 
      <li><a href="#contacto" onClick={(e) => { e.preventDefault(); scrollToSection('contacto'); }}>Contacto</a></li>
    </ul>
  );
};

export default Navigation;