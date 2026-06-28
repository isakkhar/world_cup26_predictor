import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PredictorLayout from './pages/predictor/PredictorLayout';
import GroupStage from './pages/predictor/GroupStage';
import ThirdPlace from './pages/predictor/ThirdPlace';
import KnockoutStage from './pages/predictor/KnockoutStage';
import PredictionRecap from './pages/predictor/PredictionRecap';
import GlobalTrends from './pages/predictor/GlobalTrends';
import LiveCompare from './pages/predictor/LiveCompare';
import Leaderboard from './pages/predictor/Leaderboard';
import SharedBracketViewer from './pages/predictor/SharedBracketViewer';
import AuthPage from './pages/predictor/AuthPage';
import ProfilePage from './pages/predictor/ProfilePage';
import ResetPasswordPage from './pages/predictor/ResetPasswordPage';
import { PredictorProvider } from './context/PredictorContext';
import './index.css';

function App() {
  // Global interceptor for Supabase auth errors (e.g., otp_expired from email links)
  useEffect(() => {
    if (window.location.hash && window.location.hash.includes('error_code=otp_expired')) {
      sessionStorage.setItem('auth_error', 'Your email link has expired or was already used. Please log in.');
      window.history.replaceState(null, '', window.location.pathname);
      // Force redirect to auth page if they aren't already there
      if (!window.location.pathname.includes('/predict/auth')) {
        window.location.href = '/predict/auth';
      }
    }
  }, []);

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
              <Route path="recap" element={<PredictionRecap />} />
              <Route path="compare" element={<LiveCompare />} />
              <Route path="trends" element={<GlobalTrends />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="share" element={<SharedBracketViewer />} />
              <Route path="auth" element={<AuthPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </PredictorProvider>
  );
}

export default App;
