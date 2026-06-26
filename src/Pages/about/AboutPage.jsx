import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../Contexts/LanguageContext';
import SocialLinks from '../../components/SocialIcons/SocialIcon';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  const { t } = useLanguage();
  const [personalInfo, setPersonalInfo] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [newRecommendation, setNewRecommendation] = useState({
    name: '',
    position: '',
    text: ''
  });

  //Paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    // Load personal info
    fetch('/Data/personalInfo.json')
      .then(response => response.json())
      .then(data => setPersonalInfo(data))
      .catch(error => console.error('Error loading personal info:', error));

    // Load recommendations from the function
    fetch('/.netlify/functions/get-recommendations')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const sortedRecommendations = data.recommendations.reverse();
          setRecommendations(sortedRecommendations);

        } else {
          console.error('Error loading recommendations:', data.error);
        }
      })
      .catch(error => console.error('Error loading recommendations:', error));
  }, []);


  const handleRecommendationChange = (e) => {
    const { name, value } = e.target;
    setNewRecommendation(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRecommendationSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/.netlify/functions/update-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecommendation)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      const result = await res.json();

      // Limpiar formulario
      setNewRecommendation({ name: '', position: '', text: '' });

      // Recargar y reordenar las recomendaciones
      const recommendationsResponse = await fetch('/.netlify/functions/get-recommendations');
      const recommendationsData = await recommendationsResponse.json();
      if (recommendationsData.success) {
        const sortedRecommendations = recommendationsData.recommendations.reverse();
        setRecommendations(sortedRecommendations);
        setCurrentPage(1); // Volver a la primera página después de agregar
      }

      alert('¡Gracias por tu recomendación! Ha sido agregada exitosamente.');
    } catch (error) {
      console.error('Error completo:', error);
      alert('Error al guardar la recomendación: ' + error.message);
    }
  };

  // Pagina: Cálculo de elementos a mostrar
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecommendations = recommendations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navegación de páginas
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const exportToPDF = async () => {
    try {
      // Importación dinámica de jsPDF
      const { jsPDF } = await import('jspdf');

      // Cargar datos adicionales necesarios
      let academicData = { courses: [] };
      let hobbiesData = [];

      try {
        const academicResponse = await fetch('/Data/academicWorks.json');
        academicData = await academicResponse.json();
      } catch (error) {
        console.error('Error loading academic works:', error);
      }

      try {
        const hobbiesResponse = await fetch('/Data/hobbies.json');
        hobbiesData = await hobbiesResponse.json();
      } catch (error) {
        console.error('Error loading hobbies:', error);
      }

      // Crear el documento PDF
      const doc = new jsPDF();

      // Configuración inicial
      let yPosition = 20;
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const contentWidth = pageWidth - 2 * margin;

      // Función para agregar texto con manejo de saltos de página
      const addText = (text, x, y, styles = {}) => {
        const { fontSize = 12, fontStyle = 'normal', align = 'left', maxWidth = contentWidth, color = [0, 0, 0] } = styles;
        doc.setFontSize(fontSize);
        doc.setFont(undefined, fontStyle);
        doc.setTextColor(...color);

        const textLines = doc.splitTextToSize(text, maxWidth);
        if (y + textLines.length * (fontSize / 3) > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }

        doc.text(textLines, x, y, { align }); // <-- aquí se usa align
        return y + textLines.length * (fontSize / 3) + 5;
      };

      // Función para dibujar una línea separadora
      const drawLine = (y) => {
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        return y + 10;
      };

      // Encabezado del CV
      doc.setFillColor(0, 103, 79); // Color primario de tu tema
      doc.rect(0, 0, pageWidth, 50, 'F');

      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255); // Texto blanco
      doc.text(personalInfo.name, margin, 25);

      doc.setFontSize(14);
      doc.text(personalInfo.title, margin, 35);

      // RESTABLECER COLOR DEL TEXTO A NEGRO para el contenido
      doc.setTextColor(0, 0, 0);

      yPosition = 60;

      // Información de contacto
      yPosition = addText('INFORMACIÓN DE CONTACTO', margin, yPosition, { fontSize: 16, fontStyle: 'bold' });
      yPosition = addText(`Email: ${personalInfo.email}`, margin, yPosition);
      yPosition = addText(`Teléfono: ${personalInfo.phone}`, margin, yPosition);
      yPosition = addText(`Ubicación: ${personalInfo.location}`, margin, yPosition);

      // Enlaces sociales
      const socialLinksText = personalInfo.socialLinks.map(link => `${link.name}: ${link.url}`).join(' | ');
      yPosition = addText(socialLinksText, margin, yPosition, { fontSize: 10 });

      yPosition = drawLine(yPosition);

      // Biografía
      yPosition = addText('PERFIL PROFESIONAL', margin, yPosition, { fontSize: 16, fontStyle: 'bold' });
      yPosition = addText(personalInfo.bio, margin, yPosition);

      yPosition = drawLine(yPosition);

      // Habilidades técnicas
      yPosition = addText('HABILIDADES TÉCNICAS', margin, yPosition, { fontSize: 16, fontStyle: 'bold' });

      personalInfo.skills.forEach(category => {
        yPosition = addText(category.category.toUpperCase(), margin, yPosition, { fontSize: 14, fontStyle: 'bold' });

        category.items.forEach(skill => {
          const skillText = `${skill.name}: ${skill.level}%`;
          yPosition = addText(skillText, margin + 5, yPosition);
        });

        yPosition += 5;
      });

      yPosition = drawLine(yPosition);

      // Experiencia académica (trabajos por curso)
      yPosition = addText('EXPERIENCIA ACADÉMICA', margin, yPosition, { fontSize: 16, fontStyle: 'bold' });

      if (academicData.courses && academicData.courses.length > 0) {
        academicData.courses.forEach(course => {
          yPosition = addText(`${course.code} - ${course.name}`, margin, yPosition, { fontSize: 14, fontStyle: 'bold' });
          yPosition = addText(`Semestre: ${course.semester}`, margin, yPosition, { fontSize: 12 });
          yPosition = addText(course.description, margin, yPosition, { fontSize: 10 });

          if (course.works && course.works.length > 0) {
            yPosition = addText('Trabajos:', margin, yPosition, { fontSize: 12, fontStyle: 'bold' });

            course.works.forEach(work => {
              yPosition = addText(`• ${work.name} (${work.type})`, margin + 5, yPosition);
              yPosition = addText(`  Fecha: ${work.date}`, margin + 5, yPosition, { fontSize: 10 });
              yPosition = addText(`  Tecnologías: ${work.technologies.join(', ')}`, margin + 5, yPosition, { fontSize: 10 });

              if (work.description) {
                yPosition = addText(`  Descripción: ${work.description}`, margin + 5, yPosition, { fontSize: 10 });
              }

              yPosition += 3;
            });
          }

          yPosition += 5;
        });
      } else {
        yPosition = addText('No hay información académica disponible', margin, yPosition);
      }

      yPosition = drawLine(yPosition);

      // Certificaciones
      yPosition = addText('CERTIFICACIONES', margin, yPosition, { fontSize: 16, fontStyle: 'bold' });

      if (personalInfo.certifications && personalInfo.certifications.length > 0) {
        personalInfo.certifications.forEach(cert => {
          yPosition = addText(cert.title, margin, yPosition, { fontSize: 14, fontStyle: 'bold' });
          yPosition = addText(`${cert.organization} - ${cert.date}`, margin, yPosition);

          if (cert.certId) {
            yPosition = addText(`ID: ${cert.certId}`, margin, yPosition, { fontSize: 10 });
          }

          yPosition += 5;
        });
      } else {
        yPosition = addText('No hay certificaciones disponibles', margin, yPosition);
      }

      yPosition = drawLine(yPosition);

      // Hobbies e intereses
      yPosition = addText('HOBBIES E INTERESES', margin, yPosition, { fontSize: 16, fontStyle: 'bold' });

      if (hobbiesData && hobbiesData.length > 0) {
        hobbiesData.forEach(hobby => {
          yPosition = addText(`${hobby.icon} ${hobby.title}`, margin, yPosition, { fontSize: 14 });
          yPosition = addText(hobby.description, margin, yPosition, { fontSize: 10 });
          yPosition += 5;
        });
      } else {
        yPosition = addText('No hay hobbies disponibles', margin, yPosition);
      }

      yPosition = drawLine(yPosition);


      yPosition = addText('RECOMENDACIONES', margin, yPosition, { fontSize: 16, fontStyle: 'bold' });

      if (recommendations && recommendations.length > 0) {
        recommendations.forEach(rec => {
          yPosition = addText(`"${rec.text}"`, margin, yPosition, { fontStyle: 'italic' });
          yPosition = addText(`- ${rec.name}, ${rec.position}`, margin, yPosition, { align: 'right', fontSize: 10 });
          yPosition += 10;
        });
      } else {
        yPosition = addText('No hay recomendaciones disponibles', margin, yPosition);
      }


      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
        doc.text('CV generado desde mi portafolio personal', margin, doc.internal.pageSize.getHeight() - 10);
      }


      doc.save(`CV_${personalInfo.name.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta nuevamente.');
    }
  };


  if (!personalInfo) {
    return <div className={styles.loading}>Cargando información...</div>;
  }

  return (
    <div className={styles.aboutPage}>
      <div className="container">
        <header className={styles.aboutHeader}>
          <h1>Sobre Mí</h1>
          <p>Conoce más sobre mi trayectoria profesional y habilidades</p>
        </header>

        <section className={styles.profileSection}>
          <div className={styles.profileContent}>
            <div className={styles.profileImage}>
              <img src={personalInfo.photo} alt={personalInfo.name} />
            </div>
            <div className={styles.profileInfo}>
              <h2>{personalInfo.name}</h2>
              <h3>{personalInfo.title}</h3>
              <p>{personalInfo.bio}</p>
              <div className={styles.contactDetails}>
                <p><strong>{t('about.email')}:</strong> {personalInfo.email}</p>
                <p><strong>{t('about.phone')}:</strong> {personalInfo.phone}</p>
                <p><strong>{t('about.location')}:</strong> {personalInfo.location}</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.skillsSection}>
          <h2>{t('about.skills')}</h2>
          <div className={styles.skillsGrid}>
            {personalInfo.skills.map((category, index) => (
              <div key={index} className={styles.skillCategoryCard}>
                <h3>{category.category}</h3>
                <div className={styles.skillsList}>
                  {category.items.map((skill, skillIndex) => (
                    <div key={skillIndex} className={styles.skillItem}>
                      <div className={styles.skillHeader}>
                        <span className={styles.skillName}>{skill.name}</span>
                        <span className={styles.skillPercentage}>{skill.level}%</span>
                      </div>
                      <div className={styles.skillBar}>
                        <div
                          className={styles.skillProgress}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.socialSection}>
          <h2>{t('about.socialMedia')}</h2>
          <SocialLinks personalInfo={personalInfo} />
        </section>

        <section className={styles.recommendationsSection}>
          <h2>{t('about.recommendations')}</h2>

          <div className={styles.addRecommendation}>
            <h3>{t('about.addRecommendation')}</h3>
            <form onSubmit={handleRecommendationSubmit}>
              <div className={styles.formRow}>
                <label htmlFor="recommendation-name" className="sr-only">{t('about.yourName')}</label>
                <input
                  id="recommendation-name"
                  type="text"
                  name="name"
                  placeholder={t('about.yourName')}
                  value={newRecommendation.name}
                  onChange={handleRecommendationChange}
                  required
                  aria-label={t('about.yourName')}
                />
                <label htmlFor="recommendation-position" className="sr-only">{t('about.yourPosition')}</label>
                <input
                  id="recommendation-position"
                  type="text"
                  name="position"
                  placeholder={t('about.yourPosition')}
                  value={newRecommendation.position}
                  onChange={handleRecommendationChange}
                  required
                  aria-label={t('about.yourPosition')}
                />
              </div>
              <label htmlFor="recommendation-text" className="sr-only">{t('about.yourRecommendation')}</label>
              <textarea
                id="recommendation-text"
                name="text"
                placeholder={t('about.yourRecommendation')}
                rows="3"
                value={newRecommendation.text}
                onChange={handleRecommendationChange}
                required
                aria-label={t('about.yourRecommendation')}
              ></textarea>
              <button type="submit" className="btn">
                {t('about.submit')}
              </button>
            </form>
          </div>

          {/*SECCIÓN DE PAGINACIÓN - INFO */}
          {recommendations.length > 0 && (
            <div className={styles.paginationInfo}>
              <p>
                {t('about.showing')} {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, recommendations.length)} {t('about.of')} {recommendations.length} {t('about.recommendationsOf')}
                {totalPages > 1 && ` (${t('about.page')} ${currentPage} ${t('about.of')} ${totalPages})`}
              </p>
            </div>
          )}

          <div className={styles.recommendationsFeed}>
            {currentRecommendations.map((rec, index) => (
              <div key={index} className={styles.recommendationCard}>
                <div className={styles.recommendationHeader}>
                  <h3>{rec.name}</h3>
                  <span className={styles.position}>{rec.position}</span>
                </div>
                <p className={styles.text}>"{rec.text}"</p>
              </div>
            ))}
          </div>

          {/*PAGINACIÓN - CONTROLES */}
          {totalPages > 1 && (
            <div className={styles.paginationControls}>
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={styles.paginationBtn}
              >
                ← {t('about.previous')}
              </button>

              <div className={styles.pageNumbers}>
                {getPageNumbers().map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`${styles.paginationBtn} ${currentPage === number ? styles.active : ''}`}
                  >
                    {number}
                  </button>
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={styles.paginationBtn}
              >
                {t('about.next')} →
              </button>
            </div>
          )}
        </section>

        <section className={styles.exportSection}>
          <button onClick={exportToPDF} className="btn">
            {t('about.downloadCV')}
          </button>
        </section>

        <div className={styles.backToHome}>
          <Link to="/" className="back-btn">← {t('academicWorks.backToPortfolio')}</Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
