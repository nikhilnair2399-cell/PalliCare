'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Zap, AlertTriangle, X, CheckCheck } from 'lucide-react';
import { usePatientMessages, useSendPatientMessage } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_MESSAGES } from '@/lib/patient-mock-data';
import { relativeTime } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

const QUICK_MESSAGES = [
  { id: 'pain', label: 'Pain increased', text: 'My pain has increased since my last check-in. Can someone please review my medication?' },
  { id: 'side_effect', label: 'Side effect', text: 'I am experiencing a side effect from my medication and would like guidance.' },
  { id: 'nausea', label: 'Feeling nauseous', text: 'I am feeling very nauseous today. Should I take my anti-nausea medication?' },
  { id: 'question', label: 'Question', text: 'I have a question about my care plan. When would be a good time to discuss?' },
  { id: 'thankyou', label: 'Thank you', text: 'Thank you for your care and support. I am feeling better today.' },
];

export default function MessagesPage() {
  const [message, setMessage] = useState('');
  const [showQuickMessages, setShowQuickMessages] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesQuery = usePatientMessages();
  const sendMessage = useSendPatientMessage();
  const { data: rawMessages } = useWithFallback(messagesQuery, MOCK_MESSAGES);
  const messages: any[] = Array.isArray(rawMessages) ? rawMessages : MOCK_MESSAGES;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  function handleSend() {
    if (!message.trim()) return;
    const content = isUrgent ? `🚨 URGENT: ${message.trim()}` : message.trim();
    sendMessage.mutate({ content }, {
      onSuccess: () => { setMessage(''); setIsUrgent(false); },
      onError: () => { setMessage(''); setIsUrgent(false); },
    });
  }

  function insertQuickMessage(text: string) {
    setMessage(text);
    setShowQuickMessages(false);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page Header */}
      {(() => {
        const unread = messages.filter((m: any) => !m.is_patient && m.sender !== 'patient' && !m.read).length;
        return (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-teal">Messages</h1>
              <p className="mt-1 text-base text-charcoal-light">
                Communicate with your care team
              </p>
            </div>
            {unread > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-terra/10 px-3 py-1.5 text-sm font-bold text-terra">
                <span className="h-2 w-2 rounded-full bg-terra animate-pulse" />
                {unread} unread
              </span>
            )}
          </div>
        );
      })()}

      {/* Chat Container */}
      <div className="rounded-2xl bg-white">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10">
            <MessageCircle className="h-5 w-5 text-teal" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-charcoal">Care Team</h3>
            <p className="text-sm text-charcoal-light">AIIMS Bhopal &middot; Palliative Care</p>
          </div>
        </div>

        {/* Suggested Reply */}
        {(() => {
          const lastFromTeam = [...messages].reverse().find((m: any) => m.sender !== 'patient' && !m.is_patient);
          if (!lastFromTeam) return null;
          const content = ((lastFromTeam.content || lastFromTeam.message) as string || '').toLowerCase();
          const suggestions: string[] = [];
          if (content.includes('pain') || content.includes('discomfort')) suggestions.push('My pain is better today, thank you', 'Pain is still the same', 'Pain has gotten worse');
          else if (content.includes('medication') || content.includes('dose')) suggestions.push('I took all my doses', 'I missed a dose', 'I have a question about side effects');
          else if (content.includes('appointment') || content.includes('visit')) suggestions.push('I will be there', 'Can we reschedule?', 'Thank you for the reminder');
          else suggestions.push('Thank you', 'I understand', 'I have a question');
          return (
            <div className="border-b border-charcoal/5 px-6 py-3">
              <p className="text-xs font-semibold text-charcoal/40 uppercase mb-2">Suggested Replies</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setMessage(s)}
                    className="rounded-full border border-teal/20 bg-teal/5 px-3 py-1.5 text-xs font-medium text-teal hover:bg-teal/10 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Messages Area */}
        <div ref={scrollRef} className="h-[calc(100vh-24rem)] overflow-y-auto px-6 pb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <MessageCircle className="h-12 w-12 text-charcoal/15" />
              <p className="mt-3 text-base text-charcoal/40">No messages yet</p>
              <p className="text-sm text-charcoal/30">Send a message to your care team</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg: any, i: number) => {
                const isMe = msg.sender === 'patient' || msg.is_patient;
                return (
                  <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                      isMe
                        ? 'bg-teal/10 text-charcoal'
                        : 'bg-cream text-charcoal'
                    }`}>
                      {!isMe && (
                        <p className="mb-1 text-xs font-semibold text-teal">
                          {msg.sender_name || msg.sender || 'Care Team'}
                        </p>
                      )}
                      <p className="text-base leading-relaxed">
                      {(msg.content || msg.message || '').startsWith('🚨') ? (
                        <span className="font-semibold text-terra">{msg.content || msg.message}</span>
                      ) : (
                        msg.content || msg.message
                      )}
                    </p>
                      <p className="mt-1 text-right text-xs text-charcoal/30">
                        {msg.created_at ? relativeTime(msg.created_at) : (msg.time || '')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Messages Panel */}
        {showQuickMessages && (
          <div className="border-t border-charcoal/5 bg-cream/30 px-6 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-charcoal/40 uppercase">Quick Messages</span>
              <button onClick={() => setShowQuickMessages(false)} className="text-charcoal/30 hover:text-charcoal/60">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_MESSAGES.map(qm => (
                <button
                  key={qm.id}
                  onClick={() => insertQuickMessage(qm.text)}
                  className="rounded-xl border border-charcoal/10 bg-white px-3 py-2 text-sm font-medium text-charcoal/70 hover:bg-teal/5 hover:text-teal hover:border-teal/30 transition-colors"
                >
                  {qm.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-6 pb-6">
          {/* Urgency indicator */}
          {isUrgent && (
            <div className="mb-2 flex items-center gap-2 rounded-xl bg-terra/10 px-4 py-2">
              <AlertTriangle className="h-4 w-4 text-terra" />
              <span className="text-sm font-semibold text-terra">Urgent — your care team will be notified immediately</span>
              <button onClick={() => setIsUrgent(false)} className="ml-auto text-terra/50 hover:text-terra">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <button
                onClick={() => setShowQuickMessages(v => !v)}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
                  showQuickMessages ? 'bg-teal/10 text-teal' : 'bg-cream text-charcoal/40 hover:text-teal'
                }`}
                title="Quick messages"
              >
                <Zap className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsUrgent(v => !v)}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
                  isUrgent ? 'bg-terra/10 text-terra' : 'bg-cream text-charcoal/40 hover:text-terra'
                }`}
                title="Mark as urgent"
              >
                <AlertTriangle className="h-5 w-5" />
              </button>
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isUrgent ? 'Describe your urgent concern...' : 'Type a message...'}
              className={`h-14 flex-1 rounded-2xl border px-5 text-base text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 ${
                isUrgent
                  ? 'border-terra/30 bg-terra/5 focus:border-terra focus:ring-terra/20'
                  : 'border-charcoal/10 bg-cream/30 focus:border-teal focus:ring-teal/20'
              }`}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || sendMessage.isPending}
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-colors disabled:opacity-50 ${
                isUrgent ? 'bg-terra hover:bg-terra/90' : 'bg-teal hover:bg-teal/90'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
