import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Loader2, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './Predictor.css';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (activeTab === 'signup' && !username.trim()) {
      setError('Please choose a display username.');
      setLoading(false);
      return;
    }

    try {
      if (activeTab === 'signup') {
        const cleanedUsername = username.trim().replace(/[^a-zA-Z0-9 ]/g, '');
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              username: cleanedUsername
            }
          }
        });

        if (signUpError) throw signUpError;

        if (data?.user) {
          setSuccess(true);
          setTimeout(() => {
            navigate('/predict/recap');
          }, 1500);
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });

        if (signInError) throw signInError;

        if (data?.user) {
          setSuccess(true);
          setTimeout(() => {
            navigate('/predict/recap');
          }, 1000);
        }
      }
    } catch (err: unknown) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-view-container">
      {/* Background Orb Visual Effects */}
      <div className="auth-bg-orbs">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
      </div>

      <button className="auth-back-btn" onClick={() => navigate('/predict/recap')}>
        <ArrowLeft size={16} />
        Back to Predictions
      </button>

      <div className="auth-card card-glowing-border">
        <div className="auth-card-glow"></div>
        
        <div className="auth-card-header">
          <h2>🏆 2026 World Cup Predictor</h2>
          <p>Sign up or log in to sync your bracket and join the global leaderboard</p>
        </div>

        {/* Tab Selector */}
        <div className="auth-tabs">
          <button 
            type="button" 
            className={`auth-tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => { setActiveTab('signin'); setError(null); }}
          >
            Sign In
          </button>
          <button 
            type="button" 
            className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => { setActiveTab('signup'); setError(null); }}
          >
            Create Account
          </button>
        </div>

        {/* Auth Forms */}
        {success ? (
          <div className="auth-success-view">
            <ShieldCheck className="auth-success-icon animate-bounce" size={48} />
            <h3>Success!</h3>
            <p>{activeTab === 'signup' ? 'Your account was created securely.' : 'Welcome back!'} Redirecting you...</p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {error && (
              <div className="auth-error-banner">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {activeTab === 'signup' && (
              <div className="auth-input-group">
                <label>Display Username</label>
                <div className="input-with-icon">
                  <UserIcon className="input-icon" size={16} />
                  <input 
                    type="text" 
                    placeholder="e.g. WorldCupPro99" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ''))}
                    maxLength={20}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-input-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={16} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={16} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="spinning" size={18} />
                  <span>Processing secure authentication...</span>
                </>
              ) : (
                activeTab === 'signup' ? 'Register & Sync Predictions' : 'Log In & Retrieve Selections'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
