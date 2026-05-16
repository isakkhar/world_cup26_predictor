import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PredictorLayout from './pages/predictor/PredictorLayout';
import GroupStage from './pages/predictor/GroupStage';
import ThirdPlace from './pages/predictor/ThirdPlace';
import KnockoutStage from './pages/predictor/KnockoutStage';
import { PredictorProvider } from './context/PredictorContext';
import './index.css';

function App() {
  return (
    <PredictorProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/predict" element={<PredictorLayout />}>
              <Route index element={<Navigate to="groups" replace />} />
              <Route path="groups" element={<GroupStage />} />
              <Route path="third-place" element={<ThirdPlace />} />
              <Route path="knockouts" element={<KnockoutStage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </PredictorProvider>
  );
}

export default App;
