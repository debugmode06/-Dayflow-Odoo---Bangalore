import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { mockHelpers } from '@/lib/demoMode';
import { Download, Building2, CreditCard, ShieldCheck, FileText, ArrowUp, ArrowDown, ChevronRight, X } from 'lucide-react';

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
};

const S = {
  page: { background: COLORS.bg, minHeight: '100%', padding: '32px', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '32px', fontWeight: 700, color: COLORS.text, margin: '0 0 8px 0', letterSpacing: '-0.02em' },
  subtitle: { fontSize: '15px', color: COLORS.textSecondary, margin: 0 },
  card: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '24px', padding: '24px', boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)' },
  btnPrimary: { background: COLORS.primary, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  btnOutline: { background: 'transparent', color: COLORS.text, border: `1px solid ${COLORS.border}`, padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' },
};

export const PayrollDashboard = () => {
  const { profile } = useAuth();
  const [payroll, setPayroll] = useState([]);
  const [payslipOpen, setPayslipOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  useEffect(() => {
    if (profile?.uid) {
      let records = mockHelpers.queryCollection('payroll', { userId: profile.uid });
      if (records.length === 0) {
        // Fallback demo data for employee
        records = [
          { id: 'pay-1', month: 'August 2026', payDate: '2026-08-31', basicSalary: 60000, allowances: 25000, deductions: 5500, netSalary: 79500, status: 'paid' },
          { id: 'pay-2', month: 'July 2026', payDate: '2026-07-31', basicSalary: 60000, allowances: 25000, deductions: 5500, netSalary: 79500, status: 'paid' },
          { id: 'pay-3', month: 'June 2026', payDate: '2026-06-30', basicSalary: 55000, allowances: 20000, deductions: 5000, netSalary: 70000, status: 'paid' },
        ];
      }
      setPayroll(records.sort((a,b) => new Date(b.payDate) - new Date(a.payDate)));
    }
  }, [profile]);

  const currentPay = payroll[0] || { basicSalary: 0, allowances: 0, deductions: 0, netSalary: 0, month: 'Current', status: 'draft' };
  const prevPay = payroll[1] || currentPay;
  const gross = currentPay.basicSalary + (currentPay.allowances || 0);
  
  const getDelta = (curr, prev) => {
    const diff = curr - prev;
    if (diff === 0) return null;
    const isUp = diff > 0;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: isUp ? COLORS.success : COLORS.danger, background: isUp ? COLORS.successBg : COLORS.dangerBg, padding: '2px 8px', borderRadius: '99px' }}>
        {isUp ? <ArrowUp size={12}/> : <ArrowDown size={12}/>} ₹{Math.abs(diff).toLocaleString()}
      </div>
    );
  };

  return (
    <div style={S.page}>
      {/* HEADER */}
      <div style={S.header}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: COLORS.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>OdooSphere / Personal Finance</div>
          <h1 style={S.title}>My Payroll & Compensation</h1>
          <p style={S.subtitle}>Your monthly earnings, deductions, payslips and compensation history.</p>
        </div>
        <div>
          <select style={{ padding: '10px 16px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, background: COLORS.surface, fontSize: '14px', fontWeight: 600, color: COLORS.text, outline: 'none' }}>
            <option>{currentPay.month}</option>
            {payroll.slice(1).map(p => <option key={p.id}>{p.month}</option>)}
          </select>
        </div>
      </div>

      {/* TOP CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Net Pay (Dominant) */}
        <div style={{ ...S.card, background: COLORS.primary, color: '#fff', border: 'none', gridColumn: 'span 2' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginBottom: '8px' }}>NET TAKE-HOME PAY</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-0.02em' }}>₹{currentPay.netSalary.toLocaleString()}</div>
            {getDelta(currentPay.netSalary, prevPay.netSalary)}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={16} /> Disbursed to HDFC Bank •••• 5678
          </div>
        </div>

        {/* Status */}
        <div style={{ ...S.card, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '13px', color: COLORS.textSecondary, fontWeight: 500, marginBottom: '8px' }}>PAYMENT STATUS</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: currentPay.status === 'paid' ? COLORS.successBg : COLORS.warningBg, color: currentPay.status === 'paid' ? COLORS.success : COLORS.warning, borderRadius: '12px', fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', alignSelf: 'flex-start' }}>
            {currentPay.status === 'paid' ? <ShieldCheck size={18}/> : <Clock size={18}/>}
            {currentPay.status}
          </div>
          <div style={{ fontSize: '12px', color: COLORS.textMuted, marginTop: '12px' }}>Processed on {currentPay.payDate}</div>
        </div>
      </div>

      {/* SALARY BREAKDOWN & STATUTORY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', marginBottom: '32px' }}>
        <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Salary Statement</h2>
            <button 
              onClick={() => { setSelectedPayslip(currentPay); setPayslipOpen(true); }}
              style={S.btnOutline}
              onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Download size={16} /> View Payslip
            </button>
          </div>
          <div style={{ display: 'flex' }}>
            {/* Earnings */}
            <div style={{ flex: 1, padding: '24px', borderRight: `1px solid ${COLORS.border}` }}>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>Earnings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: COLORS.text }}><span style={{ color: COLORS.textSecondary }}>Basic Salary</span> <span style={{ fontWeight: 600 }}>₹{currentPay.basicSalary.toLocaleString()}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: COLORS.text }}><span style={{ color: COLORS.textSecondary }}>HRA</span> <span style={{ fontWeight: 600 }}>₹{(currentPay.allowances * 0.4).toLocaleString()}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: COLORS.text }}><span style={{ color: COLORS.textSecondary }}>Special Allowance</span> <span style={{ fontWeight: 600 }}>₹{(currentPay.allowances * 0.6).toLocaleString()}</span></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: COLORS.text, fontWeight: 700, marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${COLORS.border}` }}>
                <span>Gross Earnings</span> <span>₹{gross.toLocaleString()}</span>
              </div>
            </div>
            {/* Deductions */}
            <div style={{ flex: 1, padding: '24px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>Deductions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: COLORS.text }}><span style={{ color: COLORS.textSecondary }}>PF Contribution</span> <span style={{ fontWeight: 600 }}>₹{(currentPay.deductions * 0.6).toLocaleString()}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: COLORS.text }}><span style={{ color: COLORS.textSecondary }}>Professional Tax</span> <span style={{ fontWeight: 600 }}>₹200</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: COLORS.text }}><span style={{ color: COLORS.textSecondary }}>TDS / Income Tax</span> <span style={{ fontWeight: 600 }}>₹{(currentPay.deductions * 0.4 - 200).toLocaleString()}</span></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: COLORS.danger, fontWeight: 700, marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${COLORS.border}` }}>
                <span>Total Deductions</span> <span>₹{currentPay.deductions.toLocaleString()}</span>
              </div>
            </div>
          </div>
          {/* Compensation Mix */}
          <div style={{ padding: '24px', background: COLORS.bg, borderTop: `1px solid ${COLORS.border}` }}>
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>Compensation Mix</h3>
            <div style={{ display: 'flex', height: '12px', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ width: `${(currentPay.basicSalary/gross)*100}%`, background: COLORS.primary }} />
              <div style={{ width: `${(currentPay.allowances/gross)*100}%`, background: '#6366f1' }} />
            </div>
            <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: COLORS.textSecondary }}><div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS.primary }}/> Basic</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: COLORS.textSecondary }}><div style={{ width: 8, height: 8, borderRadius: 2, background: '#6366f1' }}/> Allowances</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Statutory Cards */}
          <div style={{ ...S.card, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: COLORS.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={16} color={COLORS.text}/></div>
              <div><div style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Bank Account</div></div>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text, marginTop: '8px' }}>HDFC Bank</div>
            <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>•••• 5678</div>
          </div>

          <div style={{ ...S.card, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: COLORS.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={16} color={COLORS.text}/></div>
              <div><div style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Tax Profile</div></div>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text, marginTop: '8px' }}>PAN ABCDE•••4F</div>
            <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>New Tax Regime</div>
          </div>

          <div style={{ ...S.card, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: COLORS.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CreditCard size={16} color={COLORS.text}/></div>
              <div><div style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Provident Fund</div></div>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.text, marginTop: '8px' }}>UAN 1009••••4321</div>
          </div>
        </div>
      </div>

      {/* PAYROLL HISTORY */}
      <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: `1px solid ${COLORS.border}` }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Payroll History</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.border}`, background: '#FCFDFE' }}>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Month</th>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Salary</th>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}></th>
            </tr>
          </thead>
          <tbody>
            {payroll.map(p => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 600, color: COLORS.text }}>{p.month}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 600, color: COLORS.text }}>₹{p.netSalary.toLocaleString()}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: p.status === 'paid' ? COLORS.success : COLORS.warning, background: p.status === 'paid' ? COLORS.successBg : COLORS.warningBg, padding: '4px 10px', borderRadius: '99px', textTransform: 'uppercase' }}>{p.status}</span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <button onClick={() => { setSelectedPayslip(p); setPayslipOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textSecondary, fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                    Payslip <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAYSLIP MODAL */}
      {payslipOpen && selectedPayslip && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '700px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0' }}>OdooSphere Enterprise HRMS</h2>
                <div style={{ fontSize: '14px', color: COLORS.textSecondary }}>Payslip for {selectedPayslip.month}</div>
              </div>
              <button onClick={() => setPayslipOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textMuted }}><X size={24} /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
              <div>
                <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginBottom: '4px' }}>Employee Name</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{profile?.name || 'Employee'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginBottom: '4px' }}>Employee ID</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>EMP-{profile?.uid?.substring(0,6) || '1042'}</div>
              </div>
            </div>

            <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: COLORS.textSecondary, textTransform: 'uppercase' }}>Earnings</div>
                <div style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: COLORS.textSecondary, textTransform: 'uppercase', borderLeft: `1px solid ${COLORS.border}` }}>Deductions</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px' }}><span>Basic Salary</span> <span>₹{selectedPayslip.basicSalary.toLocaleString()}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px' }}><span>HRA</span> <span>₹{(selectedPayslip.allowances*0.4).toLocaleString()}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>Special Allowance</span> <span>₹{(selectedPayslip.allowances*0.6).toLocaleString()}</span></div>
                </div>
                <div style={{ padding: '16px', borderLeft: `1px solid ${COLORS.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px' }}><span>PF Contribution</span> <span>₹{(selectedPayslip.deductions*0.6).toLocaleString()}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px' }}><span>Professional Tax</span> <span>₹200</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>TDS</span> <span>₹{(selectedPayslip.deductions*0.4-200).toLocaleString()}</span></div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: COLORS.bg, borderTop: `1px solid ${COLORS.border}` }}>
                <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '14px' }}><span>Gross Earnings</span> <span>₹{(selectedPayslip.basicSalary+selectedPayslip.allowances).toLocaleString()}</span></div>
                <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '14px', borderLeft: `1px solid ${COLORS.border}`, color: COLORS.danger }}><span>Total Deductions</span> <span>₹{selectedPayslip.deductions.toLocaleString()}</span></div>
              </div>
            </div>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '8px' }}>Net Pay</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.primary }}>₹{selectedPayslip.netSalary.toLocaleString()}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
              <button onClick={() => window.print()} style={S.btnPrimary}><Download size={16}/> Print / Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollDashboard;
