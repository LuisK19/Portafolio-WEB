import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'es';
  });
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Solo mostrar loading en la primera carga
        if (initialLoad) {
          setLoading(true);
        }
        const response = await fetch(`/Data/translations-${language}.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    loadTranslations();
  }, [language, initialLoad]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.lang = newLanguage;
  };

  const t = (key) => {
    // Si las traducciones aún están cargando, retornar el key
    if (loading || !translations || Object.keys(translations).length === 0) {
      return key;
    }
    
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};
