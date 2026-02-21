'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { usePatientMessages, useSendPatientMessage } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_MESSAGES } from '@/lib/patient-mock-data';
import { relativeTime } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function MessagesPage() {
  const [message, setMessage] = useState('');
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
    sendMessage.mutate({ content: message.trim() }, {
      onSuccess: () => setMessage(''),
      onError: () => setMessage(''),
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-teal">Messages</h1>
        <p className="mt-1 text-base text-charcoal-light">
          Communicate with your care team
        </p>
      </div>

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
                      <p className="text-base leading-relaxed">{msg.content || msg.message}</p>
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

        {/* Input Area */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="h-14 flex-1 rounded-2xl border border-charcoal/10 bg-cream/30 px-5 text-base text-charcoal placeholder:text-charcoal/30 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || sendMessage.isPending}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
