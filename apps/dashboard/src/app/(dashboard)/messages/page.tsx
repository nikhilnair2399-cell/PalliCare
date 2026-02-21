'use client';

import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  User,
  Clock,
  CheckCheck,
  ChevronRight,
  Paperclip,
  Phone,
  Video,
  Loader2,
  Plus,
  Pin,
  PinOff,
  Zap,
  X,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUnreadMessageCount, useSendMessage } from '@/lib/hooks';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const INITIAL_THREADS = [
  {
    id: 't1',
    patientName: 'Ramesh Kumar',
    patientId: 'p1',
    lastMessage: 'Pain score has been consistently above 6 for the past 3 days. Requesting medication review.',
    lastMessageTime: '10 min ago',
    unread: 2,
    participants: ['Dr. Nikhil Nair', 'Nurse Priya', 'Ramesh Kumar'],
    avatar: 'RK',
  },
  {
    id: 't2',
    patientName: 'Sunita Devi',
    patientId: 'p2',
    lastMessage: 'Nausea subsided after switching anti-emetic. Will continue monitoring.',
    lastMessageTime: '2h ago',
    unread: 0,
    participants: ['Dr. Nikhil Nair', 'Dietitian Anita'],
    avatar: 'SD',
  },
  {
    id: 't3',
    patientName: 'Arjun Singh',
    patientId: 'p3',
    lastMessage: 'Family meeting scheduled for tomorrow at 3 PM. Chaplain confirmed.',
    lastMessageTime: '5h ago',
    unread: 1,
    participants: ['Dr. Nikhil Nair', 'Social Worker Meena', 'Chaplain Ravi'],
    avatar: 'AS',
  },
  {
    id: 't4',
    patientName: 'Lakshmi Iyer',
    patientId: 'p4',
    lastMessage: 'Breathlessness score improved to 3/10 after nebulization protocol.',
    lastMessageTime: '1d ago',
    unread: 0,
    participants: ['Dr. Nikhil Nair', 'Nurse Priya'],
    avatar: 'LI',
  },
];

type Msg = { id: string; sender: string; role: string; content: string; time: string; isOwn: boolean; pinned?: boolean; seenBy?: string[] };

const INITIAL_MESSAGES: Record<string, Msg[]> = {
  t1: [
    { id: 'm1', sender: 'Nurse Priya', role: 'nurse', content: 'Patient Ramesh Kumar is reporting pain NRS 7/10 this morning. This is the third consecutive day above 6.', time: '09:15 AM', isOwn: false },
    { id: 'm2', sender: 'Dr. Nikhil Nair', role: 'physician', content: 'Thanks for flagging. What is his current morphine dose and when was the last breakthrough dose given?', time: '09:22 AM', isOwn: true },
    { id: 'm3', sender: 'Nurse Priya', role: 'nurse', content: 'Sustained release morphine 30mg BD. Last breakthrough dose (IR morphine 10mg) was given at 6 AM. He is also reporting disturbed sleep due to pain.', time: '09:30 AM', isOwn: false },
    { id: 'm4', sender: 'Dr. Nikhil Nair', role: 'physician', content: 'Let\'s increase the SR morphine to 45mg BD and add a nighttime adjuvant. I\'ll update the care plan. Please reassess in 24 hours.', time: '09:35 AM', isOwn: true, pinned: true, seenBy: ['Nurse Priya'] },
    { id: 'm5', sender: 'Nurse Priya', role: 'nurse', content: 'Pain score has been consistently above 6 for the past 3 days. Requesting medication review.', time: '09:45 AM', isOwn: false },
  ],
  t2: [
    { id: 'm6', sender: 'Dietitian Anita', role: 'dietitian', content: 'Sunita ji has been tolerating small frequent meals better since we switched to bland diet plan. Nausea episodes reduced from 4/day to 1/day.', time: '02:00 PM', isOwn: false },
    { id: 'm7', sender: 'Dr. Nikhil Nair', role: 'physician', content: 'Good improvement. The ondansetron switch seems to be working. Let\'s continue current regime and reassess after one week.', time: '02:15 PM', isOwn: true, seenBy: ['Dietitian Anita'] },
    { id: 'm8', sender: 'Dietitian Anita', role: 'dietitian', content: 'Nausea subsided after switching anti-emetic. Will continue monitoring.', time: '02:30 PM', isOwn: false },
  ],
  t3: [
    { id: 'm9', sender: 'Social Worker Meena', role: 'social_worker', content: 'Arjun ji\'s family has requested a meeting to discuss goals of care. They have concerns about the transition to comfort-focused care.', time: '10:00 AM', isOwn: false },
    { id: 'm10', sender: 'Dr. Nikhil Nair', role: 'physician', content: 'I can be available tomorrow at 3 PM. Can we also get Chaplain Ravi to join for spiritual support? The family had expressed that as important.', time: '10:30 AM', isOwn: true, pinned: true, seenBy: ['Social Worker Meena', 'Chaplain Ravi'] },
    { id: 'm11', sender: 'Social Worker Meena', role: 'social_worker', content: 'Family meeting scheduled for tomorrow at 3 PM. Chaplain confirmed.', time: '11:00 AM', isOwn: false },
  ],
};

