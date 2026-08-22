import React from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Sparkles, HelpCircle, ArrowUpRight } from 'lucide-react';

/**
 * Displays AI generated insight within the Workforce Pulse card.
 * @param {Object} props
 * @param {Object} props.insight - AI insight object, expected to have a `summary` string.
 * @param {function} props.onOpenAssistantDrawer - Callback to open the AI assistant drawer.
 */
export const AIInsightCard = ({ insight = {}, onOpenAssistantDrawer }) => {
  const { summary = 'AI insight not available.' } = insight;
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={14} className="text-indigo-500" />
        <span className="font-medium text-sm text-slate-600 uppercase">AI Insight</span>
      </div>
      <p className="text-sm text-slate-700 mb-3">{summary}</p>
      {onOpenAssistantDrawer && (
        <Button variant="outline" size="sm" icon={ArrowUpRight} onClick={onOpenAssistantDrawer}>
          Ask AI Assistant
        </Button>
      )}
    </div>
  );
};

export default AIInsightCard;
