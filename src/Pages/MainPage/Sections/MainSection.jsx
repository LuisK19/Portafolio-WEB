import React, { useState, useEffect } from 'react';
import SocialIcon from '../../../components/SocialIcon';
import SocialLinks from '../../../components/SocialIcon';
import { Link } from 'react-router-dom';

const MainSection = () => {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [academicWorks, setAcademicWorks] = useState(null);
  const [hobbiesData, setHobbiesData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [goalsData, setGoalsData] = useState([]);
  const [achievementsData, setAchievementsData] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetch('/Data/personalInfo.json')
      .then(response => response.json())
      .then(data => setPersonalInfo(data))
      .catch(error => console.error('Error loading personal info:', error));

    fetch('/Data/academicWorks.json')
      .then(response => response.json())
      .then(data => setAcademicWorks(data))
      .catch(error => console.error('Error loading academic works:', error));

    fetch('/Data/hobbies.json')
      .then(response => response.json())
      .then(data => setHobbiesData(data))
      .catch(error => console.error('Error loading hobbies:', error));

    fetch('/Data/recommendations.json')
      .then(response => response.json())
      .then(data => setRecommendations(data))
      .catch(error => console.error('Error loading recommendations:', error));

    fetch('/Data/goals.json')
      .then(response => response.json())
      .then(data => setGoalsData(data))
      .catch(error => console.error('Error loading goals:', error));

    fetch('/Data/achievements.json')
      .then(response => response.json())
      .then(data => setAchievementsData(data))
      .catch(error => console.error('Error loading achievements:', error));
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completado': return 'status-completed';
      case 'En progreso': return 'status-progress';
      case 'Planificado': return 'status-planned';
      default: return '';
    }
  };

  const getCategoryClass = (category) => {
    switch (category) {
      case 'Académico': return 'category-academic';
      case 'Competencia': return 'category-competition';
      case 'Desarrollo Personal': return 'category-personal';
      default: return '';
    }
  };

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

  const toggleWorksList = () => {
    setIsExpanded(!isExpanded);
  };

  if (!personalInfo || !academicWorks) {
    return <div>Cargando...</div>;
  }

  const filteredSocialLinks = personalInfo.socialLinks.filter(social =>
    social.icon === 'github' || social.icon === 'linkedin'
  );

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
          {academicWorks.courses.slice(0, 1).map((course, index) => (
            <div key={index} className="course-section">
              <h3>{course.code} - {course.name}</h3>
              <p><strong>Semestre:</strong> {course.semester}</p>
              <p>{course.description}</p>


              <button
                className='toggle-works-btn'
                onClick={toggleWorksList}
                aria-expanded={isExpanded}
              >
                {isExpanded ? 'Ocultar trabajos' : 'Mostrar trabajos'}
                <span>{isExpanded ? '▼' : '►'}</span>
              </button>

              <div className={`works-list ${isExpanded ? 'expanded' : 'collapsed'}`}>

                {course.works.slice(0, 2).map((work, workIndex) => (
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
          <Link to="/academicWorks" className="btn btn-section">
            Ver todos los trabajos académicos
          </Link>
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
          <Link to="/certifications" className="btn btn-section">
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

      <section id="goals" className="section">
        <div className="container">
          <h2 className="section-title">Metas y Plan de Desarrollo</h2>
          <p className="section-subtitle">Mi visión profesional y plan de crecimiento a futuro</p>

          <div className="goals-grid">
            {goalsData.map(goal => (
              <div key={goal.id} className="goal-card">
                <div className="goal-header">
                  <h3>{goal.title}</h3>
                  <span className={`status-badge ${getStatusClass(goal.status)}`}>
                    {goal.status}
                  </span>
                </div>

                <div className="goal-meta">
                  <span className="goal-category">{goal.category}</span>
                  <span className="goal-timeline">{goal.timeline}</span>
                </div>

                <p className="goal-description">{goal.description}</p>

                <div className="goal-actions">
                  <h4>Acciones planificadas:</h4>
                  <ul>
                    {goal.actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>

                <div className="goal-progress">
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getStatusClass(goal.status)}`}
                      style={{
                        width:
                          goal.status === 'Completado' ? '100%' :
                            goal.status === 'En progreso' ? '50%' : '10%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="achievements" className="section">
        <div className="container">
          <h2 className="section-title">Logros y Reconocimientos</h2>
          <p className="section-subtitle">Mis principales méritos y distinciones</p>

          <div className="achievements-grid">
            {achievementsData.map(achievement => (
              <div key={achievement.id} className="achievement-card">
                <div className="achievement-header">
                  <h3>{achievement.title}</h3>
                  <span className={`category-badge ${getCategoryClass(achievement.category)}`}>
                    {achievement.category}
                  </span>
                </div>

                <div className="achievement-meta">
                  <span className="achievement-organization">{achievement.organization}</span>
                  <span className="achievement-date">{achievement.date}</span>
                </div>

                <p className="achievement-description">{achievement.description}</p>

                {achievement.technologies && achievement.technologies.length > 0 && (
                  <div className="achievement-technologies">
                    <h4>Tecnologías utilizadas:</h4>
                    <div className="technologies-list">
                      {achievement.technologies.map((tech, index) => (
                        <span key={index} className="technology-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="recomendaciones" className="section">
        <div className="container">
          <h2 className="section-title">Recomendaciones</h2>
          <div className="recommendations-container">
            {recommendations.slice(0, 3).map((rec, index) => (
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
              <SocialLinks personalInfo={{ ...personalInfo, socialLinks: filteredSocialLinks }} />
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