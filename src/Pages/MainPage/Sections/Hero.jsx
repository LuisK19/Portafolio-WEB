const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Compensar altura del header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="inicio" className="hero">
      <div className="container">
        <h1>Bienvenido a mi Portafolio</h1>
        <p>Hola, soy Luis Trejos. Este es mi portafolio académico y profesional donde muestro mis trabajos, habilidades y proyectos.</p>
        <p>El propósito de este sitio es integrar todos los conocimientos adquiridos en el curso de Introducción al Desarrollo de Páginas Web.</p>
        <button className="btn" onClick={() => scrollToSection('trabajos-academicos')}>
          Ver mis trabajos
        </button>
      </div>
    </section>
  );
};

export default Hero;