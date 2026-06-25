import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'es' ? 'en' : 'es';
    changeLanguage(newLanguage);
  };

  return (
    <button 
      className="language-selector"
      onClick={toggleLanguage}
      aria-label={`Cambiar idioma a ${language === 'es' ? 'inglés' : 'español'}`}
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <span className="language-flag">{language === 'es' ? '🇺🇸' : '🇪🇸'}</span>
      <span className="language-text">{language === 'es' ? 'EN' : 'ES'}</span>
    </button>
  );
};

export default LanguageSelector;
