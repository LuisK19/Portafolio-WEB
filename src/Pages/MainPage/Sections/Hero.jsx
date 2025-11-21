import { useLanguage } from '../../../contexts/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Compensar altura del header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="inicio" className="hero">
      <div className="container">
        <h1>{t('mainPage.welcomeTitle')}</h1>
        <p>{t('hero.greeting')} Luis Trejos. {t('hero.description')}.</p>
        <p>{t('mainPage.welcomeDescription')}.</p>
        <button className="btn" onClick={() => scrollToSection('trabajos-academicos')}>
          {t('hero.viewWorks')}
        </button>
      </div>
    </section>
  );
};

export default Hero;