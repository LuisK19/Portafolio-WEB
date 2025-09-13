import Header from './components/Layout/Header';
import Hero from './Pages/MainPage/Sections/Hero';
import MainSection from './Pages/MainPage/Sections/MainSection';
import Footer from './components/Layout/Footer';
import CertificationsPage from './Pages/Certifications/CertificationsPage';
import AcademicWorksPage from './Pages/AcademicWorks/AcademinWorksPage';
import { Routes, Route } from 'react-router-dom';
import './styles/base.css';
import './styles/style.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <MainSection />
            </>
          } />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/academicWorks" element={<AcademicWorksPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;