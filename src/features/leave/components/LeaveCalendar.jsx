import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export const LeaveCalendar = ({ leaves = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Make Monday 0, Sunday 6
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Helper to check if a day falls within a leave period
  const getLeaveStatusForDay = (day) => {
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Ignore time portion for comparison
    dateToCheck.setHours(0, 0, 0, 0);

    for (const leave of leaves) {
      if (!leave.startDate || !leave.endDate) continue;
      
      // Parse YYYY-MM-DD manually to avoid UTC offset issues
      const [sYear, sMonth, sDay] = leave.startDate.split('-');
      const start = new Date(parseInt(sYear), parseInt(sMonth) - 1, parseInt(sDay));
      start.setHours(0, 0, 0, 0);
      
      const [eYear, eMonth, eDay] = leave.endDate.split('-');
      const end = new Date(parseInt(eYear), parseInt(eMonth) - 1, parseInt(eDay));
      end.setHours(0, 0, 0, 0);

      if (dateToCheck >= start && dateToCheck <= end) {
        return leave.status;
      }
    }
    return null;
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const getDayStyle = (day) => {
    if (!day) return {};
    
    const status = getLeaveStatusForDay(day);
    let baseStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '40px',
      width: '40px',
      borderRadius: '50%',
      margin: 'auto',
      fontSize: 'var(--font-size-sm)'
    };

    if (status === 'approved') {
      baseStyle.backgroundColor = 'var(--color-primary)';
      baseStyle.color = '#fff';
      baseStyle.fontWeight = 'bold';
    } else if (status === 'pending') {
      baseStyle.backgroundColor = 'var(--color-warning)';
      baseStyle.color = '#fff';
      baseStyle.fontWeight = 'bold';
    } else if (status === 'rejected') {
      baseStyle.backgroundColor = 'var(--color-danger)';
      baseStyle.color = '#fff';
      baseStyle.fontWeight = 'bold';
      baseStyle.textDecoration = 'line-through';
    }

    if (isToday(day)) {
      if (!status) {
        baseStyle.border = '2px solid var(--color-primary)';
        baseStyle.fontWeight = 'bold';
        baseStyle.color = 'var(--color-primary)';
      } else {
        baseStyle.boxShadow = '0 0 0 2px white, 0 0 0 4px var(--color-primary)';
      }
    }

    return baseStyle;
  };

  const renderGrid = () => {
    const grid = [];
    let dayCounter = 1;

    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          row.push(<div key={`empty-${j}`} style={{ padding: 'var(--space-2)' }}></div>);
        } else if (dayCounter > daysInMonth) {
          row.push(<div key={`empty-${j}-${i}`} style={{ padding: 'var(--space-2)' }}></div>);
        } else {
          const day = dayCounter;
          row.push(
            <div key={day} style={{ padding: 'var(--space-1)', textAlign: 'center' }}>
              <div style={getDayStyle(day)}>
                {day}
              </div>
            </div>
          );
          dayCounter++;
        }
      }
      grid.push(<div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>{row}</div>);
      if (dayCounter > daysInMonth) break;
    }
    return grid;
  };

  return (
    <Card title="Leave Calendar" subtitle="Your monthly overview">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
          <div style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-lg)' }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button variant="outline" size="sm" onClick={prevMonth}>&lt;</Button>
            <Button variant="outline" size="sm" onClick={goToToday}>Today</Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>&gt;</Button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Days Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
            {dayNames.map(day => <div key={day}>{day}</div>)}
          </div>
          
          {/* Grid */}
          <div>
            {renderGrid()}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></span>
            Approved
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }}></span>
            Pending
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-danger)' }}></span>
            Rejected
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LeaveCalendar;
