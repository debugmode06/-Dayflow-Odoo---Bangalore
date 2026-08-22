import React from 'react';
import { useHRDashboard } from '../hooks/useHRDashboard';
import { MetricCard } from '../components/MetricCard';
import { NeedsAttention } from '../components/NeedsAttention';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { Users, UserCheck, UserMinus, UserCog, Sparkles } from 'lucide-react';
import '../styles/hr-dashboard.css';

export const HRCommandCenterPage = () => {
  const { stats, isLoading, error } = useHRDashboard();

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="hr-dashboard-container flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow-sm border border-red-200">
          <h3 className="font-bold">Error loading dashboard</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const {
    totalEmployees,
    presentToday,
    absentToday,
    onLeaveToday,
    totalAccountedPercentage,
    pendingLeaveRequests,
    attendanceAlerts,
    incompleteProfiles
  } = stats;

  return (
    <div className="hr-dashboard-container">
      <div className="hr-dashboard-header">
        <h1 className="hr-dashboard-title">HR Command Center</h1>
        <p className="hr-dashboard-subtitle">Real-time overview of your workforce and operations.</p>
      </div>

      <div className="hr-metrics-grid">
        <MetricCard 
          title="Total Employees" 
          value={totalEmployees} 
          icon={Users} 
          colorClass="text-indigo-600" 
        />
        <MetricCard 
          title="Present Today" 
          value={presentToday} 
          icon={UserCheck} 
          colorClass="text-emerald-500" 
        />
        <MetricCard 
          title="Absent Today" 
          value={absentToday} 
          icon={UserMinus} 
          colorClass="text-rose-500" 
        />
        <MetricCard 
          title="On Leave" 
          value={onLeaveToday} 
          icon={UserCog} 
          colorClass="text-amber-500" 
        />
      </div>

      <div className="hr-main-grid">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <NeedsAttention 
            pendingLeaves={pendingLeaveRequests}
            attendanceAlerts={attendanceAlerts}
            incompleteProfiles={incompleteProfiles}
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Workforce Availability */}
          <div className="hr-card availability-card">
            <h3 className="section-title">Workforce Availability</h3>
            <div className="availability-circle">
              {totalAccountedPercentage}%
            </div>
            <p className="text-center text-sm text-slate-500 mb-6 font-medium">
              Workforce accounted for today
            </p>
            <div className="availability-stats">
              <div className="avail-stat-row">
                <span className="avail-label">
                  <span className="avail-dot dot-present"></span> Present
                </span>
                <span className="avail-val">{presentToday}</span>
              </div>
              <div className="avail-stat-row">
                <span className="avail-label">
                  <span className="avail-dot dot-leave"></span> On Leave
                </span>
                <span className="avail-val">{onLeaveToday}</span>
              </div>
              <div className="avail-stat-row">
                <span className="avail-label">
                  <span className="avail-dot dot-absent"></span> Absent
                </span>
                <span className="avail-val">{absentToday}</span>
              </div>
            </div>
          </div>

          {/* Coming Next Preview */}
          <div className="hr-card coming-next-card">
            <span className="pulse-badge">Coming Next</span>
            <div className="flex justify-center mb-3 text-indigo-500">
              <Sparkles size={32} />
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">Workforce Pulse & AI</h4>
            <p className="text-sm">
              Predictive analytics, automated engagement tracking, and intelligent HR insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
