import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { Users, UserCheck, UserMinus, CalendarClock, CreditCard } from 'lucide-react';
import { mockHelpers } from '@/lib/demoMode';

export const HRCommandCenter = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingLeaves: 0,
    totalPayroll: 0
  });

  useEffect(() => {
    const users = mockHelpers.getCollection('users').filter(u => u.role === 'employee');
    const attendance = mockHelpers.getCollection('attendance');
    const leaves = mockHelpers.getCollection('leaves');
    const payroll = mockHelpers.getCollection('payroll');

    const today = new Date().toISOString().split('T')[0];
    const presentToday = attendance.filter(a => a.date === today && a.status === 'present').length;
    
    // Very basic active leave calculation for demo
    const activeLeaves = leaves.filter(l => l.status === 'approved' && l.startDate <= today && l.endDate >= today).length;
    const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
    
    const totalPayroll = payroll.reduce((sum, p) => sum + p.netSalary, 0);

    setStats({
      totalEmployees: users.length,
      presentToday,
      onLeave: activeLeaves,
      pendingLeaves,
      totalPayroll
    });
  }, []);

  const kpiCards = [
    { title: 'Total Employees', value: stats.totalEmployees, icon: <Users size={24} color="var(--color-primary)" />, color: 'var(--color-primary)' },
    { title: 'Present Today', value: stats.presentToday, icon: <UserCheck size={24} color="var(--color-success)" />, color: 'var(--color-success)' },
    { title: 'On Leave', value: stats.onLeave, icon: <UserMinus size={24} color="var(--color-warning)" />, color: 'var(--color-warning)' },
    { title: 'Pending Leave Requests', value: stats.pendingLeaves, icon: <CalendarClock size={24} color="var(--color-danger)" />, color: 'var(--color-danger)' },
    { title: 'Total Payroll (Aug)', value: `₹${stats.totalPayroll.toLocaleString()}`, icon: <CreditCard size={24} color="var(--color-info)" />, color: 'var(--color-info)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>HR Command Center</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Overview of workforce metrics and pending actions</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        {kpiCards.map((kpi, index) => (
          <Card key={index} style={{ borderTop: `4px solid ${kpi.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.title}</p>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '8px' }}>
                  {kpi.value}
                </div>
              </div>
              <div style={{ backgroundColor: `color-mix(in srgb, ${kpi.color} 15%, transparent)`, padding: 'var(--space-3)', borderRadius: 'var(--radius-full)' }}>
                {kpi.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' }}>
        <Card title="Attendance Trend (Last 7 Days)">
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', color: 'var(--text-tertiary)' }}>
            [Attendance Chart Placeholder]
          </div>
        </Card>
        
        <Card title="Department Distribution">
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', color: 'var(--text-tertiary)' }}>
            [Department Pie Chart Placeholder]
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HRCommandCenter;
