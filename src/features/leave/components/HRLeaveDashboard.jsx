import React, { useState, useEffect, useMemo } from 'react';
import { subscribeToAllLeaves } from '../services/leaveService';
import HRLeaveRequestsTable from './HRLeaveRequestsTable';
import LeaveCalendar from './LeaveCalendar';
import LeaveActivityTimeline from './LeaveActivityTimeline';
import { 
  Clock, CheckCircle, XCircle, Users, Activity, 
  Download, RefreshCw, AlertTriangle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import Button from '@/components/ui/Button';

export const HRLeaveDashboard = ({ title = "Leave Management", subtitle = "Review, approve and monitor employee time-off requests", roleMode }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAllLeaves((data) => {
      setLeaves(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const kpis = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const currMonth = today.getMonth();
    const currYear = today.getFullYear();

    let pending = 0, approvedMonth = 0, rejectedMonth = 0, onLeaveToday = 0;

    leaves.forEach(l => {
      if (l.status === 'pending') pending++;
      
      const s = new Date(l.startDate);
      const e = new Date(l.endDate);
      
      if (l.status === 'approved' && s.getMonth() === currMonth && s.getFullYear() === currYear) {
        approvedMonth++;
      }
      if (l.status === 'rejected' && s.getMonth() === currMonth && s.getFullYear() === currYear) {
        rejectedMonth++;
      }
      
      s.setHours(0,0,0,0);
      e.setHours(0,0,0,0);
      if (l.status === 'approved' && today >= s && today <= e) {
        onLeaveToday++;
      }
    });

    // Dummy logic for workforce impact (assume 100 employees)
    const availability = Math.max(0, 100 - onLeaveToday);

    return { pending, approvedMonth, rejectedMonth, onLeaveToday, availability };
  }, [leaves]);

  const attentionRequests = useMemo(() => {
    // Find up to 3 pending requests that start soon (within next 7 days)
    const today = new Date();
    today.setHours(0,0,0,0);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return leaves
      .filter(l => l.status === 'pending')
      .filter(l => {
        const start = new Date(l.startDate);
        return start >= today && start <= nextWeek;
      })
      .slice(0, 3);
  }, [leaves]);

  // CSS variables object for inline styling
  const C = {
    bg: '#F7F8FA', surface: '#FFFFFF', border: '#E8EAF0',
    text: '#17191C', textSec: '#6F7580', textMut: '#9CA1AA',
    prim: '#4f46e5',
    succ: '#10b981', succBg: '#ecfdf5',
    warn: '#f59e0b', warnBg: '#fffbeb',
    dang: '#ef4444', dangBg: '#fef2f2',
  };

  const getDurationString = (start, end) => {
    const diffDays = Math.ceil(Math.abs(new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <div style={{ background: C.bg, minHeight: '100%', padding: '32px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: C.textMut, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>HR Workspace</div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: C.text, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>{title}</h1>
          <p style={{ fontSize: '15px', color: C.textSec, margin: 0 }}>{subtitle}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export Report
          </Button>
          <Button variant="outline" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={16} /> Refresh
          </Button>
        </div>
      </div>

      {/* KPI SUMMARY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: C.warn, fontSize: '13px', fontWeight: 600 }}>
            <div style={{ padding: '6px', background: C.warnBg, borderRadius: '8px' }}><Clock size={16}/></div> Pending Approval
          </div>
          <div style={{ fontSize: '36px', fontWeight: 700, color: C.text, lineHeight: 1, marginBottom: '8px', letterSpacing: '-0.02em' }}>
            {kpis.pending < 10 && kpis.pending > 0 ? `0${kpis.pending}` : kpis.pending}
          </div>
          <div style={{ fontSize: '13px', color: C.textSec }}>Needs your attention</div>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: C.succ, fontSize: '13px', fontWeight: 600 }}>
            <div style={{ padding: '6px', background: C.succBg, borderRadius: '8px' }}><CheckCircle size={16}/></div> Approved
          </div>
          <div style={{ fontSize: '36px', fontWeight: 700, color: C.text, lineHeight: 1, marginBottom: '8px', letterSpacing: '-0.02em' }}>
            {kpis.approvedMonth < 10 && kpis.approvedMonth > 0 ? `0${kpis.approvedMonth}` : kpis.approvedMonth}
          </div>
          <div style={{ fontSize: '13px', color: C.textSec, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: C.succ, fontWeight: 600, display: 'flex', alignItems: 'center' }}><ArrowUpRight size={12}/> 12%</span> vs last month
          </div>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: C.dang, fontSize: '13px', fontWeight: 600 }}>
            <div style={{ padding: '6px', background: C.dangBg, borderRadius: '8px' }}><XCircle size={16}/></div> Rejected
          </div>
          <div style={{ fontSize: '36px', fontWeight: 700, color: C.text, lineHeight: 1, marginBottom: '8px', letterSpacing: '-0.02em' }}>
            {kpis.rejectedMonth < 10 && kpis.rejectedMonth > 0 ? `0${kpis.rejectedMonth}` : kpis.rejectedMonth}
          </div>
          <div style={{ fontSize: '13px', color: C.textSec }}>This month</div>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: C.prim, fontSize: '13px', fontWeight: 600 }}>
            <div style={{ padding: '6px', background: '#e0e7ff', borderRadius: '8px' }}><Users size={16}/></div> On Leave
          </div>
          <div style={{ fontSize: '36px', fontWeight: 700, color: C.text, lineHeight: 1, marginBottom: '8px', letterSpacing: '-0.02em' }}>
            {kpis.onLeaveToday < 10 && kpis.onLeaveToday > 0 ? `0${kpis.onLeaveToday}` : kpis.onLeaveToday}
          </div>
          <div style={{ fontSize: '13px', color: C.textSec }}>Today</div>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#17191C', fontSize: '13px', fontWeight: 600 }}>
            <div style={{ padding: '6px', background: C.bg, borderRadius: '8px' }}><Activity size={16}/></div> Leave Impact
          </div>
          <div style={{ fontSize: '36px', fontWeight: 700, color: C.text, lineHeight: 1, marginBottom: '8px', letterSpacing: '-0.02em' }}>
            {kpis.availability}%
          </div>
          <div style={{ fontSize: '13px', color: C.textSec }}>Workforce availability</div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '32px', marginBottom: '32px' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* REQUIRES YOUR ATTENTION */}
          {attentionRequests.length > 0 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 4px 0' }}>Requires Your Attention</h2>
              <p style={{ fontSize: '14px', color: C.textSec, margin: '0 0 20px 0' }}>Leave requests that may need immediate review</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {attentionRequests.map(r => (
                  <div key={r.id} style={{ background: C.surface, border: `1px solid ${C.warn}`, borderRadius: '20px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: C.warn }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <img src={`https://ui-avatars.com/api/?name=${r.userName}&background=random`} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: C.text }}>{r.userName}</div>
                        <div style={{ fontSize: '12px', color: C.textSec }}>EMP-{r.userId?.substring(0,6).toUpperCase()} • {r.department || 'General'}</div>
                      </div>
                    </div>
                    
                    <div style={{ background: C.bg, borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: C.textMut, textTransform: 'uppercase' }}>{r.type}</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{getDurationString(r.startDate, r.endDate)}</span>
                      </div>
                      <div style={{ fontSize: '14px', color: C.text }}>{new Date(r.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – {new Date(r.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
                      <div style={{ fontSize: '13px', color: C.textSec, marginTop: '8px', fontStyle: 'italic' }}>"{r.reason}"</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: C.textSec, marginBottom: '20px' }}>
                      <div>Team availability: <span style={{ fontWeight: 600, color: C.text }}>82%</span></div>
                      <div>Impact: <span style={{ fontWeight: 700, color: C.text, background: '#F7F8FA', padding: '2px 6px', borderRadius: '4px' }}>{r.impactLevel || 'Low'}</span></div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ flex: 1, background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '8px', fontSize: '13px', fontWeight: 600, color: C.text, cursor: 'pointer' }}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MAIN WORKSPACE */}
          <HRLeaveRequestsTable leaves={leaves} isLoading={loading} />

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* SMART LEAVE IMPACT PANEL */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.text, margin: '0 0 20px 0' }}>Leave Impact Overview</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: C.text, letterSpacing: '-0.02em' }}>{kpis.availability}%</div>
                <div style={{ fontSize: '12px', color: C.textSec, lineHeight: 1.4 }}>Today's workforce availability</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: C.text, letterSpacing: '-0.02em' }}>{kpis.onLeaveToday}</div>
                <div style={{ fontSize: '12px', color: C.textSec, lineHeight: 1.4 }}>Employees currently on leave</div>
              </div>
            </div>

            <h4 style={{ fontSize: '11px', fontWeight: 700, color: C.textMut, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Department Availability</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Engineering', pct: 82, col: '#4f46e5' },
                { name: 'Product', pct: 71, col: C.warn },
                { name: 'Design', pct: 89, col: C.succ },
                { name: 'Marketing', pct: 94, col: C.succ }
              ].map(d => (
                <div key={d.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '6px' }}>
                    <span>{d.name}</span>
                    <span>{d.pct}%</span>
                  </div>
                  <div style={{ display: 'flex', height: '6px', borderRadius: '99px', background: C.bg, overflow: 'hidden' }}>
                    <div style={{ width: `${d.pct}%`, background: d.col, borderRadius: '99px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CALENDAR */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
            <LeaveCalendar leaves={leaves} />
          </div>

          {/* ACTIVITY */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
            <LeaveActivityTimeline leaves={leaves} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default HRLeaveDashboard;
