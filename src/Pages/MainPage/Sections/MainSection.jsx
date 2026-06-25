import { useState, useEffect } from 'react';
import SocialLinks from '../../../components/SocialIcon';
import FeatureWorks from '/src/components/Works/FeatureWorks.jsx';  
import { useLanguage } from '../../../contexts/LanguageContext';


const MainSection = () => {
  const { t } = useLanguage();
  const [personalInfo, setPersonalInfo] = useState(null);
  const [academicWorks, setAcademicWorks] = useState(null);

  useEffect(() => {
    fetch('/Data/personalInfo.json')
      .then(response => response.json())
      .then(data => setPersonalInfo(data))
      .catch(error => console.error('Error loading personal info:', error));

    fetch('/Data/academicWorks.json')
      .then(response => response.json())
      .then(data => setAcademicWorks(data))
      .catch(error => console.error('Error loading academic works:', error));

  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    alert('¡Mensaje enviado! Te contactaré pronto.');

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };



  if (!personalInfo || !academicWorks) {
    return <div>{t('common.loading')}</div>;
  }

  const filteredSocialLinks = personalInfo.socialLinks.filter(social =>
    social.icon === 'github' || social.icon === 'linkedin'
  );

  return (
    <>
      <section id="inicio" className="hero">
        <div className="container">
          <h1>{t('mainPage.welcomeTitle')}</h1>
          <p>{t('hero.greeting')} Luis Trejos. {t('hero.description')}.</p>
          <p>{t('mainPage.welcomeDescription')}.</p>
        </div>
      </section>

      <section id="feature-works" className="section"> 
        <FeatureWorks />
      </section>

      <section id="contacto" className="section">
        <div className="container">
          <h2 className="section-title">{t('mainPage.contactInfoTitle')}</h2>
          <div className="contact-container">
            <div className="contact-info">
              <p>{t('mainPage.contactDescription')}</p>
              <div className="contact-details">
                <div className="contact-item">
                  <strong>{t('about.email')}:</strong> {personalInfo.email}
                </div>
                <div className="contact-item">
                  <strong>{t('about.phone')}:</strong> {personalInfo.phone}
                </div>
                <div className="contact-item">
                  <strong>{t('about.location')}:</strong> {personalInfo.location}
                </div>
              </div>
              <SocialLinks personalInfo={{ ...personalInfo, socialLinks: filteredSocialLinks }} />
            </div>
            <div className="contact-form">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder={t('mainPage.fullName')}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder={t('mainPage.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="subject"
                  placeholder={t('mainPage.subject')}
                  value={formData.subject}
                  onChange={handleChange}
                />
                <textarea
                  name="message"
                  placeholder={t('mainPage.message')}
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                <button type="submit" className="btn btn-primary">
                  {t('mainPage.sendMessage')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MainSection;