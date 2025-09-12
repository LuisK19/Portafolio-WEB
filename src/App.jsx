import Header from './components/Layout/Header';
import Hero from './Pages/MainPage/Sections/Hero';
import MainSection from './Pages/MainPage/Sections/MainSection';
import Footer from './components/Layout/Footer';
import './styles/base.css';
import './styles/style.css';



function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <MainSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;

