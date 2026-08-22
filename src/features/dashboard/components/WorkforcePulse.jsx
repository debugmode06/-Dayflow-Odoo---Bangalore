import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertTriangle, TrendingUp, TrendingDown, 
  Clock, ShieldCheck, Activity, Users, FileText, ChevronRight, X, Sparkles
} from 'lucide-react';

const COLORS = {
  bg: '#F7F8FA',
  surface: '#FFFFFF',
  border: '#E8EAF0',
  text: '#17191C',
  textSecondary: '#6F7580',
  textMuted: '#9CA1AA',
  primary: '#17191C',
  success: '#10b981',
  successBg: '#ecfdf5',
  warning: '#f59e0b',
  warningBg: '#fffbeb',
  danger: '#ef4444',
  dangerBg: '#fef2f2',
  info: '#3b82f6',
  infoBg: '#eff6ff',
};

const S = {
  page: { background: COLORS.bg, minHeight: '100%', padding: '32px', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '32px', fontWeight: 700, color: COLORS.text, margin: '0 0 8px 0', letterSpacing: '-0.02em' },
  subtitle: { fontSize: '15px', color: COLORS.textSecondary, margin: 0 },
  card: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '24px', padding: '24px', boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)' },
  btnOutline: { background: 'transparent', color: COLORS.text, border: `1px solid ${COLORS.border}`, padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' },
};

const RadialScore = ({ score }) => {
  const r = 54, cx = 60, cy = 60, stroke = 8;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 85 ? COLORS.success : score >= 70 ? COLORS.warning : COLORS.danger;
  
  return (
    <div style={{ position: 'relative', width: 120, height: 120 }}>
      <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.border} strokeWidth={stroke} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.text, letterSpacing: '-0.02em', lineHeight: 1 }}>{score}</div>
      </div>
    </div>
  );
};

