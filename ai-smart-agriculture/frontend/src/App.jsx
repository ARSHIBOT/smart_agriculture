import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DiseaseDetection from './pages/DiseaseDetection';
import SoilRecommendation from './pages/SoilRecommendation';
import WeatherAdvisory from './pages/WeatherAdvisory';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/disease-detection" element={<DiseaseDetection />} />
            <Route path="/soil-recommendation" element={<SoilRecommendation />} />
            <Route path="/weather" element={<WeatherAdvisory />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
