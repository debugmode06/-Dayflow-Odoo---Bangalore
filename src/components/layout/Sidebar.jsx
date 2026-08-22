import React from 'react';
import { NavLink } from 'react-router-dom';
import { EMPLOYEE_NAV_ITEMS, HR_NAV_ITEMS } from '@/config/navigation';
import { APP_NAME } from '@/config/constants';
import { Sparkles, Shield, User } from 'lucide-react';

export const Sidebar = ({ role = 'employee', isCollapsed = false, onToggleCollapse }) => {
  const navItems = role === 'hr' || role === 'admin' ? HR_NAV_ITEMS : EMPLOYEE_NAV_ITEMS;

  return (
    <aside
      style={{
        width: isCollapsed ? '72px' : '260px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        transition: 'width var(--transition-normal)',
        zIndex: 'var(--z-sticky)',
        overflowX: 'hidden',
      }}
    >
      {/* Brand Logo Header */}
      <div
        style={{
          height: '64px',
          padding: isCollapsed ? '0 16px' : '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid var(--border-color-subtle)',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--text-primary)',
            color: 'var(--text-inverse)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--font-size-base)',
            flexShrink: 0,
          }}
        >
          D
        </div>
        {!isCollapsed && (
          <div>
            <div style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-lg)', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {APP_NAME}
            </div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', fontWeight: 'var(--font-weight-semibold)' }}>
              {role === 'hr' || role === 'admin' ? 'HR Command' : 'Employee 360'}
            </div>
          </div>
        )}
      </div>

      {/* Role Badge Indicator */}
      {!isCollapsed && (
        <div style={{ padding: '16px 20px 8px 20px' }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: role === 'hr' ? 'var(--color-primary-light)' : 'var(--bg-surface-secondary)',
              border: `1px solid ${role === 'hr' ? 'var(--color-primary-border)' : 'var(--border-color)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-medium)',
              color: role === 'hr' ? 'var(--color-primary)' : 'var(--text-secondary)',
            }}
          >
            {role === 'hr' ? <Shield size={14} /> : <User size={14} />}
            <span>Mode: {role === 'hr' ? 'HR / Administrator' : 'Employee View'}</span>
          </div>
        </div>
      )}

      {/* Nav List */}
      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: isCollapsed ? '12px 0' : '10px 14px',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                  color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                })}
              >
                <Icon size={18} />
                {!isCollapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* AI Pulse Badge Footer */}
      {!isCollapsed && (role === 'hr' || role === 'admin') && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color-subtle)' }}>
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-ai-bg)',
              border: '1px solid var(--color-ai-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Sparkles size={18} color="var(--color-ai)" />
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-ai-text)' }}>
                Workforce Pulse AI
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Operational signals active
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
