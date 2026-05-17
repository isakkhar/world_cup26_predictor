import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Loader2, ArrowLeft, ShieldCheck, AlertCircle, Inbox, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './Predictor.css';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const navigate = useNavigate();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResetSent(false);

    if (activeTab === 'forgot') {
      if (!email.trim()) {
        setError('Please enter your account email.');
        setLoading(false);
        return;
      }

      try {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/predict/reset-password`
        });

        if (resetError) throw resetError;

        setResetSent(true);
      } catch (err: unknown) {
        console.error('Password reset email error:', err);
        setError(err instanceof Error ? err.message : 'Failed to send recovery email. Please check address and try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

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
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (signUpError) throw signUpError;

        if (data?.user) {
          if (!data.session) {
            // Email confirmation is required
            setSuccess(true);
            setError('Account created! Please check your email to confirm your address before logging in.');
            setLoading(false);
            return;
          } else {
            setSuccess(true);
            setTimeout(() => {
              navigate('/predict/recap');
            }, 1500);
          }
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

  // Clear ugly Supabase hash errors from the URL if present
  useEffect(() => {
    const sessionErr = sessionStorage.getItem('auth_error');
    if (sessionErr) {
      setError(sessionErr);
      sessionStorage.removeItem('auth_error');
    } else if (window.location.hash && window.location.hash.includes('error_code=otp_expired')) {
      // Fallback in case App.tsx didn't catch it
      setError('Your email link has expired or was already used. Please log in below.');
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

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
          {activeTab === 'forgot' ? (
            <>
              <h2>🔒 Recover Password</h2>
              <p>Enter your verified email address to receive a secure recovery credentials link</p>
            </>
          ) : (
            <>
              <h2>🏆 2026 World Cup Predictor</h2>
              <p>Sign up or log in to sync your bracket and join the global leaderboard</p>
            </>
          )}
        </div>

        {/* Segment Tabs */}
        {activeTab === 'forgot' ? (
          <button 
            type="button" 
            className="auth-back-to-login" 
            onClick={() => { setActiveTab('signin'); setError(null); }}
          >
            ← Return to Log In
          </button>
        ) : (
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
        )}

        {/* Success View */}
        {success ? (
          <div className="auth-success-view">
            <ShieldCheck className="auth-success-icon animate-bounce" size={48} />
            <h3>Success!</h3>
            <p>{activeTab === 'signup' ? 'Your account was created securely.' : 'Welcome back!'} Redirecting you...</p>
          </div>
        ) : resetSent ? (
          <div className="auth-success-view">
            <Inbox className="auth-success-icon animate-pulse" size={48} style={{ color: '#3b82f6' }} />
            <h3>Recovery Email Dispatched!</h3>
            <p>We've sent a password reset link to <strong>{email}</strong>. Check your inbox and spam folders to continue.</p>
            <button 
              type="button" 
              className="auth-submit-btn" 
              style={{ marginTop: '1.5rem' }}
              onClick={() => { setActiveTab('signin'); setEmail(''); setResetSent(false); }}
            >
              Back to Login Screen
            </button>
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

            {activeTab !== 'forgot' && (
              <div className="auth-input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ marginBottom: 0 }}>Password</label>
                  {activeTab === 'signin' && (
                    <button 
                      type="button" 
                      className="forgot-password-link" 
                      onClick={() => { setActiveTab('forgot'); setError(null); }}
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={16} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    minLength={6}
                    required
                  />
                  <button 
                    type="button"
                    className="password-toggle-visibility-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

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
              ) : activeTab === 'forgot' ? (
                'Send Password Recovery Email'
              ) : activeTab === 'signup' ? (
                'Register & Sync Predictions'
              ) : (
                'Log In & Retrieve Selections'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
