import React from 'react';
import * as Icons from 'lucide-react';
import Card from '@/components/ui/Card';
import { EVENT_ICON_MAP, EVENT_COLOR_MAP } from '../utils/timelineEvents';

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

const TimelineItem = ({ event }) => {
  const iconName = EVENT_ICON_MAP[event.type] || 'Circle';
  const IconComponent = Icons[iconName] || Icons.Circle;
  const colorKey = EVENT_COLOR_MAP[event.type] || 'default';

  // Map color key to CSS styles
  const stylesMap = {
    primary: { bg: 'var(--color-primary-light)', border: 'var(--color-primary-border)', text: 'var(--color-primary)' },
    success: { bg: 'var(--color-success-bg)', border: 'var(--color-success-border)', text: 'var(--color-success-text)' },
    warning: { bg: 'var(--color-warning-bg)', border: 'var(--color-warning-border)', text: 'var(--color-warning-text)' },
    danger: { bg: 'var(--color-danger-bg)', border: 'var(--color-danger-border)', text: 'var(--color-danger-text)' },
    info: { bg: 'var(--color-info-bg)', border: 'var(--color-info-border)', text: 'var(--color-info-text)' },
    default: { bg: 'var(--bg-surface-secondary)', border: 'var(--border-color)', text: 'var(--text-secondary)' },
  };

  const colors = stylesMap[colorKey] || stylesMap.default;

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        paddingBottom: 'var(--space-6)',
      }}
    >
      {/* Vertical line connecting nodes */}
      <div
        style={{
          position: 'absolute',
          left: '16px',
          top: '32px',
          bottom: 0,
          width: '2px',
          backgroundColor: 'var(--border-color-subtle)',
        }}
      />

      {/* Icon node */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: colors.bg,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 'var(--space-4)',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <IconComponent size={14} color={colors.text} />
      </div>

      {/* Event Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <h4
            style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-primary)',
            }}
          >
            {event.title}
          </h4>
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-tertiary)',
            }}
          >
            {formatDate(event.timestamp)}
          </span>
        </div>
        {event.description && (
          <p
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-secondary)',
              marginTop: '4px',
              lineHeight: 1.4,
            }}
          >
            {event.description}
          </p>
        )}
        {event.actorRole && event.actorRole !== 'system' && (
          <span
            style={{
              display: 'inline-block',
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              marginTop: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            By {event.actorRole}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * ActivityTimeline component displaying chronological audit history for an employee.
 */
const ActivityTimeline = ({ events, loading }) => {
  if (loading) {
    return (
      <Card title="Activity Timeline" subtitle="Audit history & updates">
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-6)' }}>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            Loading timeline...
          </span>
        </div>
      </Card>
    );
  }

  const hasEvents = events && events.length > 0;

  return (
    <Card title="Activity Timeline" subtitle="Audit history & updates">
      {!hasEvents ? (
        <div
          style={{
            padding: 'var(--space-8)',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
          }}
        >
          <Icons.Activity size={32} style={{ margin: '0 auto var(--space-2)', opacity: 0.4 }} />
          <p style={{ fontSize: 'var(--font-size-sm)' }}>No activity recorded yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'var(--space-4)', paddingLeft: 'var(--space-1)' }}>
          {events.map((event, index) => {
            // Remove the vertical line for the last item
            const isLast = index === events.length - 1;
            return (
              <div key={event.id || index} style={{ position: 'relative' }}>
                <TimelineItem event={event} />
                {isLast && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '32px',
                      bottom: 0,
                      width: '2px',
                      backgroundColor: 'var(--bg-surface)', // masks the extra line
                      zIndex: 5,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default ActivityTimeline;
