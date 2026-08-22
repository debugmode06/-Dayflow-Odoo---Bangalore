import React, { useState } from 'react';
import Card from '@/components/ui/Card';

const BAR_COLORS = { present: '#10b981', late: '#f59e0b', onLeave: '#84647C', absent: '#ef4444' };

const SVGBarChart = ({ data }) => {
  const [tooltip, setTooltip] = useState(null);
  const W = 520, H = 200, PL = 32, PB = 32, PT = 16, PR = 16;
  const innerW = W - PL - PR;
  const innerH = H - PB - PT;
  const barGroupW = innerW / data.length;
  const barW = Math.min(14, barGroupW * 0.25);
  const maxVal = Math.max(...data.map(d => d.present + d.absent + d.late + d.onLeave));
  const scale = (v) => innerH - (v / maxVal) * innerH;
  const layers = ['onLeave', 'absent', 'late', 'present'];

  return (
    <div style={{ position: 'relative', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet">
        {/* Y gridlines */}
        {[0, 25, 50, 75, 100].map(pct => {
          const y = PT + ((100 - pct) / 100) * innerH;
          return (
            <g key={pct}>
              <line x1={PL} x2={W - PR} y1={y} y2={y} stroke="var(--border-color)" strokeDasharray="3,4" strokeWidth={0.8} />
              <text x={PL - 4} y={y + 4} fontSize={9} fill="var(--text-tertiary)" textAnchor="end">{Math.round((pct / 100) * maxVal)}</text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const cx = PL + i * barGroupW + barGroupW / 2;
          let yOffset = innerH + PT;
          const barKeys = ['absent', 'onLeave', 'late', 'present'];
          return (
            <g key={i}>
              {barKeys.map((key) => {
                const h = (d[key] / maxVal) * innerH;
                yOffset -= h;
                return (
                  <rect key={key} x={cx - barW / 2} y={yOffset} width={barW} height={h}
                    fill={BAR_COLORS[key]} rx={2}
                    onMouseEnter={() => setTooltip({ ...d, x: cx, y: yOffset })}
                    onMouseLeave={() => setTooltip(null)}
                    style={{ cursor: 'default' }} />
                );
              })}
              <text x={cx} y={H - 8} fontSize={10} fill="var(--text-tertiary)" textAnchor="middle">{d.day}</text>
            </g>
          );
        })}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect x={Math.min(tooltip.x + 8, W - 110)} y={tooltip.y - 10} width={105} height={72} rx={6} fill="var(--bg-surface)" stroke="var(--border-color)" />
            <text x={Math.min(tooltip.x + 14, W - 104)} y={tooltip.y + 8} fontSize={10} fontWeight={600} fill="var(--text-primary)">{tooltip.day}</text>
            {[['present', '#10b981', 'Present'], ['late', '#f59e0b', 'Late'], ['absent', '#ef4444', 'Absent'], ['onLeave', '#84647C', 'On Leave']].map(([k, c, l], i) => (
              <text key={k} x={Math.min(tooltip.x + 14, W - 104)} y={tooltip.y + 22 + i * 13} fontSize={10} fill={c}>{l}: {tooltip[k]}</text>
            ))}
          </g>
        )}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 4 }}>
        {[['#10b981', 'Present'], ['#f59e0b', 'Late'], ['#ef4444', 'Absent'], ['#84647C', 'On Leave']].map(([c, l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AttendanceChart = ({ data = [] }) => {
  const [period, setPeriod] = useState('7');
  const displayData = period === '7' ? data.slice(-7) : data;
  const avgAttendance = displayData.length
    ? Math.round(displayData.reduce((s, d) => s + (d.present / d.total) * 100, 0) / displayData.length)
    : 0;
  const bestDay = [...displayData].sort((a, b) => b.present - a.present)[0];
  const worstDay = [...displayData].sort((a, b) => a.present - b.present)[0];

  return (
    <Card title="Attendance & Punctuality"
      headerAction={
        <div style={{ display: 'flex', gap: 4 }}>
          {['7', '30'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              style={{ padding: '3px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: period === p ? 'var(--color-primary)' : 'transparent', color: period === p ? '#fff' : 'var(--text-secondary)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              {p}d
            </button>
          ))}
        </div>
      }>
      <SVGBarChart data={displayData} />
      <div style={{ display: 'flex', gap: 'var(--space-6)', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color-subtle)', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Average Attendance</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{avgAttendance}%</div>
        </div>
        {bestDay && <div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Highest</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)' }}>{bestDay.day} — {Math.round((bestDay.present / bestDay.total) * 100)}%</div>
        </div>}
        {worstDay && <div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Lowest</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-warning)' }}>{worstDay.day} — {Math.round((worstDay.present / worstDay.total) * 100)}%</div>
        </div>}
      </div>
    </Card>
  );
};

export default AttendanceChart;
