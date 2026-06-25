import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GithubOutlined, GlobalOutlined } from '@ant-design/icons';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './AcademicWorks.module.css';

const AcademicWorksPage = () => {
    const { t } = useLanguage();
    const [academicWorks, setAcademicWorks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/Data/academicWorks.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo JSON');
                }
                return response.json();
            })
            .then(data => {
                setAcademicWorks(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading academic works:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className={styles.worksPage}>
                <div className="container">
                    <div className={styles.loading}>{t('academicWorks.loading')}</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.worksPage}>
                <div className="container">
                    <div className={styles.error}>
                        <h2>{t('academicWorks.errorTitle')}</h2>
                        <p>{error}</p>
                        <Link to="/" className={styles.backBtn}>{t('academicWorks.backToPortfolio')}</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!academicWorks || !academicWorks.courses || academicWorks.courses.length === 0) {
        return (
            <div className={styles.worksPage}>
                <div className="container">
                    <div className={styles.noData}>
                        <h2>{t('academicWorks.noDataTitle')}</h2>
                        <Link to="/" className={styles.backBtn}>{t('academicWorks.backToPortfolio')}</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.worksPage}>
            <div className="container">
                <header className={styles.worksHeader}>
                    <h1>{t('academicWorks.title')}</h1>
                    <p>{t('academicWorks.description')}</p>
                </header>

                <footer className={styles.worksFooter}>
                    <p>{t('academicWorks.contactInfo')}</p>
                    <Link to="/" className={styles.backBtn}>{t('academicWorks.backToPortfolio')}</Link>
                </footer>
            </div>
        </div>
    );
};

export default AcademicWorksPage;