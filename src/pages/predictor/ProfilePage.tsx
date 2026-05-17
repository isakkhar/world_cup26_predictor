import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Calendar, Key, Loader2, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { usePredictor } from '../../context/PredictorContext';
import { supabase } from '../../lib/supabase';
import './Predictor.css';

const ProfilePage: React.FC = () => {
  const { user, signOut } = usePredictor();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasBracket, setHasBracket] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/predict/groups');
      return;
    }

    const checkActiveBracket = async () => {
      try {
        const { data, error } = await supabase
          .from('predictions')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setHasBracket(!!data);
      } catch (err) {
        console.error('Failed to query bracket status:', err);
      }
    };

    checkActiveBracket();
  }, [user, navigate]);

  if (!user) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all required password fields.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and password confirmation do not match.');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      setSuccess('Your account password was updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      console.error('Error updating password:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during password update.');
    } finally {
      setLoading(false);
    }
  };

  const username = user.user_metadata?.username || user.email?.split('@')[0] || 'Predictor';
  const creationDate = user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown';

  return (
    <div className="profile-container">
      {/* Background Glow */}
      <div className="auth-bg-orbs">
        <div className="auth-orb auth-orb-1" style={{ background: 'var(--primary)' }}></div>
        <div className="auth-orb auth-orb-2" style={{ background: '#3b82f6' }}></div>
      </div>

      <div className="profile-card card-glowing-border">
        <div className="profile-header">
          <div className="profile-avatar-circle">
            <UserIcon size={32} />
          </div>
          <h2>{username}'s Dashboard</h2>
          <p className="profile-email-sub">{user.email}</p>
        </div>

        {/* User Statistics Grid */}
        <div className="profile-stats-grid">
          <div className="profile-stat-item">
            <Mail className="stat-icon" size={18} />
            <div className="stat-info">
              <span className="stat-label">Email Verified</span>
              <span className="stat-val">{user.email_confirmed_at ? 'Yes ✓' : 'Pending'}</span>
            </div>
          </div>
          <div className="profile-stat-item">
            <Calendar className="stat-icon" size={18} />
            <div className="stat-info">
              <span className="stat-label">Joined Date</span>
              <span className="stat-val">{creationDate}</span>
            </div>
          </div>
          <div className="profile-stat-item">
            <ShieldAlert className="stat-icon" size={18} />
            <div className="stat-info">
              <span className="stat-label">Prediction Status</span>
              <span className="stat-val">
                {hasBracket === null ? 'Checking...' : hasBracket ? 'Synced & Live 🏆' : 'No bracket saved yet'}
              </span>
            </div>
          </div>
        </div>

        {/* Password Reset Section */}
        <div className="profile-password-section">
          <h3>🔐 Secure Password Change</h3>
          <p className="password-subtext">Update your account password here. Changes will take effect immediately.</p>

          <form onSubmit={handlePasswordChange} className="auth-form">
            {error && (
              <div className="auth-error-banner">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="profile-success-banner">
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            <div className="auth-input-group">
              <label>New Password</label>
              <div className="input-with-icon">
                <Key className="input-icon" size={16} />
                <input 
                  type="password" 
                  placeholder="At least 6 characters" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Confirm New Password</label>
              <div className="input-with-icon">
                <Key className="input-icon" size={16} />
                <input 
                  type="password" 
                  placeholder="Repeat new password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="spinning" size={18} />
                  <span>Updating secure credentials...</span>
                </>
              ) : (
                'Save Password Settings'
              )}
            </button>
          </form>
        </div>

        {/* Logout Actions */}
        <div className="profile-footer-actions">
          <button 
            className="profile-logout-btn" 
            onClick={() => {
              if (confirm('Are you sure you want to sign out and clear local session?')) {
                signOut().then(() => navigate('/predict/groups'));
              }
            }}
          >
            Sign Out of Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