// ── Quick-Reply Templates ──────────────────────────────────────────
const MESSAGE_TEMPLATES = [
  { id: 'ack', label: 'Acknowledge', text: 'Noted, thank you. Will review and respond shortly.' },
  { id: 'pain_reassess', label: 'Pain Reassess', text: 'Please reassess pain score in 1 hour and document NRS + functional impact.' },
  { id: 'dose_change', label: 'Dose Change', text: 'Dose adjustment has been updated in the care plan. Please administer as per revised orders and monitor for side effects.' },
  { id: 'escalate', label: 'Escalate', text: 'Escalating to senior consultant. Please continue current management and document vitals q30min until reviewed.' },
  { id: 'family_update', label: 'Family Update', text: 'Please update the family on current status and document their concerns/questions in the notes.' },
  { id: 'labs', label: 'Order Labs', text: 'Please arrange for CBC, RFT, LFT, and electrolytes. Fasting sample preferred.' },
];

const ROLE_COLORS: Record<string, string> = {
  physician: 'bg-teal/10 text-teal',
  nurse: 'bg-amber/10 text-amber',
  dietitian: 'bg-sage/20 text-sage',
  social_worker: 'bg-terra/10 text-terra',
  chaplain: 'bg-charcoal/10 text-charcoal/60',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThread, setSelectedThread] = useState<string>(INITIAL_THREADS[0]?.id || '');
  const [newMessage, setNewMessage] = useState('');
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [callToast, setCallToast] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // API hooks
  const unreadCountQuery = useUnreadMessageCount();
  const sendMessageMutation = useSendMessage();
  const totalUnread = (unreadCountQuery.data as any)?.count ?? threads.reduce((s, t) => s + t.unread, 0);

  const filteredThreads = threads.filter(
    (t) =>
      !searchQuery ||
      t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeThread = threads.find((t) => t.id === selectedThread);
  const threadMessages = messages[selectedThread] || [];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages.length]);

  // Mark thread as read on selection
  useEffect(() => {
    if (selectedThread) {
      setThreads(prev => prev.map(t =>
        t.id === selectedThread ? { ...t, unread: 0 } : t
      ));
    }
  }, [selectedThread]);

  function handleSendMessage() {
    if (!newMessage.trim() || !activeThread) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();

    const msg = {
      id: `msg-${Date.now()}`,
      sender: 'Dr. Nikhil Nair',
      role: 'physician',
      content: newMessage.trim(),
      time: timeStr,
      isOwn: true,
    };

    // Add message to thread
    setMessages(prev => ({
      ...prev,
      [selectedThread]: [...(prev[selectedThread] || []), msg],
    }));

    // Update thread preview
    setThreads(prev => prev.map(t =>
      t.id === selectedThread
        ? { ...t, lastMessage: newMessage.trim(), lastMessageTime: 'just now' }
        : t
    ));

    // Try API send
    sendMessageMutation.mutate({
      patient_id: activeThread.patientId,
      content: newMessage.trim(),
      message_type: 'text',
    });

    setNewMessage('');
  }

  function togglePin(msgId: string) {
    setMessages(prev => ({
      ...prev,
      [selectedThread]: (prev[selectedThread] || []).map(m =>
        m.id === msgId ? { ...m, pinned: !m.pinned } : m,
      ),
    }));
  }

  function insertTemplate(text: string) {
    setNewMessage(text);
    setShowTemplates(false);
  }

  const pinnedMessages = threadMessages.filter(m => m.pinned);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal">Messages</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Care team communication &amp; patient discussion threads
            {totalUnread > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-teal px-1.5 text-[10px] font-bold text-white">
                {totalUnread} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Sprint 38 — Conversation Stats Banner */}
      {(() => {
        const totalThreads = threads.length;
        const unreadThreads = threads.filter(t => t.unread > 0).length;
        const totalMessages = Object.values(messages).reduce((s, msgs) => s + msgs.length, 0);
        const ownMessages = Object.values(messages).flat().filter(m => m.isOwn).length;
        const mostActive = [...threads].sort((a, b) => (messages[b.id]?.length || 0) - (messages[a.id]?.length || 0))[0];
        return (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-sage-light/20 bg-white px-4 py-3">
              <p className="text-[10px] font-semibold text-charcoal/40 uppercase">Threads</p>
              <p className="mt-1 text-xl font-bold text-charcoal">{totalThreads}</p>
              <p className="text-[10px] text-charcoal/40">{unreadThreads} unread</p>
            </div>
            <div className="rounded-lg border border-sage-light/20 bg-white px-4 py-3">
              <p className="text-[10px] font-semibold text-charcoal/40 uppercase">Messages</p>
              <p className="mt-1 text-xl font-bold text-charcoal">{totalMessages}</p>
              <p className="text-[10px] text-charcoal/40">{ownMessages} sent by you</p>
            </div>
            <div className="rounded-lg border border-sage-light/20 bg-white px-4 py-3">
              <p className="text-[10px] font-semibold text-charcoal/40 uppercase">Avg Response</p>
              <p className="mt-1 text-xl font-bold text-teal">8 min</p>
              <p className="text-[10px] text-charcoal/40">within target</p>
            </div>
            <div className="rounded-lg border border-sage-light/20 bg-white px-4 py-3">
              <p className="text-[10px] font-semibold text-charcoal/40 uppercase">Most Active</p>
              <p className="mt-1 text-sm font-bold text-charcoal truncate">{mostActive?.patientName || '—'}</p>
              <p className="text-[10px] text-charcoal/40">{messages[mostActive?.id || '']?.length || 0} messages</p>
            </div>
          </div>
        );
      })()}

      {/* Communication Activity by Patient */}
      {(() => {
        const patientActivity = threads.map(t => {
          const msgs = messages[t.id] || [];
          const ownMsgs = msgs.filter(m => m.isOwn).length;
          const teamMsgs = msgs.filter(m => !m.isOwn).length;
          return { name: t.patientName, avatar: t.avatar, own: ownMsgs, team: teamMsgs, total: msgs.length };
        }).sort((a, b) => b.total - a.total);

        const maxTotal = Math.max(...patientActivity.map(p => p.total), 1);

        return (
          <div className="rounded-xl border border-sage-light/30 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-teal" />
              <h2 className="text-sm font-bold text-teal">Communication Volume</h2>
            </div>
            <div className="space-y-2">
              {patientActivity.map(p => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-sage/20 text-[9px] font-bold text-charcoal/70">
                    {p.avatar}
                  </div>
                  <span className="text-xs text-charcoal/70 w-24 truncate">{p.name}</span>
                  <div className="flex-1 flex h-4 overflow-hidden rounded-full bg-cream">
                    <div className="h-full bg-teal/70 rounded-l-full" style={{ width: `${(p.own / maxTotal) * 100}%` }} title={`You: ${p.own}`} />
                    <div className="h-full bg-sage/70" style={{ width: `${(p.team / maxTotal) * 100}%` }} title={`Team: ${p.team}`} />
                  </div>
                  <span className="text-[10px] text-charcoal/40 w-6 text-right">{p.total}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-4 text-[10px] text-charcoal/40">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-teal/70" />Your messages</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sage/70" />Team messages</span>
            </div>
          </div>
        );
      })()}

      {/* Main layout */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Thread list */}
        <div className="flex flex-col rounded-xl border border-sage-light/30 bg-white shadow-sm lg:col-span-1">
          {/* Search */}
          <div className="border-b border-sage-light/20 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-sage-light/30 bg-cream/50 py-2 pl-9 pr-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30"
              />
            </div>
          </div>

          {/* Thread items */}
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setSelectedThread(thread.id)}
                className={cn(
                  'w-full border-b border-sage-light/10 p-4 text-left transition-colors',
                  selectedThread === thread.id
                    ? 'bg-teal/5'
                    : 'hover:bg-cream/50',
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sage/20 text-xs font-bold text-charcoal/70">
                    {thread.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-charcoal">
                        {thread.patientName}
                      </span>
                      <span className="flex-shrink-0 text-[10px] text-charcoal/40">
                        {thread.lastMessageTime}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-charcoal/60">
                      {thread.lastMessage}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-[10px] text-charcoal/40">
                        {thread.participants.length} participants
                      </span>
                      {thread.unread > 0 && (
                        <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-teal px-1 text-[10px] font-bold text-white">
                          {thread.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        {activeThread ? (
          <div className="flex flex-col rounded-xl border border-sage-light/30 bg-white shadow-sm lg:col-span-2">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-sage-light/20 px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-xs font-bold text-charcoal/70">
                  {activeThread.avatar}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-charcoal">
                    {activeThread.patientName}
                  </h2>
                  <p className="text-[10px] text-charcoal/40">
                    {activeThread.participants.join(' \u00b7 ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setCallToast('Voice call initiated...'); setTimeout(() => setCallToast(null), 3000); }}
                  className="rounded-lg p-2 text-charcoal/40 hover:bg-cream hover:text-teal transition-colors"
                  title="Voice call"
                >
                  <Phone className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { setCallToast('Video call initiated...'); setTimeout(() => setCallToast(null), 3000); }}
                  className="rounded-lg p-2 text-charcoal/40 hover:bg-cream hover:text-teal transition-colors"
                  title="Video call"
                >
                  <Video className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Pinned Messages Banner */}
            {pinnedMessages.length > 0 && (
              <div className="border-b border-sage-light/20 bg-amber/5 px-5 py-2">
                <div className="flex items-center gap-2">
                  <Pin className="h-3 w-3 text-amber" />
                  <span className="text-[10px] font-bold text-amber uppercase">Pinned ({pinnedMessages.length})</span>
                </div>
                {pinnedMessages.map(pm => (
                  <div key={pm.id} className="mt-1 flex items-center gap-2">
                    <p className="flex-1 truncate text-xs text-charcoal/60">
                      <span className="font-semibold">{pm.sender}:</span> {pm.content}
                    </p>
                    <button onClick={() => togglePin(pm.id)} className="text-charcoal/30 hover:text-charcoal/60">
                      <PinOff className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {threadMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'group flex',
                    msg.isOwn ? 'justify-end' : 'justify-start',
                  )}
                >
                  <div className={cn('max-w-[75%]', msg.isOwn ? 'text-right' : '')}>
                    <div
                      className={cn(
                        'relative rounded-xl px-4 py-3',
                        msg.isOwn
                          ? 'bg-teal text-white'
                          : 'bg-cream/80 text-charcoal',
                        msg.pinned && 'ring-1 ring-amber/40',
                      )}
                    >
                      {msg.pinned && (
                        <Pin className="absolute -top-1.5 -right-1.5 h-3 w-3 text-amber" />
                      )}
                      {/* Pin action on hover */}
                      <button
                        onClick={() => togglePin(msg.id)}
                        className={cn(
                          'absolute -top-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-1 shadow-sm',
                          msg.isOwn ? '-left-2 bg-white text-charcoal/50 hover:text-teal' : '-right-2 bg-white text-charcoal/50 hover:text-teal',
                        )}
                        title={msg.pinned ? 'Unpin' : 'Pin'}
                      >
                        {msg.pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                      </button>
                      {!msg.isOwn && (
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xs font-bold">{msg.sender}</span>
                          <span
                            className={cn(
                              'rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase',
                              ROLE_COLORS[msg.role] || 'bg-charcoal/10 text-charcoal/50',
                            )}
                          >
                            {msg.role.replace('_', ' ')}
                          </span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div
                        className={cn(
                          'mt-1.5 flex items-center gap-1 text-[10px]',
                          msg.isOwn ? 'justify-end text-white/60' : 'text-charcoal/40',
                        )}
                      >
                        <Clock className="h-3 w-3" />
                        {msg.time}
                        {msg.isOwn && <CheckCheck className="ml-1 h-3 w-3" />}
                      </div>
                    </div>
                    {/* Read receipts */}
                    {msg.isOwn && msg.seenBy && msg.seenBy.length > 0 && (
                      <p className="mt-0.5 text-[9px] text-charcoal/35">
                        Seen by {msg.seenBy.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick-Reply Templates */}
            {showTemplates && (
              <div className="border-t border-sage-light/20 bg-cream/30 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase">Quick Replies</span>
                  <button onClick={() => setShowTemplates(false)} className="text-charcoal/30 hover:text-charcoal/60">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {MESSAGE_TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => insertTemplate(t.text)}
                      className="rounded-lg border border-sage-light/30 bg-white px-3 py-1.5 text-xs font-medium text-charcoal/70 hover:bg-teal/5 hover:text-teal hover:border-teal/30 transition-colors"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message input */}
            <div className="border-t border-sage-light/20 p-4">
              <div className="flex items-end gap-3">
                <div className="flex flex-shrink-0 gap-1">
                  <button
                    onClick={() => setShowTemplates(v => !v)}
                    className={cn(
                      'rounded-lg p-2 transition-colors',
                      showTemplates ? 'bg-teal/10 text-teal' : 'text-charcoal/40 hover:bg-cream hover:text-teal',
                    )}
                    title="Quick replies"
                  >
                    <Zap className="h-5 w-5" />
                  </button>
                  <label
                    className="flex-shrink-0 rounded-lg p-2 text-charcoal/40 hover:bg-cream hover:text-teal cursor-pointer transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="h-5 w-5" />
                    <input type="file" className="hidden" onChange={() => { setCallToast('File attached'); setTimeout(() => setCallToast(null), 3000); }} />
                  </label>
                </div>
                <div className="flex-1">
                  <textarea
                    rows={1}
                    placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full resize-none rounded-xl border border-sage-light/30 bg-cream/30 px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal text-white shadow-sm hover:bg-teal/90 disabled:opacity-50 transition-colors"
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-sage-light/40 bg-cream/30 lg:col-span-2">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-charcoal/20" />
              <p className="mt-3 text-sm font-medium text-charcoal/50">Select a conversation to view messages</p>
            </div>
          </div>
        )}
      </div>
      {/* Call / Attach Toast */}
      {callToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-teal px-5 py-3 text-sm font-semibold text-white shadow-lg toast-slide-in">
          {callToast}
        </div>
      )}
    </div>
  );
}
