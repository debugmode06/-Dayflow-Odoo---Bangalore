import React, { useState } from 'react';
import Drawer from '@/components/ui/Drawer';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Drawer that shows detailed breakdown for a single signal (e.g., Attendance, Availability).
 * @param {Object} props
 * @param {boolean} props.isOpen - Drawer visibility flag.
 * @param {function} props.onClose - Callback to close the drawer.
 * @param {Object} props.signal - Signal object containing title, score, status, explanation, breakdown.
 */
export const SignalDetailDrawer = ({ isOpen, onClose, signal }) => {
  if (!signal) return null;
  const { title, score, status, explanation, breakdown } = signal;

  const getStatusIcon = () => {
    if (status === 'up') return <CheckCircle className="text-emerald-500" size={20} />;
    if (status === 'down') return <AlertTriangle className="text-amber-500" size={20} />;
    return <Info className="text-slate-500" size={20} />;
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`${title} Details`} width="460px">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-xl font-bold">{score !== null ? `${score}%` : '--'}</span>
        </div>
        <p className="text-sm text-slate-600">{explanation}</p>
        <div className="border-t pt-2">
          <h4 className="font-medium mb-2">Breakdown</h4>
          <pre className="bg-slate-100 p-2 rounded text-sm overflow-auto">
{JSON.stringify(breakdown, null, 2)}
          </pre>
        </div>
      </div>
    </Drawer>
  );
};

export default SignalDetailDrawer;
