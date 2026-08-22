import React from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer } from '../ui/Drawer';
import { EMPLOYEE_NAV_ITEMS, HR_NAV_ITEMS } from '@/config/navigation';
import { APP_NAME } from '@/config/constants';

export const MobileNav = ({ isOpen, onClose, role = 'employee' }) => {
  const navItems = role === 'hr' || role === 'admin' ? HR_NAV_ITEMS : EMPLOYEE_NAV_ITEMS;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} position="left" title={APP_NAME} width="280px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-tertiary)', padding: '0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Navigation ({role.toUpperCase()})
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
              })}
            >
              <Icon size={18} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </div>
    </Drawer>
  );
};

export default MobileNav;
