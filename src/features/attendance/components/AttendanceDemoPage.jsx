import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import { AttendanceIntelligence } from './intelligence/AttendanceIntelligence';
import { generateIntelligence } from '../intelligence/intelligenceService';

// Deterministic Demo Records
const DEMO_CURRENT_RECORDS = [
  { id: 'rec-1', date: '2026-08-17', status: 'PRESENT', checkIn: { seconds: 1787043600 }, checkOut: { seconds: 1787076000 }, workingDuration: 32400 }, // Mon: 9:00 AM - 6:00 PM
  { id: 'rec-2', date: '2026-08-18', status: 'PRESENT', checkIn: { seconds: 1787130600 }, checkOut: { seconds: 1787163000 }, workingDuration: 32400 }, // Tue: 9:10 AM - 6:10 PM
  { id: 'rec-3', date: '2026-08-19', status: 'PRESENT', checkIn: { seconds: 1787220600 }, checkOut: { seconds: 1787253000 }, workingDuration: 32400 }, // Wed: 9:30 AM (Late)
  { id: 'rec-4', date: '2026-08-20', status: 'PRESENT', checkIn: { seconds: 1787304000 }, checkOut: { seconds: 1787336400 }, workingDuration: 32400 }, // Thu: 9:00 AM
  { id: 'rec-5', date: '2026-08-21', status: 'PRESENT', checkIn: { seconds: 1787391000 }, checkOut: { seconds: 1787423400 }, workingDuration: 32400 }, // Fri: 9:05 AM
];

const DEMO_PREVIOUS_RECORDS = [
  { id: 'prev-1', date: '2026-08-10', status: 'PRESENT', checkIn: { seconds: 1786438800 }, checkOut: { seconds: 1786471200 }, workingDuration: 32400 },
  { id: 'prev-2', date: '2026-08-11', status: 'PRESENT', checkIn: { seconds: 1786525200 }, checkOut: { seconds: 1786557600 }, workingDuration: 32400 },
  { id: 'prev-3', date: '2026-08-12', status: 'PRESENT', checkIn: { seconds: 1786611600 }, checkOut: { seconds: 1786644000 }, workingDuration: 32400 },
  { id: 'prev-4', date: '2026-08-13', status: 'PRESENT', checkIn: { seconds: 1786698000 }, checkOut: { seconds: 1786730400 }, workingDuration: 32400 },
  { id: 'prev-5', date: '2026-08-14', status: 'PRESENT', checkIn: { seconds: 1786784400 }, checkOut: { seconds: 1786816800 }, workingDuration: 32400 },
];

