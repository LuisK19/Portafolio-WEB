import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Certifications.module.css';

const CertificationsPage = () => {
  const { t } = useLanguage();
  const [certifications, setCertifications] = useState([]);
  const [filteredCerts, setFilteredCerts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetch('/Data/personalInfo.json')
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
    <div className={styles.certificationsPage}>
      <div className="container">
        <header className={styles.certificationsHeader}>
          <h1>{t('certifications.title')}</h1>
          <p>{t('certifications.description')}</p>
        </header>

        <div className={styles.filters}>
          <p>Filtrar por categoría:</p>
          {categories.map(category => (
            <button
              key={category.id}
              className={`${styles.filterBtn} ${selectedCategory === category.id ? styles.active : ''}`}
              onClick={() => filterByCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className={styles.certificationsGrid}>
          {filteredCerts.map((cert, index) => (
            <div key={index} className={styles.certificationCard}>
              <div className={styles.certHeader}>
                <h3>{cert.title}</h3>
                <span className={styles.organizationBadge}>{cert.organization}</span>
              </div>
              <div className={styles.certDetails}>
                <p className={styles.date}>Emitido: {cert.date}</p>
                <p className={styles.certId}>ID: {cert.certId || 'N/A'}</p>
              </div>
              <div className={styles.certActions}>
                {cert.link && cert.link !== '#' ? (
                  <a
                    href={cert.link}
                    className={styles.viewCertBtn}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('certifications.viewCertificate')}
                  </a>
                ) : (
                  <span className={styles.noCertAvailable}>{t('common.error')}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredCerts.length === 0 && (
          <div className={styles.noResults}>
            <p>{t('academicWorks.noWorks')}</p>
          </div>
        )}

        <footer className={styles.certificationsFooter}>
          <p>{t('academicWorks.contactInfo')}</p>
          <Link to="/" className={styles.backBtn}>← {t('certifications.backToPortfolio')}</Link>
        </footer>
      </div>
    </div>
  );
};

export default CertificationsPage;
