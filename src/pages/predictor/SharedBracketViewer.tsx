import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePredictor } from '../../context/PredictorContext';
import './Predictor.css';

const SharedBracketViewer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { enterSharedMode } = usePredictor();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bracketId = searchParams.get('id');

  useEffect(() => {
    const fetchSharedBracket = async () => {
      if (!bracketId) {
        setError('No sharing bracket ID was provided in the link.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch shared prediction selections from Supabase
        const { data, error: dbError } = await supabase
          .from('predictions')
          .select('*')
          .eq('id', bracketId)
          .single();

        if (dbError || !data) {
          throw new Error('Prediction bracket not found or link has expired.');
        }

        // Load selections into global context in shared read-only mode
        enterSharedMode(data.username, data.selections, data.score);

        // Redirect seamlessly to the prediction Recap page
        navigate('/predict/recap');
      } catch (err: unknown) {
        console.error('Error fetching shared bracket:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the shared bracket.');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedBracket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bracketId]);

  return (
    <div className="shared-loader-container">
      <div className="shared-loader-card">
        {loading && (
          <div className="loader-view">
            <Loader2 className="spinning-loader" size={48} />
            <h2>Loading Interactive Bracket...</h2>
            <p>Fetching prediction datasets securely from global database</p>
          </div>
        )}

        {error && (
          <div className="loader-error-view">
            <AlertTriangle className="error-icon" size={48} />
            <h2>Failed to Load Bracket</h2>
            <p>{error}</p>
            <button className="error-back-btn" onClick={() => navigate('/predict/groups')}>
              Go to Group Stage
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="loader-success-view">
            <ShieldCheck className="success-icon animate-bounce" size={48} />
            <h2>Bracket Decoded Successfully!</h2>
            <p>Redirecting you to the interactive dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedBracketViewer;
