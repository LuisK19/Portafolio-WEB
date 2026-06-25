import { useLanguage } from '../../../contexts/LanguageContext';
import WorkItem from '../WorkItem/WorkItem';
import styles from '/src/components/Works/FeatureWorks.module.css';

const MainWork = () => {
    const { t } = useLanguage();

    // Datos del trabajo destacado
    const featuredWork = {
        title: 'Sistema Bancario Digital',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT']
    };

    // Por ahora, simulamos múltiples slides con la misma imagen
    // Más adelante se reemplazarán con imágenes reales del proyecto
    const slides = [0, 1, 2, 3]; // 4 slides de ejemplo

    // Opciones del carousel
    const carouselOptions = {
        loop: true,
        align: 'start'
    };

    return (
        <div className={styles["main-work"]}>
            <WorkItem 
                work={featuredWork} 
                slides={slides} 
                options={carouselOptions} 
            />
        </div>
    );
};

export default MainWork;