import React, { useState } from 'react';
import { Menu, Bell, LogOut, Shield, User, ChevronDown } from 'lucide-react';
import Avatar from '../ui/Avatar';

export const Topbar = ({
  user,
  role = 'employee',
  onToggleRole,
  onOpenMobileNav,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Mobile Menu Button */}
        <button
          onClick={onOpenMobileNav}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            display: 'none',
          }}
          className="mobile-menu-btn"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        {/* Workspace Title Indicator */}
        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>
          OdooSphere Enterprise HRMS
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Role Switcher Demo Control */}
        {onToggleRole && (
          <button
            onClick={onToggleRole}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-color)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            title="Switch View Mode (Demo Feature)"
          >
            {role === 'hr' ? <Shield size={14} color="var(--color-primary)" /> : <User size={14} />}
            <span>Switch to {role === 'hr' ? 'Employee' : 'HR'} View</span>
          </button>
        )}

        {/* Notification Icon */}
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: 'var(--radius-full)',
            position: 'relative',
          }}
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
            }}
          />
        </button>

        {/* User Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Avatar src={user?.photoURL} name={user?.displayName || user?.email || 'User'} size="sm" />
            <div style={{ textAlign: 'left', display: 'none' }} className="user-info-text">
              <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
                {user?.displayName || 'Demo User'}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                {role.toUpperCase()}
              </div>
            </div>
            <ChevronDown size={14} color="var(--text-tertiary)" />
          </button>

          {/* User Dropdown Menu */}
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '200px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px 0',
                zIndex: 'var(--z-tooltip)',
              }}
              className="animate-slide-down"
            >
              <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-color-subtle)' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)' }}>
                  {user?.displayName || 'User'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.email || 'user@odoosphere.hr'}
                </div>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  if (user?.logout) user.logout();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--color-danger-text)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
