import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CertificationsPage = () => {
  const [certifications, setCertifications] = useState([]);
  const [filteredCerts, setFilteredCerts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetch('/data/personalInfo.json')
      .then(response => response.json())
      .then(data => {
        setCertifications(data.certifications);
        setFilteredCerts(data.certifications);
      })
      .catch(error => console.error('Error loading certifications:', error));
  }, []);

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredCerts(certifications);
    } else {
      setFilteredCerts(certifications.filter(cert => 
        cert.organization.toLowerCase().includes(category.toLowerCase())
      ));
    }
  };

  const categories = [
    { id: 'all', name: 'Todas' },
    { id: 'alura', name: 'Alura Latam' },
    { id: 'ina', name: 'INA' },
    { id: 'tec', name: 'TEC' },
    { id: 'mejores', name: 'Mejores Costa Rica' }
  ];

  return (
    <div className="certifications-page">
      <div className="container">
        <header className="certifications-header">
          <Link to="/" className="back-btn">← Volver al Portafolio</Link>
          <h1>Mis Certificaciones</h1>
          <p>Documentación oficial de mis estudios, cursos y certificaciones obtenidas</p>
        </header>

        <div className="filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => filterByCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="certifications-grid">
          {filteredCerts.map((cert, index) => (
            <div key={index} className="certification-card">
              <div className="cert-header">
                <h3>{cert.title}</h3>
                <span className="organization-badge">{cert.organization}</span>
              </div>
              <div className="cert-details">
                <p className="date">Emitido: {cert.date}</p>
                <p className="cert-id">ID: {cert.certId || 'N/A'}</p>
              </div>
              <div className="cert-actions">
                {cert.link && cert.link !== '#' ? (
                  <a 
                    href={cert.link} 
                    className="view-cert-btn"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Ver Certificado
                  </a>
                ) : (
                  <span className="no-cert-available">Certificado no disponible online</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredCerts.length === 0 && (
          <div className="no-results">
            <p>No se encontraron certificaciones en esta categoría</p>
          </div>
        )}

        <footer className="certifications-footer">
          <p>Para verificar la autenticidad de estas certificaciones, contáctame directamente.</p>
        </footer>
      </div>
    </div>
  );
};

export default CertificationsPage;