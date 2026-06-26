import React from 'react';
import { useLanguage } from '../../../Contexts/LanguageContext';
import styles from './Footer.module.css';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <p>Luis Trejos &copy; 2025. {t('footer.rights')}.</p>
      </div>
    </footer>
  );
};

export default Footer;
