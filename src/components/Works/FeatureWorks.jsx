import { useLanguage } from '../../Contexts/LanguageContext';
import MainWork from './MainWork/MainWork';
import WorkItem from './WorkItem/WorkItem';
import styles from '/src/components/Works/FeatureWorks.module.css';


const FeatureWorks = () => {
    const { t } = useLanguage();

    // Datos para los WorkItem del grid
    const gridWork = {
        title: 'Proyecto Secundario',
        technologies: ['JavaScript', 'CSS', 'HTML']
    };

    const gridSlides = [0, 1]; // 2 slides por item

    const carouselOptions = {
        loop: true,
        align: 'start'
    };

    return (
        <div className="container">
            <h2 className={styles['section-title']}>{t('featureWorks.title')}</h2>
            <MainWork/>
           
            <div className={styles['works-grid']}>
                <WorkItem work={gridWork} slides={gridSlides} options={carouselOptions} variant="small" />
                <WorkItem work={gridWork} slides={gridSlides} options={carouselOptions} variant="small" />
            </div>
        </div>
    );
};

export default FeatureWorks;