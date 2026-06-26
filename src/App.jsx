import Header from './components/Layout/Header/Header';
import MainPage from './Pages/MainPage/MainPage';
import Footer from './components/Layout/Footer/Footer';
import CertificationsPage from './Pages/Certifications/CertificationsPage';
import ProjectsPage from './Pages/Projects/ProjectsPage';
import AboutPage from './Pages/about/AboutPage';
import DarkModeToggle from './components/DarkMode/DarkMode';
import LanguageSelector from './components/LanguageSelector/LanguageSelector';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Header />
      <DarkModeToggle />
      <LanguageSelector />

      <main>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;