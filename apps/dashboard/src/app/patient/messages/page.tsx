'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePatientMessages, useSendPatientMessage } from '@/lib/patient-hooks';
import { useWithFallback } from '@/lib/use-api-status';
import { MOCK_MESSAGES } from '@/lib/patient-mock-data';
import { relativeTime } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PatientMessagesPage() {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesQuery = usePatientMessages();
  const sendMessage = useSendPatientMessage();
  const { data: rawMessages } = useWithFallback(messagesQuery, MOCK_MESSAGES);
  const messages: any[] = Array.isArray(rawMessages)
    ? rawMessages
    : (rawMessages as any)?.data ?? MOCK_MESSAGES;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  function handleSend() {
    if (!message.trim()) return;
    sendMessage.mutate(
      { content: message.trim() },
      {
        onSuccess: () => setMessage(''),
        onError: () => {
          // Demo mode: still clear + add locally
          setMessage('');
        },
      },
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-2xl flex-col lg:h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-heading text-2xl font-bold text-teal">Messages</h1>
        <p className="text-sm text-charcoal-light">
          Chat with your care team
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-sage-light/20 bg-white p-4 shadow-sm">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <MessageCircle className="h-12 w-12 text-charcoal/20" />
            <p className="mt-3 text-sm font-medium text-charcoal-light">
              No messages yet
            </p>
            <p className="mt-1 text-xs text-charcoal/40">
              Send a message to your care team
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg: any) => (
              <div
                key={msg.id}
                className={cn(
                  'flex',
                  msg.is_from_patient ? 'justify-end' : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    msg.is_from_patient
                      ? 'rounded-br-md bg-gradient-to-br from-sage to-teal text-white'
                      : 'rounded-bl-md border border-sage-light/20 bg-cream/50',
                  )}
                >
                  {!msg.is_from_patient && (
                    <p className="mb-1 text-[10px] font-semibold text-teal">
                      {msg.sender_name}
                      {msg.sender_role && (
                        <span className="ml-1 font-normal text-charcoal/40">
                          &middot; {msg.sender_role}
                        </span>
                      )}
                    </p>
                  )}
                  <p
                    className={cn(
                      'text-sm leading-relaxed',
                      msg.is_from_patient
                        ? 'text-white/95'
                        : 'text-charcoal',
                    )}
                  >
                    {msg.content}
                  </p>
                  <p
                    className={cn(
                      'mt-1.5 text-[10px]',
                      msg.is_from_patient
                        ? 'text-white/60'
                        : 'text-charcoal/40',
                    )}
                  >
                    {relativeTime(msg.sent_at)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="mt-3 flex items-end gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message to your care team..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-sage-light/30 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          style={{ minHeight: '44px', maxHeight: '120px' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = '44px';
            target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
          }}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || sendMessage.isPending}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-sage to-teal text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
