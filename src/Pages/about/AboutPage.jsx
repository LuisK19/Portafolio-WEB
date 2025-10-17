import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SocialLinks from '../../components/SocialIcon';
import '/src/styles/personalInfo.css';


const AboutPage = () => {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [newRecommendation, setNewRecommendation] = useState({
    name: '',
    position: '',
    text: ''
  });

  useEffect(() => {
    // Cargar información personal
    fetch('/Data/personalInfo.json')
      .then(response => response.json())
      .then(data => setPersonalInfo(data))
      .catch(error => console.error('Error loading personal info:', error));

    // Cargar recomendaciones desde tu archivo local
    fetch('/Data/recommendations.json')
      .then(response => response.json())
      .then(data => setRecommendations(data))
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

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Error al guardar la recomendación');

      // Limpiar formulario
      setNewRecommendation({ name: '', position: '', text: '' });

      // Recargar las recomendaciones para mostrar la nueva
      const recommendationsResponse = await fetch('/Data/recommendations.json');
      const updatedRecommendations = await recommendationsResponse.json();
      setRecommendations(updatedRecommendations);

      alert('¡Gracias por tu recomendación! Ha sido agregada exitosamente.');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la recomendación: ' + error.message);
    }
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
    return <div className="loading">Cargando información...</div>;
  }

  return (
    <div className="about-page">
      <div className="container">
        <header className="about-header">
          <h1>Sobre Mí</h1>
          <p>Conoce más sobre mi trayectoria profesional y habilidades</p>
        </header>

        <section className="profile-section">
          <div className="profile-content">
            <div className="profile-image">
              <img src={personalInfo.photo || "/images/placeholder.jpg"} alt={personalInfo.name} />
            </div>
            <div className="profile-info">
              <h2>{personalInfo.name}</h2>
              <h3>{personalInfo.title}</h3>
              <p>{personalInfo.bio}</p>
              <div className="contact-details">
                <p><strong>Email:</strong> {personalInfo.email}</p>
                <p><strong>Teléfono:</strong> {personalInfo.phone}</p>
                <p><strong>Ubicación:</strong> {personalInfo.location}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="skills-section">
          <h2>Habilidades Técnicas</h2>
          <div className="skills-grid">
            {personalInfo.skills.map((category, index) => (
              <div key={index} className="skill-category-card">
                <h3>{category.category}</h3>
                <div className="skills-list">
                  {category.items.map((skill, skillIndex) => (
                    <div key={skillIndex} className="skill-item">
                      <div className="skill-header">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-percentage">{skill.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div
                          className="skill-progress"
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

        <section className="social-section">
          <h2>Conectemos</h2>
          <SocialLinks personalInfo={personalInfo} />
        </section>

        <section className="recommendations-section">
          <h2>Recomendaciones</h2>

          <div className="add-recommendation">
            <h3>Agregar una recomendación</h3>
            <form onSubmit={handleRecommendationSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Tu nombre"
                  value={newRecommendation.name}
                  onChange={handleRecommendationChange}
                  required
                />
                <input
                  type="text"
                  name="position"
                  placeholder="Tu puesto o relación"
                  value={newRecommendation.position}
                  onChange={handleRecommendationChange}
                  required
                />
              </div>
              <textarea
                name="text"
                placeholder="Tu recomendación"
                rows="3"
                value={newRecommendation.text}
                onChange={handleRecommendationChange}
                required
              ></textarea>
              <button type="submit" className="btn">
                Enviar recomendación
              </button>
            </form>
          </div>

          <div className="recommendations-feed">
            {recommendations.map((rec, index) => (
              <div key={index} className="recommendation-card">
                <div className="recommendation-header">
                  <h3>{rec.name}</h3>
                  <span className="position">{rec.position}</span>
                </div>
                <p className="text">"{rec.text}"</p>
              </div>
            ))}
          </div>
        </section>

        <section className="export-section">
          <button onClick={exportToPDF} className="btn btn-primary">
            Exportar CV a PDF
          </button>
        </section>

        <div className="back-to-home">
          <Link to="/" className="back-btn">← Volver al Inicio</Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;