import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Loader2, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './Predictor.css';

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all password fields.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (resetError) throw resetError;

      setSuccess(true);
      setTimeout(() => {
        navigate('/predict/recap');
      }, 1500);
    } catch (err: unknown) {
      console.error('Password reset update error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-view-container">
      {/* Background Glow */}
      <div className="auth-bg-orbs">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
      </div>

      <div className="auth-card card-glowing-border">
        <div className="auth-card-glow"></div>
        
        <div className="auth-card-header">
          <h2>🔒 Establish New Password</h2>
          <p>Choose a secure, strong password for your 2026 World Cup Predictor account</p>
        </div>

        {success ? (
          <div className="auth-success-view">
            <ShieldCheck className="auth-success-icon animate-bounce" size={48} />
            <h3>Password Restored!</h3>
            <p>Your new account password has been saved. Redirecting to predictions dashboard...</p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handlePasswordReset}>
            {error && (
              <div className="auth-error-banner">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="auth-input-group">
              <label>New Account Password</label>
              <div className="input-with-icon">
                <Key className="input-icon" size={16} />
                <input 
                  type={showPassword1 ? "text" : "password"} 
                  placeholder="At least 6 characters" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  minLength={6}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle-visibility-btn"
                  onClick={() => setShowPassword1(!showPassword1)}
                  title={showPassword1 ? "Hide password" : "Show password"}
                >
                  {showPassword1 ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-input-group">
              <label>Confirm New Password</label>
              <div className="input-with-icon">
                <Key className="input-icon" size={16} />
                <input 
                  type={showPassword2 ? "text" : "password"} 
                  placeholder="Repeat new password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  minLength={6}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle-visibility-btn"
                  onClick={() => setShowPassword2(!showPassword2)}
                  title={showPassword2 ? "Hide password" : "Show password"}
                >
                  {showPassword2 ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
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
                  <span>Saving secure credentials...</span>
                </>
              ) : (
                'Save Password & Sync Account'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
