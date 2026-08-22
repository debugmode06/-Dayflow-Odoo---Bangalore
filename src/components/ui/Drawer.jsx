import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right', // 'right' | 'left'
  width = '420px',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionStyles = {
    right: { right: 0, top: 0, bottom: 0 },
    left: { left: 0, top: 0, bottom: 0 },
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        backdropFilter: 'blur(3px)',
        zIndex: 'var(--z-drawer)',
        display: 'flex',
      }}
      className="animate-fade-in"
      onClick={onClose}
    >
      <div
        style={{
          position: 'absolute',
          ...positionStyles[position],
          width,
          maxWidth: '100vw',
          backgroundColor: 'var(--bg-surface)',
          borderLeft: position === 'right' ? '1px solid var(--border-color)' : 'none',
          borderRight: position === 'left' ? '1px solid var(--border-color)' : 'none',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        className="animate-slide-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid var(--border-color-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 'var(--space-6)', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
