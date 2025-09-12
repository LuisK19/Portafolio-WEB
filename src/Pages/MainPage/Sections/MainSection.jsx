import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MainSection = () => {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [academicWorks, setAcademicWorks] = useState(null);
  const [hobbiesData, setHobbiesData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Cargar datos desde los archivos JSON
    fetch('src/Data/personalInfo.json')
      .then(response => response.json())
      .then(data => setPersonalInfo(data))
      .catch(error => console.error('Error loading personal info:', error));

    fetch('src/Data/academicWorks.json')
      .then(response => response.json())
      .then(data => setAcademicWorks(data))
      .catch(error => console.error('Error loading academic works:', error));

    fetch('src/Data/hobbies.json')
      .then(response => response.json())
      .then(data => setHobbiesData(data))
      .catch(error => console.error('Error loading hobbies:', error));

    fetch('src/Data/recommendations.json')
      .then(response => response.json())
      .then(data => setRecommendations(data))
      .catch(error => console.error('Error loading recommendations:', error));
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    alert('¡Mensaje enviado! Te contactaré pronto.');

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  if (!personalInfo || !academicWorks) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <section id="about" className="about">
        <div className="container">
          <h2>Sobre Mí</h2>
          <p>{personalInfo.bio}</p>
        </div>
      </section>

      <section id="trabajos-academicos" className="section">
        <div className="container">
          <h2 className="section-title">Trabajos Académicos</h2>
          <div className="academic-works-container">
            {academicWorks.courses.map((course, index) => (
              <div key={index} className="course-section">
                <h3>{course.code} - {course.name}</h3>
                <p><strong>Semestre:</strong> {course.semester}</p>
                <p>{course.description}</p>

                <div className="works-list">
                  {course.works.map((work, workIndex) => (
                    <div key={workIndex} className="academic-work-card">
                      <h4>{work.name}</h4>
                      <p><strong>Tipo:</strong> {work.type}</p>
                      <p>{work.description}</p>
                      <p><strong>Fecha:</strong> {work.date}</p>
                      <p><strong>Tecnologías:</strong> {work.technologies.join(', ')}</p>
                      {work.repoLink && <a href={work.repoLink} target="_blank" rel="noopener noreferrer">Repositorio</a>}
                      {work.demoLink && <a href={work.demoLink} target="_blank" rel="noopener noreferrer">Sitio web</a>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="certifications" className="certifications">
        <div className="container">
          <h2 className="section-title">Certificaciones</h2>
          <div className="certifications-container">
            {personalInfo.certifications.slice(0, 3).map((cert, index) => ( // Muestra solo 3
              <div key={index} className="certification-card">
                <h3>{cert.title}</h3>
                <p className="certification-org">{cert.organization}</p>
                <p className="certification-date">{cert.date}</p>
                {cert.link && <a href={cert.link} className="certification-link">Ver certificado</a>}
              </div>
            ))}
          </div>
          <Link to="/CertificationsPage" className="btn btn-section">
            Ver todas mis certificaciones
          </Link>
        </div>
      </section>

      <section id="hobbies" className="section">
        <div className="container">
          <h2 className="section-title">Hobbies e Intereses</h2>
          <div className="hobbies-container">
            {hobbiesData.map((hobby, index) => (
              <div key={index} className="hobby-card">
                <div className="hobby-icon">{hobby.icon}</div>
                <h3>{hobby.title}</h3>
                <p>{hobby.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="recomendaciones" className="section">
        <div className="container">
          <h2 className="section-title">Recomendaciones</h2>
          <div className="recommendations-container">
            {recommendations.map((rec, index) => (
              <div key={index} className="recommendation-card">
                <h3>{rec.name}</h3>
                <p>{rec.position}</p>
                <p>"{rec.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="section">
        <div className="container">
          <h2 className="section-title">Contacto</h2>
          <div className="contact-container">
            <div className="contact-info">
              <h3>Información de Contacto</h3>
              <p>Estoy interesado en oportunidades de colaboración o proyectos freelance.</p>
              <div className="contact-details">
                <div className="contact-item">
                  <strong>Email:</strong> {personalInfo.email}
                </div>
                <div className="contact-item">
                  <strong>Teléfono:</strong> {personalInfo.phone}
                </div>
                <div className="contact-item">
                  <strong>Ubicación:</strong> {personalInfo.location}
                </div>
              </div>
              <div className="social-links">
                {personalInfo.socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="contact-form">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="subject"
                  placeholder="Asunto"
                  value={formData.subject}
                  onChange={handleChange}
                />
                <textarea
                  name="message"
                  placeholder="Mensaje"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                <button type="submit" className="btn btn-primary">
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MainSection;