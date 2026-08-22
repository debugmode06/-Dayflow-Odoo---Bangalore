import React, { useState } from 'react';
import Drawer from '@/components/ui/Drawer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { queryHRAssistantAI } from '../services/workforceAiService';
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';

export const HRAIAssistantDrawer = ({
  isOpen,
  onClose,
  metricsContext = {},
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your Dayflow HR Assistant powered by NVIDIA NIM Llama 3.1 8B. Ask me anything about current workforce metrics, attendance patterns, or availability impact.',
    },
  ]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMsg = query.trim();
    setQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await queryHRAssistantAI(userMsg, metricsContext);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: response.summary || response.answer,
          signals: response.positiveSignals || response.keyDrivers,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Unable to complete AI query at this moment. Standard HR metrics remain available in your dashboard.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Dayflow HR AI Assistant" width="440px">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 'var(--space-4)' }}>
        {/* Subtitle Header */}
        <div style={{ padding: '8px 12px', backgroundColor: 'var(--color-ai-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-ai-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--color-ai)" />
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-ai-text)' }}>
              NVIDIA NIM Llama 3.1 8B
            </span>
          </div>
          <Badge variant="ai" size="sm">Active Context</Badge>
        </div>

        {/* Messages List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingRight: '4px' }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '10px',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: msg.sender === 'user' ? 'var(--color-primary)' : 'var(--color-ai-bg)',
                  color: msg.sender === 'user' ? '#FFF' : 'var(--color-ai)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div
                style={{
                  maxWidth: '82%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: msg.sender === 'user' ? 'var(--color-primary)' : 'var(--bg-surface-secondary)',
                  color: msg.sender === 'user' ? '#FFF' : 'var(--text-primary)',
                  fontSize: 'var(--font-size-sm)',
                  lineHeight: 1.5,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {msg.text}
                {msg.signals && msg.signals.length > 0 && (
                  <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-color)', fontSize: '11px' }}>
                    <strong>Key Factors:</strong>
                    <ul style={{ paddingLeft: '14px', marginTop: '2px' }}>
                      {msg.signals.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-ai-bg)', color: 'var(--color-ai)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={14} />
              </div>
              <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-xs)' }}>
                <Loader2 className="animate-spin" size={14} color="var(--color-ai)" />
                <span>Analyzing workforce metrics via Llama 3.1 8B...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', paddingTop: 'var(--space-2)' }}>
          <Input
            placeholder="Ask AI: e.g. Why did health decrease?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" variant="ai" isDisabled={!query.trim() || loading} icon={Send}>
            Send
          </Button>
        </form>
      </div>
    </Drawer>
  );
};

export default HRAIAssistantDrawer;
