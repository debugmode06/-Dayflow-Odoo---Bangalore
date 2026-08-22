import React, { useState, useEffect } from 'react';
import { useHRDashboard } from '../hooks/useHRDashboard';
import { MetricCard } from '../components/MetricCard';
import { NeedsAttention } from '../components/NeedsAttention';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { WorkforcePulseCard } from '../components/WorkforcePulseCard';
import { WorkforcePulseDrawer } from '../components/WorkforcePulseDrawer';
import { HRAIAssistantDrawer } from '../components/HRAIAssistantDrawer';
import { fetchWorkforcePulseInsight } from '../services/workforceAiService';
import { Users, UserCheck, UserMinus, UserCog } from 'lucide-react';
import '../styles/hr-dashboard.css';

export const HRCommandCenterPage = () => {
  const { stats, isLoading, error } = useHRDashboard();
  const [pulseData, setPulseData] = useState(null);
  const [whyDrawerOpen, setWhyDrawerOpen] = useState(false);
  const [assistantDrawerOpen, setAssistantDrawerOpen] = useState(false);

  useEffect(() => {
    const initialMetrics = {
      attendanceScore: 91,
      availabilityScore: stats.totalAccountedPercentage || 82,
      leaveLoadScore: 84,
      profileHealthScore: 88,
      lateArrivals: stats.attendanceAlerts?.length || 6,
      absences: stats.absentToday || 2,
    };

    fetchWorkforcePulseInsight(initialMetrics).then((res) => {
      setPulseData(res);
    });
  }, [stats]);

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
          {/* Workforce Pulse Card */}
          <WorkforcePulseCard
            pulseData={pulseData || {
              score: 86,
              metrics: {
                attendanceScore: 91,
                availabilityScore: 82,
                leaveLoadScore: 84,
                profileHealthScore: 88,
              },
              insight: {
                summary: 'Workforce health remains strong overall. Attendance is healthy, while increased late arrivals and reduced availability are the main areas requiring attention.',
              },
            }}
            onOpenWhyDrawer={() => setWhyDrawerOpen(true)}
            onOpenAssistantDrawer={() => setAssistantDrawerOpen(true)}
          />

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
        </div>
      </div>

      {/* Side Drawers */}
      <WorkforcePulseDrawer
        isOpen={whyDrawerOpen}
        onClose={() => setWhyDrawerOpen(false)}
        pulseData={pulseData || {}}
      />

      <HRAIAssistantDrawer
        isOpen={assistantDrawerOpen}
        onClose={() => setAssistantDrawerOpen(false)}
        metricsContext={pulseData?.metrics || {}}
      />
    </div>
  );
};

export default HRCommandCenterPage;
