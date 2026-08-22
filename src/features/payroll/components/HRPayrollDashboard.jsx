import React, { useState, useEffect, useMemo } from 'react';
import { mockHelpers } from '@/lib/demoMode';
import { 
  Download, Filter, Search, ChevronRight, AlertTriangle, 
  CheckCircle, Play, MoreHorizontal, X, Clock, FileText,
  TrendingUp, TrendingDown, Users
} from 'lucide-react';

const COLORS = {
  bg: '#F7F8FA',
  surface: '#FFFFFF',
  border: '#E8EAF0',
  text: '#17191C',
  textSecondary: '#6F7580',
  textMuted: '#9CA1AA',
  primary: '#17191C', // Dark premium button
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
  btnPrimary: { background: COLORS.primary, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  btnSecondary: { background: COLORS.surface, color: COLORS.text, border: `1px solid ${COLORS.border}`, padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(15,23,42,0.02)' },
  card: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '24px', padding: '24px', boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)' },
  kpiTitle: { fontSize: '13px', color: COLORS.textSecondary, fontWeight: 500, margin: '0 0 8px 0' },
  kpiValue: { fontSize: '28px', fontWeight: 700, color: COLORS.text, margin: '0 0 12px 0', letterSpacing: '-0.01em' },
  kpiTrend: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 },
  pill: { padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }
};

