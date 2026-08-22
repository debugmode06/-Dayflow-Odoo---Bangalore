import React from 'react';
import { Award, CheckCircle2, Code2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const SkillBar = ({ name, level, proficiency }) => (
  <div style={{ marginBottom: 'var(--space-3)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>
        {name}
      </span>
      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
        {level} ({proficiency}%)
      </span>
    </div>
    <div
      style={{
        height: '6px',
        width: '100%',
        backgroundColor: 'var(--bg-surface-secondary)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${proficiency}%`,
          backgroundColor: 'var(--color-primary)',
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.5s ease',
        }}
      />
    </div>
  </div>
);

/**
 * SkillsAndCertifications — Visual matrix of technical/soft skills & verified badges.
 */
const SkillsAndCertifications = ({ profile }) => {
  const skills = profile?.skills || [
    { name: 'React.js & Modern Web', level: 'Expert', proficiency: 92 },
    { name: 'Node.js & Microservices', level: 'Advanced', proficiency: 85 },
    { name: 'Cloud & Firebase Architecture', level: 'Advanced', proficiency: 80 },
    { name: 'System Design & Security', level: 'Proficient', proficiency: 75 },
  ];

  const certifications = profile?.certifications || [
    { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023' },
    { title: 'Certified Scrum Master (CSM)', issuer: 'Scrum Alliance', date: '2022' },
    { title: 'Dayflow Star Performer Q3', issuer: 'Internal Award', date: '2024' },
  ];

  return (
    <Card
      title="Skills & Badges"
      subtitle="Technical competencies and verified certifications"
    >
      <div style={{ marginTop: 'var(--space-2)' }}>
        {/* Skills Section */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <Code2 size={14} color="var(--color-primary)" />
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Core Skills
            </span>
          </div>
          {skills.map((s, idx) => (
            <SkillBar key={idx} name={s.name} level={s.level} proficiency={s.proficiency} />
          ))}
        </div>

        {/* Certifications Section */}
        <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-color-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <Award size={14} color="var(--color-warning)" />
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Certifications & Recognition
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {certifications.map((c, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-color-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <CheckCircle2 size={14} color="var(--color-success)" />
                  <div>
                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>
                      {c.title}
                    </p>
                    <p style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                      {c.issuer}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" size="sm">{c.date}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SkillsAndCertifications;
