import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { subscribeToEmployeeLeaves } from '@/features/leave/services/leaveService';
import { HRAIAssistantDrawer, fetchWorkforcePulseInsight } from '@/features/workforce';

import WelcomeHeader from './WelcomeHeader';
import QuickActions from './QuickActions';
import TodaysWorkday from './TodaysWorkday';
import MyWorkdayHealth from './MyWorkdayHealth';
import DayflowAIInsight from './DayflowAIInsight';
import AttendanceSummary from './AttendanceSummary';
import LeaveSummary from './LeaveSummary';
import ProfileHealth from './ProfileHealth';
import UpcomingSchedule from './UpcomingSchedule';
import ActionRequired from './ActionRequired';
import CompanyAnnouncements from './CompanyAnnouncements';
import AttendanceTrend from './AttendanceTrend';
import AIAssistantShortcut from './AIAssistantShortcut';

export const EmployeeDashboard = () => {
  const { user, profile } = useAuth();
  
  // State
  const [leaves, setLeaves] = useState([]);
  const [pulseData, setPulseData] = useState(null);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  // Mock attendance data since Member 2's backend isn't fully integrated yet
  const [attendanceData, setAttendanceData] = useState({
    status: 'present',
    clockInTime: new Date().setHours(9, 18, 0, 0),
    shift: '09:00 AM – 06:00 PM',
    workMode: 'Office'
  });

  useEffect(() => {
    if (!user) return;
    
    // Subscribe to leaves
    const unsubscribeLeaves = subscribeToEmployeeLeaves(user.uid, (data) => {
      setLeaves(data);
    });

    // Fetch AI Pulse Data
    const initialMetrics = {
      attendanceScore: 91,
      availabilityScore: 82,
      leaveLoadScore: 84,
      profileHealthScore: 88,
      lateArrivals: 6,
      absences: 2,
      recentPatterns: [
        'Your attendance is strong this month. Punctuality improved compared with last month.'
      ],
    };

    fetchWorkforcePulseInsight(initialMetrics).then((res) => {
      setPulseData(res);
    });

    return () => {
      unsubscribeLeaves();
    };
  }, [user]);

  // Aggregate Actions Required
  const getActionsRequired = () => {
    const actions = [];
    const pendingLeaves = leaves.filter(l => l.status === 'pending');
    if (pendingLeaves.length > 0) {
      actions.push({ message: `${pendingLeaves.length} leave request(s) awaiting approval`, link: '/leave' });
    }
    
    let profileScore = 100;
    if (!profile?.phoneNumber) profileScore -= 10;
    if (!profile?.emergencyContact) profileScore -= 15;
    if (!profile?.photoURL) profileScore -= 5;
    if (!profile?.address) profileScore -= 10;
    
    if (profileScore < 100) {
      actions.push({ message: 'Profile is incomplete', link: '/profile' });
    }
    return actions;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-8)' }}>
      {/* 1. Welcome Header */}
      <WelcomeHeader />

      {/* 2. Quick Actions */}
      <QuickActions onOpenAi={() => setAiDrawerOpen(true)} />

      {/* Primary Row: Workday, Health, AI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* 3. Today's Workday */}
        <TodaysWorkday 
          attendanceData={attendanceData} 
          onClockOut={() => setAttendanceData({ ...attendanceData, status: 'clocked-out' })} 
        />
        
        {/* 4. My Workday Health */}
        <MyWorkdayHealth 
          metrics={{
            score: 92,
            attendance: 95,
            punctuality: 88,
            profile: profile ? 88 : 100
          }} 
        />

        {/* 5. AI Insight */}
        <DayflowAIInsight 
          insight={pulseData?.insight?.summary || "Your attendance is strong this month. Punctuality improved compared with last month."}
          onOpenAi={() => setAiDrawerOpen(true)}
        />
      </div>

      {/* Secondary Row: Summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* 6. Attendance Summary */}
        <AttendanceSummary />

        {/* 7. Leave Summary */}
        <LeaveSummary leaves={leaves} />

        {/* 8. Profile Health */}
        <ProfileHealth profile={profile} />
      </div>

      {/* Tertiary Row: Schedule, Action Required, Announcements, AI Shortcut */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* 9. Upcoming Schedule */}
          <UpcomingSchedule schedule={[]} />
          
          {/* 12. Attendance Trend */}
          <AttendanceTrend />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* 10. Action Required */}
          <ActionRequired actions={getActionsRequired()} />

          {/* 13. AI Assistant Shortcut */}
          <AIAssistantShortcut onOpenAi={() => setAiDrawerOpen(true)} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* 11. Company Announcements */}
          <CompanyAnnouncements announcements={[
            { text: 'Annual team outing announced for next month.' },
            { text: 'Holiday schedule updated for Q4.' }
          ]} />
        </div>
      </div>

      {/* AI Assistant Drawer */}
      <HRAIAssistantDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        metricsContext={pulseData?.metrics || {}}
      />
    </div>
  );
};

export default EmployeeDashboard;
