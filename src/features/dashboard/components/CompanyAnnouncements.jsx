import React from 'react';
import Card from '@/components/ui/Card';
import { Megaphone } from 'lucide-react';

export const CompanyAnnouncements = ({ announcements = [] }) => {
  return (
    <Card title="Company Announcements">
      {announcements.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {announcements.map((ann, index) => (
            <div key={index} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '16px' }}>📢</span>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                {ann.text}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: 'var(--space-4) 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <Megaphone size={24} style={{ opacity: 0.5, marginBottom: '8px' }} />
          <p style={{ fontSize: 'var(--font-size-sm)' }}>No new announcements</p>
        </div>
      )}
    </Card>
  );
};

export default CompanyAnnouncements;
