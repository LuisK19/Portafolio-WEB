import Header from './components/Layout/Header';
import Hero from './components/Sections/Hero';
import AcademicWorks from './components/Sections/AcademicWorks';
import About from './components/Sections/About';
import Recommendations from './components/Sections/Recommendations';
import Hobbies from './components/Sections/Hobbies';
import Certifications from './components/Sections/Certifications';
import Contact from './components/Sections/Contact';
import Footer from './components/Layout/Footer';
import './styles/base.css';
import './styles/style.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <About />
        <Certifications />
        <Hobbies />
        <Recommendations />
        <AcademicWorks />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;