export const WorkforcePulse = ({ title = "Workforce Pulse", subtitle = "HR Command Analytics & Explainable Health Score" }) => {
  const [data, setData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState(null);

  useEffect(() => {
    // Deterministic payload (mocking fetchWorkforcePulseInsight behavior)
    setTimeout(() => {
      setData({
        overallScore: 86,
        status: 'HEALTHY',
        summary: 'Overall workforce health is stable with strong attendance and manageable leave load.',
        signals: {
          attendance: { score: 91, label: 'Strong', trend: 'up', desc: 'High present rate with low absence' },
          availability: { score: 82, label: 'Stable', trend: 'down', desc: 'Slight dip due to planned leaves' },
          leaveHealth: { score: 84, label: 'Healthy', trend: 'up', desc: 'Leave distribution is balanced' },
          profileHealth: { score: 88, label: 'Good', trend: 'up', desc: 'Most employee data is complete' }
        },
        why: {
          positive: ['Strong attendance', 'Healthy team availability', 'Leave load within normal range'],
          warnings: ['Late arrivals increased this week', 'Two employee profiles incomplete']
        },
        insight: {
          text: 'Workforce health remains strong overall. Attendance continues to be the strongest signal. Late arrivals have increased slightly and should be monitored.',
          focus: 'Review recurring late-arrival patterns.'
        },
        attention: [
          { icon: Clock, title: 'Attendance Alerts', desc: 'Late arrivals detected', count: 3, color: COLORS.warning, bg: COLORS.warningBg },
          { icon: Users, title: 'Pending Leave', desc: 'Requests require approval', count: 5, color: COLORS.info, bg: COLORS.infoBg },
          { icon: FileText, title: 'Incomplete Profiles', desc: 'Missing mandatory fields', count: 2, color: COLORS.danger, bg: COLORS.dangerBg }
        ],
        availability: { present: 103, onLeave: 9, absent: 8, pct: 82 }
      });
    }, 400);
  }, []);

  if (!data) return <div style={S.page}><div style={{ fontSize: '14px', color: COLORS.textSecondary }}>Loading Pulse data...</div></div>;

  const handleOpenDrawer = (signalKey) => {
    setDrawerData({ key: signalKey, ...data.signals[signalKey] });
    setDrawerOpen(true);
  };

  return (
    <div style={S.page}>
      {/* HEADER */}
      <div style={S.header}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: COLORS.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>OdooSphere / HR Intelligence</div>
          <h1 style={S.title}>{title}</h1>
          <p style={S.subtitle}>{subtitle}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '24px', marginBottom: '24px' }}>
        
        {/* HERO CARD */}
        <div style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #ffffff 0%, #fdf8fb 100%)' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>Workforce Pulse</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, background: COLORS.successBg, color: COLORS.success, padding: '4px 10px', borderRadius: '999px', letterSpacing: '0.05em' }}>{data.status}</span>
            </div>
            <p style={{ fontSize: '15px', color: COLORS.textSecondary, lineHeight: 1.6, margin: 0, maxWidth: '400px' }}>
              {data.summary}
            </p>
          </div>
          <RadialScore score={data.overallScore} />
        </div>

        {/* AI WORKFORCE BRIEF */}
        <div style={{ ...S.card, border: `1px solid #e0e7ff`, background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={16} color="#6366f1" />
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>AI Workforce Brief</h3>
          </div>
          <p style={{ fontSize: '14px', color: COLORS.text, lineHeight: 1.6, margin: '0 0 16px 0' }}>{data.insight.text}</p>
          <div style={{ fontSize: '13px', color: COLORS.textSecondary, background: '#e0e7ff30', padding: '12px', borderRadius: '12px', border: `1px solid #e0e7ff` }}>
            <span style={{ fontWeight: 600, color: '#4f46e5' }}>Recommended focus:</span> {data.insight.focus}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 4 CORE SIGNALS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {[
              { k: 'attendance', name: 'Attendance' },
              { k: 'availability', name: 'Availability' },
              { k: 'leaveHealth', name: 'Leave Health' },
              { k: 'profileHealth', name: 'Profile Health' }
            ].map(sig => {
              const sData = data.signals[sig.k];
              const isUp = sData.trend === 'up';
              return (
                <div key={sig.k} onClick={() => handleOpenDrawer(sig.k)} style={{ ...S.card, cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s', padding: '20px' }} onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,23,42,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(15, 23, 42, 0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>{sig.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: isUp ? COLORS.success : COLORS.warning, background: isUp ? COLORS.successBg : COLORS.warningBg, padding: '2px 8px', borderRadius: '999px' }}>
                      {isUp ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {sData.label}
                    </div>
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: COLORS.text, letterSpacing: '-0.02em', marginBottom: '8px' }}>{sData.score}</div>
                  <div style={{ fontSize: '13px', color: COLORS.textMuted }}>{sData.desc}</div>
                </div>
              );
            })}
          </div>

          {/* WHY THIS SCORE */}
          <div style={{ ...S.card }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: COLORS.text, margin: '0 0 20px 0' }}>Why {data.overallScore}?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0' }}>Positive Signals</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {data.why.positive.map((w, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <CheckCircle size={16} color={COLORS.success} style={{ marginTop: '2px' }} />
                      <span style={{ fontSize: '14px', color: COLORS.text }}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ height: '1px', background: COLORS.border, margin: '8px 0' }} />
              <div>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0' }}>Warnings & Deductions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {data.why.warnings.map((w, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <AlertTriangle size={16} color={COLORS.warning} style={{ marginTop: '2px' }} />
                      <span style={{ fontSize: '14px', color: COLORS.text }}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* TEAM AVAILABILITY */}
          <div style={{ ...S.card, padding: '20px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, margin: '0 0 16px 0' }}>Team Availability</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: COLORS.text, letterSpacing: '-0.02em', lineHeight: 1 }}>{data.availability.pct}%</span>
              <span style={{ fontSize: '12px', color: COLORS.textMuted, paddingBottom: '4px' }}>Active Staffing</span>
            </div>
            <div style={{ display: 'flex', height: '8px', borderRadius: '99px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ width: `${(data.availability.present / 120)*100}%`, background: COLORS.success }} />
              <div style={{ width: `${(data.availability.onLeave / 120)*100}%`, background: COLORS.warning }} />
              <div style={{ width: `${(data.availability.absent / 120)*100}%`, background: COLORS.danger }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
              <div><div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text }}>{data.availability.present}</div><div style={{ fontSize: '11px', color: COLORS.textSecondary }}>Present</div></div>
              <div><div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text }}>{data.availability.onLeave}</div><div style={{ fontSize: '11px', color: COLORS.textSecondary }}>Leave</div></div>
              <div><div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text }}>{data.availability.absent}</div><div style={{ fontSize: '11px', color: COLORS.textSecondary }}>Absent</div></div>
            </div>
          </div>

          {/* NEEDS ATTENTION */}
          <div style={{ ...S.card, padding: '20px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, margin: '0 0 16px 0' }}>Needs Attention</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.attention.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: COLORS.bg, borderRadius: '16px', border: `1px solid ${COLORS.border}` }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color={a.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.text }}>{a.title}</div>
                      <div style={{ fontSize: '11px', color: COLORS.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.desc}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: COLORS.text }}>{a.count}</span>
                      <ChevronRight size={14} color={COLORS.textMuted} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>

      {/* SIGNAL DRAWER */}
      {drawerOpen && drawerData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.2)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '480px', background: COLORS.surface, height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', animation: 'slideIn 0.3s ease' }}>
            <div style={{ padding: '24px 32px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, textTransform: 'capitalize' }}>{drawerData.key.replace(/([A-Z])/g, ' $1').trim()} Detail</h2>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textMuted }}><X size={20} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                <RadialScore score={drawerData.score} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: COLORS.text, marginBottom: '4px' }}>Score: {drawerData.score}/100</div>
                  <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>{drawerData.desc}</div>
                </div>
              </div>

              <h3 style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>Metrics Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {drawerData.key === 'attendance' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: COLORS.bg, borderRadius: '16px', border: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontSize: '14px', color: COLORS.textSecondary }}>Present Rate</span><span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text }}>96%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: COLORS.bg, borderRadius: '16px', border: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontSize: '14px', color: COLORS.textSecondary }}>Late Arrivals</span><span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.warning }}>3</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: COLORS.bg, borderRadius: '16px', border: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontSize: '14px', color: COLORS.textSecondary }}>Absences</span><span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.danger }}>1</span>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '16px', background: COLORS.bg, borderRadius: '16px', border: `1px solid ${COLORS.border}`, fontSize: '13px', color: COLORS.textSecondary }}>
                    Detailed breakdown available for attendance only in this view.
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', margin: '32px 0 16px 0' }}>Why this score?</h3>
              <p style={{ fontSize: '14px', color: COLORS.text, lineHeight: 1.6, margin: 0 }}>
                {drawerData.key === 'attendance' 
                  ? 'Strong overall attendance across the organization. The score is slightly penalized due to a minor uptick in late arrivals (3 instances this week).'
                  : 'Score calculation is based on aggregate workforce metrics and historical baselines.'}
              </p>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
};

export default WorkforcePulse;
