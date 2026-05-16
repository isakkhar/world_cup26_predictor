import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Predictor from './pages/Predictor';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/predict" element={<Predictor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