export const HRPayrollDashboard = () => {
  const [payroll, setPayroll] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  useEffect(() => {
    const allPayroll = mockHelpers.getCollection('payroll') || [];
    const allUsers = mockHelpers.getCollection('users') || [];
    
    // Auto-generate some dummy payroll data if none exists
    let enriched = allPayroll.map(pay => {
      const u = allUsers.find(u => u.uid === pay.userId);
      return { ...pay, employeeName: u?.name || 'Unknown', department: u?.department || 'Unknown', avatar: `https://ui-avatars.com/api/?name=${u?.name || 'U'}&background=random` };
    });

    if (enriched.length === 0 && allUsers.length > 0) {
      enriched = allUsers.map(u => ({
        id: `pay-${u.uid}`, userId: u.uid, employeeName: u.name, department: u.department, 
        avatar: `https://ui-avatars.com/api/?name=${u.name}&background=random`,
        month: 'August 2026', basicSalary: 60000, allowances: 20000, deductions: 5000, netSalary: 75000, 
        gross: 80000, status: Math.random() > 0.3 ? 'paid' : (Math.random() > 0.5 ? 'approved' : 'draft')
      }));
    }
    setPayroll(enriched);
    setUsers(allUsers);
  }, []);

  const kpis = useMemo(() => {
    const totalGross = payroll.reduce((s, p) => s + (p.gross || p.basicSalary + p.allowances), 0);
    const totalNet = payroll.reduce((s, p) => s + p.netSalary, 0);
    const totalAllowances = payroll.reduce((s, p) => s + p.allowances, 0);
    const totalDeductions = payroll.reduce((s, p) => s + p.deductions, 0);
    const pending = payroll.filter(p => p.status === 'draft' || p.status === 'calculated').length;
    return { totalGross, totalNet, totalAllowances, totalDeductions, processed: payroll.length, pending };
  }, [payroll]);

  const filtered = payroll.filter(p => p.employeeName.toLowerCase().includes(search.toLowerCase()) || p.department.toLowerCase().includes(search.toLowerCase()));

  const getStatusPill = (status) => {
    const map = {
      draft: { bg: COLORS.bg, col: COLORS.textSecondary },
      calculated: { bg: COLORS.infoBg, col: COLORS.info },
      approved: { bg: COLORS.warningBg, col: COLORS.warning },
      paid: { bg: COLORS.successBg, col: COLORS.success }
    };
    const c = map[status] || map.draft;
    return <span style={{ ...S.pill, background: c.bg, color: c.col }}>{status}</span>;
  };

  return (
    <div style={S.page}>
      {/* HEADER */}
      <div style={S.header}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: COLORS.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>OdooSphere / Payroll Control</div>
          <h1 style={S.title}>Payroll & Compensation</h1>
          <p style={S.subtitle}>Manage monthly payroll, compensation, approvals, and payment status.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select style={{ padding: '10px 16px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, background: COLORS.surface, fontSize: '14px', fontWeight: 600, color: COLORS.text, outline: 'none' }}>
            <option>August 2026</option>
            <option>July 2026</option>
          </select>
          <button style={S.btnSecondary} onClick={() => alert('Exporting...')}>
            <Download size={16} /> Export
          </button>
          <button style={S.btnPrimary} onClick={() => setWizardOpen(true)}>
            <Play size={16} fill="#fff" /> Run Payroll
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {[
          { label: 'Total Net Payroll', val: `₹${(kpis.totalNet/100000).toFixed(2)}L`, trend: '+4.2%', good: true },
          { label: 'Total Gross Payroll', val: `₹${(kpis.totalGross/100000).toFixed(2)}L`, trend: '+4.0%', good: true },
          { label: 'Total Allowances', val: `₹${(kpis.totalAllowances/100000).toFixed(2)}L`, trend: '+2.1%', good: true },
          { label: 'Total Deductions', val: `₹${(kpis.totalDeductions/100000).toFixed(2)}L`, trend: '-1.5%', good: true },
          { label: 'Employees Processed', val: kpis.processed, trend: '+3', good: true },
          { label: 'Pending Approval', val: kpis.pending, trend: '-2', good: true },
        ].map((k, i) => (
          <div key={i} style={{ ...S.card, padding: '20px' }}>
            <h3 style={S.kpiTitle}>{k.label}</h3>
            <div style={S.kpiValue}>{k.val}</div>
            <div style={{ ...S.kpiTrend, color: k.good ? COLORS.success : COLORS.danger }}>
              {k.good ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
              <span>{k.trend} vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* ATTENTION STRIP */}
      <div style={{ background: COLORS.warningBg, border: `1px solid #fde68a`, borderRadius: '16px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderRight: `1px solid #fde68a`, paddingRight: '24px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: COLORS.warning }}>92</span>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: COLORS.text }}>Payroll Health</div>
            <div style={{ fontSize: '12px', color: COLORS.warning }}>Stable</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: COLORS.textSecondary }}><AlertTriangle size={14} color={COLORS.warning}/> 2 records missing PAN</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: COLORS.textSecondary }}><AlertTriangle size={14} color={COLORS.warning}/> 1 salary change {'>'} 50%</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: COLORS.textSecondary }}><Clock size={14} color={COLORS.warning}/> {kpis.pending} payrolls pending approval</div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: COLORS.surface }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} color={COLORS.textMuted} style={{ position: 'absolute', left: '16px', top: '12px' }} />
            <input 
              type="text" 
              placeholder="Search employee / ID / department..." 
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, background: COLORS.bg, fontSize: '13px', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select style={{ padding: '8px 16px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, background: COLORS.bg, fontSize: '13px', outline: 'none' }}><option>All Departments</option></select>
            <select style={{ padding: '8px 16px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, background: COLORS.bg, fontSize: '13px', outline: 'none' }}><option>All Statuses</option></select>
            <span style={{ fontSize: '12px', color: COLORS.textMuted, fontWeight: 600 }}>{filtered.length} records</span>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}`, background: '#FCFDFE' }}>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employee</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gross</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Pay</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${COLORS.border}`, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background=COLORS.bg} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={p.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text }}>{p.employeeName}</div>
                        <div style={{ fontSize: '12px', color: COLORS.textMuted }}>{p.id.replace('pay-','EMP-').substring(0,8).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: COLORS.textSecondary }}>{p.department}</td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: COLORS.text }}>₹{(p.gross || (p.basicSalary + p.allowances)).toLocaleString()}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 700, color: COLORS.text }}>₹{p.netSalary.toLocaleString()}</td>
                  <td style={{ padding: '16px 24px' }}>{getStatusPill(p.status)}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button onClick={() => { setSelectedEmp(p); setDrawerOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.primary, fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                      Edit <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WIZARD MODAL (Simplified) */}
      {wizardOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: COLORS.surface, borderRadius: '28px', width: '100%', maxWidth: '600px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Run Payroll Wizard</h2>
              <button onClick={() => setWizardOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textMuted }}><X size={24} /></button>
            </div>
            {/* Stepper */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '12px', left: 0, right: 0, height: '2px', background: COLORS.border, zIndex: 0 }} />
              {['Period', 'Load', 'Preview', 'Confirm', 'Done'].map((step, i) => (
                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1 }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: i===0 ? COLORS.primary : COLORS.surface, border: `2px solid ${i===0 ? COLORS.primary : COLORS.border}`, color: i===0 ? '#fff' : COLORS.textMuted, fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i+1}</div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: i===0 ? COLORS.primary : COLORS.textMuted }}>{step}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '24px', background: COLORS.bg, borderRadius: '16px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0' }}>Step 1: Select Period</h3>
              <select style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, outline: 'none' }}><option>August 2026</option></select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setWizardOpen(false)} style={S.btnSecondary}>Cancel</button>
              <button onClick={() => { alert('Proceed to next step'); setWizardOpen(false); }} style={S.btnPrimary}>Continue</button>
            </div>
          </div>
        </div>
      )}

      {/* EDITOR DRAWER */}
      {drawerOpen && selectedEmp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.2)', zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '560px', background: COLORS.surface, height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', animation: 'slideIn 0.3s ease' }}>
            <div style={{ padding: '24px 32px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Salary Editor</h2>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textMuted }}><X size={20} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
              {/* Employee info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <img src={selectedEmp.avatar} alt="" style={{ width: '56px', height: '56px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: COLORS.text }}>{selectedEmp.employeeName}</div>
                  <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>{selectedEmp.id.replace('pay-','EMP-').substring(0,8).toUpperCase()} • {selectedEmp.department}</div>
                </div>
              </div>

              {/* Edit form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>Base Pay</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: COLORS.bg, borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text }}>Basic Salary</span>
                    <input type="text" defaultValue={selectedEmp.basicSalary} style={{ textAlign: 'right', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: 600, outline: 'none' }} />
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>Allowances</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: COLORS.bg, borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text }}>Total Allowances</span>
                      <input type="text" defaultValue={selectedEmp.allowances} style={{ textAlign: 'right', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: 600, outline: 'none' }} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>Deductions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: COLORS.bg, borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text }}>Total Deductions</span>
                      <input type="text" defaultValue={selectedEmp.deductions} style={{ textAlign: 'right', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: 600, color: COLORS.danger, outline: 'none' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Summary */}
              <div style={{ marginTop: '32px', padding: '24px', background: COLORS.primary, borderRadius: '16px', color: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}><span>Gross</span> <span>₹{(selectedEmp.gross || (selectedEmp.basicSalary + selectedEmp.allowances)).toLocaleString()}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}><span>Total Deductions</span> <span>-₹{selectedEmp.deductions.toLocaleString()}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600 }}>Net Salary</span>
                  <span style={{ fontSize: '28px', fontWeight: 700 }}>₹{selectedEmp.netSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div style={{ padding: '24px 32px', borderTop: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'flex-end', gap: '12px', background: COLORS.surface }}>
              <button onClick={() => setDrawerOpen(false)} style={S.btnSecondary}>Cancel</button>
              <button onClick={() => setDrawerOpen(false)} style={S.btnPrimary}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
};

export default HRPayrollDashboard;
