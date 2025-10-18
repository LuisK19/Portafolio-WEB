import Header from './components/Layout/Header';
import Hero from './Pages/MainPage/Sections/Hero';
import MainSection from './Pages/MainPage/Sections/MainSection';
import Footer from './components/Layout/Footer';
import CertificationsPage from './Pages/Certifications/CertificationsPage';
import AcademicWorksPage from './Pages/AcademicWorks/AcademicWorksPage';
import AboutPage from './Pages/about/AboutPage';
import { Routes, Route } from 'react-router-dom';
import './styles/base.css';
import './styles/style.css';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
      if (hash) {
        // Esperar a que el DOM esté listo
        setTimeout(() => {
          const id = hash.replace('#', '');
          const el = document.getElementById(id);
          if (el) {
            const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, [pathname, hash]);
    return null;
  };

  return (
    <div className="App">
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <MainSection />
            </>
          } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/academicWorks" element={<AcademicWorksPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;