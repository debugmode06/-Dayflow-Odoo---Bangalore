import React, { useState } from 'react';
import { Heart, Building, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Card from '@/components/ui/Card';

/**
 * EmergencyAndBankInfo — Primary emergency contact and statutory bank details with privacy mask.
 */
const EmergencyAndBankInfo = ({ profile }) => {
  const [showAccount, setShowAccount] = useState(false);

  const emergency = profile?.emergencyContact || {
    name: 'Sunita Mehta',
    relation: 'Spouse',
    phone: '+91 98123 45678',
  };

  const bank = profile?.bankDetails || {
    bankName: 'HDFC Bank Ltd.',
    accountNumber: '50100293847561',
    ifscCode: 'HDFC0001234',
    pan: 'ABCDE1234F',
    uan: '100987654321',
  };

  const maskAccount = (accNo) => {
    if (!accNo) return '—';
    if (showAccount) return accNo;
    return `•••• •••• ${accNo.slice(-4)}`;
  };

  return (
    <Card
      title="Emergency & Financial Info"
      subtitle="Statutory payroll bank accounts & emergency contact"
    >
      <div style={{ marginTop: 'var(--space-2)' }}>
        {/* Emergency Contact */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <Heart size={14} color="var(--color-danger)" />
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Primary Emergency Contact
            </span>
          </div>
          <div
            style={{
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-color-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
                  {emergency.name}
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                  Relation: {emergency.relation}
                </p>
              </div>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-primary)' }}>
                {emergency.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Bank & Statutory Details */}
        <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-color-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Building size={14} color="var(--color-info)" />
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Bank & Tax Details
              </span>
            </div>
            <button
              onClick={() => setShowAccount(!showAccount)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: 'var(--font-size-xs)',
                cursor: 'pointer',
                padding: '2px 6px',
              }}
              title="Toggle Account Number Visibility"
            >
              {showAccount ? <EyeOff size={12} /> : <Eye size={12} />}
              <span>{showAccount ? 'Hide' : 'Reveal'}</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
            <div style={{ padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color-subtle)' }}>
              <p style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Bank Name</p>
              <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>{bank.bankName}</p>
            </div>

            <div style={{ padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color-subtle)' }}>
              <p style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Account No.</p>
              <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                {maskAccount(bank.accountNumber)}
              </p>
            </div>

            <div style={{ padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color-subtle)' }}>
              <p style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>IFSC Code</p>
              <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{bank.ifscCode}</p>
            </div>

            <div style={{ padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color-subtle)' }}>
              <p style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>PAN Number</p>
              <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{bank.pan}</p>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)', fontSize: 'var(--font-size-xs)' }}>
            <ShieldCheck size={14} />
            <span>Bank account verified for direct payroll deposit</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EmergencyAndBankInfo;
