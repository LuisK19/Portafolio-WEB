import React from 'react';
import { useLanguage } from '../../Contexts/LanguageContext';
import styles from './LanguageSelector.module.css';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'es' ? 'en' : 'es';
    changeLanguage(newLanguage);
  };

  return (
    <button
      className={styles.languageSelector}
      onClick={toggleLanguage}
      aria-label={`Cambiar idioma a ${language === 'es' ? 'inglés' : 'español'}`}
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <span className={styles.languageFlag}>{language === 'es' ? '🇺🇸' : '🇪🇸'}</span>
      <span className={styles.languageText}>{language === 'es' ? 'EN' : 'ES'}</span>
    </button>
  );
};

export default LanguageSelector;
