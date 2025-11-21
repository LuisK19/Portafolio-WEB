import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer>
      <div className="container">
        <p>Luis Trejos &copy; 2025. {t('footer.rights')}.</p>
      </div>
    </footer>
  );
};

export default Footer;