export const AttendanceDemoPage = () => {
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'intelligence'
  const [demoState, setDemoState] = useState('READY'); // 'READY' | 'WORKING' | 'COMPLETED'
  const [timerSeconds, setTimerSeconds] = useState(3600 * 2 + 15 * 60 + 42); // 2h 15m 42s

  const intelligenceData = generateIntelligence(DEMO_CURRENT_RECORDS, DEMO_PREVIOUS_RECORDS);

  const historyColumns = [
    { header: 'Date', accessor: 'date' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => <Badge variant={row.status === 'PRESENT' ? 'success' : 'default'} dot>{row.status}</Badge> 
    },
    { header: 'Check-in', accessor: 'checkIn', cell: (row) => row.checkIn ? '09:04 AM' : '--:--' },
    { header: 'Check-out', accessor: 'checkOut', cell: (row) => row.checkOut ? '06:04 PM' : '--:--' },
    { header: 'Duration', accessor: 'workingDuration', cell: () => '09h 00m' }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-family-base)' }}>
      {/* LOCAL DEMO MODE BANNER */}
      <div style={{
        backgroundColor: '#fffbe6',
        border: '1px solid #ffe58f',
        borderRadius: '8px',
        padding: '12px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <div>
            <strong style={{ color: '#d48806', fontSize: '14px' }}>LOCAL DEMO MODE (Isolated Client Preview)</strong>
            <p style={{ margin: 0, fontSize: '12px', color: '#8c6b00' }}>
              Previewing Member 2 Sub-module 1 & Sub-module 2 features without Firestore writes.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            variant={activeTab === 'attendance' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('attendance')}
          >
            Sub-module 1 (Core)
          </Button>
          <Button 
            variant={activeTab === 'intelligence' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('intelligence')}
          >
            Sub-module 2 (Intelligence)
          </Button>
        </div>
      </div>

      {activeTab === 'attendance' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <header>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Attendance (Demo Mode)</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Track your workday and attendance.</p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            {/* Main Interactive Action Card */}
            <Card style={{ flex: 1 }}>
              <div style={{ padding: '8px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                    Good morning, Alex (Demo User)
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Saturday, August 22</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0', gap: '24px' }}>
                  
                  {demoState === 'READY' && (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                      <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>09:00 AM</div>
                      <Badge variant="info" style={{ marginBottom: '16px' }}>Workplace: Verified (15m from office)</Badge>
                      <div>
                        <Button 
                          variant="primary" 
                          size="lg" 
                          onClick={() => setDemoState('WORKING')}
                          style={{ maxWidth: '280px', width: '100%' }}
                        >
                          START DAY
                        </Button>
                      </div>
                    </div>
                  )}

                  {demoState === 'WORKING' && (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Check-in: 09:04 AM
                      </div>
                      <div style={{ fontSize: '42px', fontWeight: 'bold', color: 'var(--color-primary)', fontFamily: 'monospace' }}>
                        02:15:42
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px', marginBottom: '24px' }}>
                        Today's active work session
                      </div>
                      <Button 
                        variant="danger" 
                        size="lg" 
                        onClick={() => setDemoState('COMPLETED')}
                        style={{ maxWidth: '280px', width: '100%' }}
                      >
                        END DAY
                      </Button>
                    </div>
                  )}

                  {demoState === 'COMPLETED' && (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-success-text)' }}>
                        08h 45m
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '16px', fontSize: '13px' }}>
                        <div>
                          <div style={{ color: 'var(--text-tertiary)' }}>START</div>
                          <div style={{ fontWeight: '500' }}>09:04 AM</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-tertiary)' }}>END</div>
                          <div style={{ fontWeight: '500' }}>05:49 PM</div>
                        </div>
                      </div>
                      <Badge variant="success" dot style={{ marginTop: '24px' }}>DAY RECORDED</Badge>
                      <div style={{ marginTop: '16px' }}>
                        <Button variant="outline" size="sm" onClick={() => setDemoState('READY')}>Reset Demo Action</Button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </Card>

            {/* Right Column Context */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
              <Card title="Today's Details" subtitle="Current attendance log">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                    <Badge variant={demoState === 'READY' ? 'default' : 'success'} dot>
                      {demoState === 'READY' ? 'NOT RECORDED' : 'PRESENT'}
                    </Badge>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Check-in</span>
                    <span style={{ fontWeight: '500' }}>{demoState === 'READY' ? '--:--' : '09:04 AM'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Check-out</span>
                    <span style={{ fontWeight: '500' }}>{demoState === 'COMPLETED' ? '05:49 PM' : '--:--'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Workplace Verification</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-success-text)' }}>Verified (Office Zone)</span>
                  </div>
                </div>
              </Card>

              <Card title="This Week" subtitle="Your recent attendance pattern">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                    <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{day}</span>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: idx < 5 ? 'var(--color-success-bg, #f0fdf4)' : 'var(--bg-secondary)',
                        color: idx < 5 ? 'var(--color-success-text, #16a34a)' : 'var(--text-tertiary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                      }}>
                        {idx < 5 ? '✓' : '—'}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

          </div>

          <Card title="Attendance History" subtitle="Your recorded workdays">
            <DataTable columns={historyColumns} data={DEMO_CURRENT_RECORDS} />
          </Card>
        </div>
      ) : (
        /* Sub-module 2 Intelligence Demo Page */
        <AttendanceIntelligence demoData={intelligenceData} />
      )}
    </div>
  );
};
