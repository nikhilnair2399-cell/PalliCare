'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Zap, AlertTriangle, X, CheckCheck, Clock, TrendingDown, BarChart3 } from 'lucide-react';
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

      {/* Care Team Response Time Insight */}
      {messages.length >= 4 && (() => {
        const responseTimes: number[] = [];
        for (let i = 1; i < messages.length; i++) {
          const prev = messages[i - 1];
          const curr = messages[i];
          const prevIsPatient = prev.sender === 'patient' || prev.is_patient;
          const currIsTeam = curr.sender !== 'patient' && !curr.is_patient;
          if (prevIsPatient && currIsTeam) {
            const prevTime = new Date(prev.created_at || prev.timestamp || 0).getTime();
            const currTime = new Date(curr.created_at || curr.timestamp || 0).getTime();
            if (currTime > prevTime) responseTimes.push(currTime - prevTime);
          }
        }
        if (responseTimes.length === 0) return null;

        const avgMs = responseTimes.reduce((s, v) => s + v, 0) / responseTimes.length;
        const fastestMs = Math.min(...responseTimes);
        const formatTime = (ms: number) => {
          const mins = Math.round(ms / 60000);
          if (mins < 60) return `${mins}m`;
          const hrs = Math.floor(mins / 60);
          const rem = mins % 60;
          return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
        };

        const teamMsgs = messages.filter((m: any) => m.sender !== 'patient' && !m.is_patient);
        const patientMsgs = messages.filter((m: any) => m.sender === 'patient' || m.is_patient);

        return (
          <div className="rounded-2xl bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-teal" />
              <h3 className="text-base font-semibold text-charcoal">Response Time</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-heading text-2xl font-bold text-teal">{formatTime(avgMs)}</p>
                <p className="text-xs text-charcoal/50">Avg response</p>
              </div>
              <div className="text-center">
                <p className="font-heading text-2xl font-bold text-sage-dark">{formatTime(fastestMs)}</p>
                <p className="text-xs text-charcoal/50">Fastest</p>
              </div>
              <div className="text-center">
                <p className="font-heading text-2xl font-bold text-charcoal">{responseTimes.length}</p>
                <p className="text-xs text-charcoal/50">Replies tracked</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 border-t border-charcoal/5 pt-3">
              <div className="flex-1 flex items-center gap-2 text-sm text-charcoal/60">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{teamMsgs.length} from care team</span>
              </div>
              <div className="flex-1 flex items-center gap-2 text-sm text-charcoal/60">
                <CheckCheck className="h-3.5 w-3.5" />
                <span>{patientMsgs.length} from you</span>
              </div>
            </div>
            {avgMs < 3600000 && (
              <p className="mt-2 text-xs text-sage-dark flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                Your care team typically responds within an hour
              </p>
            )}
          </div>
        );
      })()}

      {/* Sprint 52 — Conversation Topics Breakdown */}
      {messages.length >= 3 && (() => {
        const TOPIC_KEYWORDS: { topic: string; keywords: string[]; color: string; icon: string }[] = [
          { topic: 'Pain', keywords: ['pain', 'hurt', 'ache', 'discomfort', 'morphine', 'opioid'], color: 'bg-terra', icon: '🔥' },
          { topic: 'Medication', keywords: ['medication', 'dose', 'medicine', 'tablet', 'side effect', 'drug'], color: 'bg-amber', icon: '💊' },
          { topic: 'Appointment', keywords: ['appointment', 'visit', 'schedule', 'follow-up', 'clinic'], color: 'bg-teal', icon: '📅' },
          { topic: 'Nausea', keywords: ['nausea', 'nauseous', 'vomit', 'sick', 'stomach'], color: 'bg-lavender', icon: '🤢' },
          { topic: 'General', keywords: ['thank', 'question', 'help', 'good', 'better', 'okay'], color: 'bg-sage', icon: '💬' },
        ];
        const topicCounts: Record<string, number> = {};
        TOPIC_KEYWORDS.forEach((t) => { topicCounts[t.topic] = 0; });
        messages.forEach((m: any) => {
          const text = ((m.content || m.message) as string || '').toLowerCase();
          let matched = false;
          TOPIC_KEYWORDS.forEach((t) => {
            if (t.keywords.some((kw) => text.includes(kw))) {
              topicCounts[t.topic] += 1;
              matched = true;
            }
          });
          if (!matched) topicCounts['General'] += 1;
        });
        const totalTagged = Object.values(topicCounts).reduce((s, v) => s + v, 0);
        const sorted = TOPIC_KEYWORDS.map((t) => ({ ...t, count: topicCounts[t.topic] })).filter((t) => t.count > 0).sort((a, b) => b.count - a.count);
        return (
          <div className="rounded-2xl bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-teal" />
              <h3 className="text-base font-semibold text-charcoal">Conversation Topics</h3>
              <span className="ml-auto text-[10px] text-charcoal/40">{messages.length} messages</span>
            </div>
            <div className="space-y-2">
              {sorted.map((t) => {
                const pct = totalTagged > 0 ? Math.round((t.count / totalTagged) * 100) : 0;
                return (
                  <div key={t.topic} className="flex items-center gap-3">
                    <span className="text-sm w-5">{t.icon}</span>
                    <span className="w-20 text-xs font-medium text-charcoal">{t.topic}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream">
                      <div className={`h-full rounded-full ${t.color}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-xs font-bold text-charcoal/50">{pct}%</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-charcoal/40">
              {sorted[0]?.topic === 'Pain'
                ? 'Most conversations are about pain management. Your team is monitoring closely.'
                : sorted[0]?.topic === 'Medication'
                ? 'Medication-related discussions are most common. Keep asking questions about your treatment.'
                : 'Your conversations span multiple topics. Good communication with your care team!'}
            </p>
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
