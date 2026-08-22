import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { ArrowRight } from 'lucide-react';

export const ProfileHealth = ({ profile }) => {
  const navigate = useNavigate();
  
  // Calculate profile completion based on available data
  let score = 100;
  const missing = [];
  
  if (!profile?.phoneNumber) { score -= 10; missing.push('Phone number'); }
  if (!profile?.emergencyContact) { score -= 15; missing.push('Emergency contact'); }
  if (!profile?.photoURL) { score -= 5; missing.push('Profile photo'); }
  if (!profile?.address) { score -= 10; missing.push('Home address'); }

  return (
    <Card 
      title="Profile Health"
      action={
        <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: score >= 90 ? 'var(--color-success)' : 'var(--color-warning)' }}>
          {score}%
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
        
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{ width: `${score}%`, height: '100%', backgroundColor: score >= 90 ? 'var(--color-success)' : 'var(--color-warning)', borderRadius: 'var(--radius-full)' }} />
        </div>

        {missing.length > 0 ? (
          <div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Missing Information
            </div>
            <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {missing.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Your profile is fully complete. Great job!
          </div>
        )}

        {missing.length > 0 && (
          <button
            onClick={() => navigate('/profile')}
            style={{
              marginTop: 'var(--space-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--color-primary)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              paddingLeft: 0
            }}
          >
            Complete Profile <ArrowRight size={16} />
          </button>
        )}
      </div>
    </Card>
  );
};

export default ProfileHealth;
