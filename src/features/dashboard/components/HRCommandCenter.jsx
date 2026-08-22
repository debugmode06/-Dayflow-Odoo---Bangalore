import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { getDashboardData } from '@/features/hr/services/hrDashboardService';

// Sub-components
import WorkforceHealthHero from '@/features/hr/components/WorkforceHealthHero';
import HRActionCenter from '@/features/hr/components/HRActionCenter';
import WorkforceSnapshot from '@/features/hr/components/WorkforceSnapshot';
import AttendanceChart from '@/features/hr/components/AttendanceChart';
import DepartmentHealthMap from '@/features/hr/components/DepartmentHealthMap';
import WhatChangedSection from '@/features/hr/components/WhatChangedSection';
import TomorrowWorkforce from '@/features/hr/components/TomorrowWorkforce';
import WorkforceRiskRadar from '@/features/hr/components/WorkforceRiskRadar';
import LeaveImpactMap from '@/features/hr/components/LeaveImpactMap';
import AttentionHeatmap from '@/features/hr/components/AttentionHeatmap';
import EmployeeSignals from '@/features/hr/components/EmployeeSignals';
import PendingHRActions from '@/features/hr/components/PendingHRActions';
import PayrollSummary from '@/features/hr/components/PayrollSummary';
import HRQuickActions from '@/features/hr/components/HRQuickActions';
import HRDailyBrief from '@/features/hr/components/HRDailyBrief';
import WorkforceCapacity from '@/features/hr/components/WorkforceCapacity';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ h = 120 }) => (
  <div style={{ height: h, background: 'linear-gradient(90deg, var(--bg-surface-secondary) 25%, var(--bg-surface-tertiary) 50%, var(--bg-surface-secondary) 75%)', backgroundSize: '400% 100%', borderRadius: 'var(--radius-lg)', animation: 'shimmer 1.4s ease infinite', border: '1px solid var(--border-color)' }} />
);

// ─── Section Label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-tertiary)', textTransform: 'uppercase', margin: '0 0 var(--space-3)', padding: '0 2px' }}>
    {children}
  </h2>
);

// ─── Dashboard Header ─────────────────────────────────────────────────────────
const DashboardHeader = ({ lastUpdated, onRefresh, refreshing }) => {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = lastUpdated ? lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)', margin: 0 }}>
          Workforce Command Center
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 'var(--font-size-sm)' }}>
          Real-time workforce health, risks, decisions and actions
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Today · {today}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {timeStr && <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Last updated: {timeStr}</span>}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer' }}
            aria-label="Refresh dashboard data"
          >
            <RefreshCw size={12} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export const HRCommandCenter = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const result = await getDashboardData();
      setData(result);
      setError(null);
    } catch (e) {
      setError('Failed to load dashboard data. Please refresh.');
      console.error('HR Dashboard error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Add shimmer keyframe via style tag once
  useEffect(() => {
    const id = 'hr-dash-style';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.textContent = `@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}} @keyframes spin{to{transform:rotate(360deg)}}`;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', padding: '0 0 var(--space-8)' }}>
      {/* Header */}
      <DashboardHeader
        lastUpdated={data?.lastUpdated}
        onRefresh={() => loadData(true)}
        refreshing={refreshing}
      />

      {/* Error */}
      {error && (
        <div style={{ padding: 'var(--space-4)', background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-danger-text)', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Daily Brief */}
      {loading ? <Skeleton h={90} /> : (
        <HRDailyBrief data={{ health: data?.health, overview: data?.overview, departments: data?.departments }} />
      )}

      {/* OBSERVE — Workforce Health */}
      <section aria-label="Workforce Health">
        <SectionLabel>OBSERVE — Workforce Health</SectionLabel>
        {loading ? <Skeleton h={180} /> : <WorkforceHealthHero health={data?.health} />}
      </section>

      {/* ACT — Needs Attention */}
      {loading ? <Skeleton h={160} /> : (
        <section aria-label="Needs Your Attention">
          <HRActionCenter actions={data?.actions || []} />
        </section>
      )}

      {/* Quick Actions */}
      <section aria-label="HR Quick Actions">
        <SectionLabel>Quick Actions</SectionLabel>
        <HRQuickActions />
      </section>

      {/* OBSERVE — Workforce Snapshot */}
      <section aria-label="Workforce Snapshot">
        <SectionLabel>OBSERVE — Workforce Snapshot</SectionLabel>
        {loading ? <Skeleton h={140} /> : <WorkforceSnapshot overview={data?.overview} />}
      </section>

      {/* UNDERSTAND — Attendance + Department */}
      <section aria-label="Attendance and Department Health">
        <SectionLabel>UNDERSTAND — Attendance & Department Health</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 'var(--space-4)', alignItems: 'start' }}>
          {loading ? <Skeleton h={360} /> : <AttendanceChart data={data?.attendance || []} />}
          {loading ? <Skeleton h={360} /> : <WorkforceCapacity capacity={data?.capacity} />}
        </div>
      </section>

      {/* Department Health */}
      <section aria-label="Department Health Map">
        {loading ? <Skeleton h={320} /> : <DepartmentHealthMap departments={data?.departments || []} />}
      </section>

      {/* What Changed */}
      <section aria-label="What Changed Since Yesterday">
        <SectionLabel>UNDERSTAND — What Changed Since Yesterday?</SectionLabel>
        {loading ? <Skeleton h={200} /> : <WhatChangedSection changes={data?.changes || []} />}
      </section>

      {/* PREDICT — Tomorrow + Risk Radar */}
      <section aria-label="Tomorrow Workforce and Risk Radar">
        <SectionLabel>PREDICT — Tomorrow's Workforce & Risk Radar</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 'var(--space-4)', alignItems: 'start' }}>
          {loading ? <Skeleton h={340} /> : <TomorrowWorkforce tomorrow={data?.tomorrow} />}
          {loading ? <Skeleton h={340} /> : <WorkforceRiskRadar risks={data?.risks || []} />}
        </div>
      </section>

      {/* Leave Impact + Capacity */}
      <section aria-label="Leave Impact and Capacity">
        <SectionLabel>PREDICT — Leave Impact</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: 'var(--space-4)', alignItems: 'start' }}>
          {loading ? <Skeleton h={280} /> : <LeaveImpactMap leave={data?.leave} />}
          {loading ? <Skeleton h={280} /> : <AttentionHeatmap heatmap={data?.heatmap || []} />}
        </div>
      </section>

      {/* Employee Signals */}
      <section aria-label="Employee Signals">
        <SectionLabel>ACT — Employee Signals</SectionLabel>
        {loading ? <Skeleton h={180} /> : <EmployeeSignals signals={data?.signals || []} />}
      </section>

      {/* Pending Actions */}
      <section aria-label="Pending HR Actions">
        <SectionLabel>ACT — Pending HR Actions</SectionLabel>
        {loading ? <Skeleton h={200} /> : <PendingHRActions pendingLeaves={data?.pendingLeaves || []} />}
      </section>

      {/* Payroll */}
      <section aria-label="Payroll Summary">
        <SectionLabel>Payroll Summary</SectionLabel>
        {loading ? <Skeleton h={160} /> : <PayrollSummary payroll={data?.payroll} />}
      </section>
    </div>
  );
};

export default HRCommandCenter;
