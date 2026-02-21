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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-teal">Messages</h1>
        <p className="text-sm text-charcoal-light">
          Communicate with your care team
        </p>
      </div>

      {/* Chat Container */}
      <div className="rounded-xl border border-sage-light/30 bg-white shadow-sm">
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b border-sage-light/20 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10">
            <MessageCircle className="h-5 w-5 text-teal" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-charcoal">Care Team</h3>
            <p className="text-xs text-charcoal-light">AIIMS Bhopal &middot; Palliative Care</p>
          </div>
        </div>

        {/* Messages Area */}
        <div ref={scrollRef} className="h-[calc(100vh-22rem)] overflow-y-auto p-5 lg:h-[calc(100vh-20rem)]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <MessageCircle className="h-12 w-12 text-charcoal/15" />
              <p className="mt-3 text-sm text-charcoal/40">No messages yet</p>
              <p className="text-xs text-charcoal/30">Send a message to your care team</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg: any, i: number) => {
                const isMe = msg.sender === 'patient' || msg.is_patient;
                return (
                  <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-xl px-4 py-3 ${
                      isMe
                        ? 'bg-teal text-white'
                        : 'border border-sage-light/20 bg-cream/30 text-charcoal'
                    }`}>
                      {!isMe && (
                        <p className={`mb-1 text-[10px] font-semibold ${isMe ? 'text-white/70' : 'text-teal'}`}>
                          {msg.sender_name || msg.sender || 'Care Team'}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed">{msg.content || msg.message}</p>
                      <p className={`mt-1 text-right text-[10px] ${isMe ? 'text-white/50' : 'text-charcoal/40'}`}>
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
        <div className="border-t border-sage-light/20 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-sage-light/30 bg-cream/30 px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || sendMessage.isPending}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
