import React from 'react';
import { Activity, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import '../styles/workforce.css';

export const SignalCard = ({ title, score, status, explanation, onClick }) => {
  const getIcon = () => {
    if (status === 'up') return <CheckCircle className="text-emerald-500" size={20} />;
    if (status === 'down') return <AlertTriangle className="text-amber-500" size={20} />;
    return <Info className="text-blue-500" size={20} />;
  };

  const statusText = () => {
    if (status === 'up') return 'Strong / Improving';
    if (status === 'down') return 'Needs Attention';
    if (status === 'neutral') return 'Insufficient Data';
    return 'Stable';
  };

  return (
    <div 
      className="bg-white rounded-xl p-4 border border-slate-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-slate-600 font-medium text-sm">{title}</h4>
        {getIcon()}
      </div>
      <div className="mb-2">
        <span className="text-3xl font-semibold text-slate-800">
          {score !== null ? score : '--'}
        </span>
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 mb-1">{statusText()}</p>
        <p className="text-xs text-slate-400 leading-tight">{explanation}</p>
      </div>
    </div>
  );
};
