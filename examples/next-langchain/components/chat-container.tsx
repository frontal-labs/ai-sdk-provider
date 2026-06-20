'use client';

import type { ChatStatus } from 'ai';
import { AlertCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { CustomDataMessage } from '../app/types';
import { ChatInput } from './chat-input';
import { ChatMessage } from './chat-message';
import { EmptyState } from './empty-state';
import { ThinkingIndicator } from './thinking-indicator';

interface ChatContainerProps {
  configPanel?: React.ReactNode;
  description?: React.ReactNode;
  error?: Error | undefined;
  messages: CustomDataMessage[];
  onSend: (message: string) => void;
  placeholder?: string;
  status: ChatStatus;
  suggestions?: string[];
  title: string;
}

export function ChatContainer({
  messages,
  onSend,
  status,
  error,
  placeholder,
  title,
  description,
  configPanel,
  suggestions,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex-shrink-0 rounded-t-xl border-[var(--border)] border-b p-6">
        <h1 className="mb-2 font-semibold text-2xl text-[var(--foreground)]">
          {title}
        </h1>
        {description && (
          <div className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
            {description}
          </div>
        )}
        {configPanel && <div className="mt-4">{configPanel}</div>}
      </div>

      {/* Error display */}
      {error && (
        <div className="mx-6 mt-4 animate-fade-in rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" strokeWidth={2} />
            {error.message}
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <EmptyState onSend={onSend} suggestions={suggestions} />
        ) : (
          <>
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <ThinkingIndicator
              isStreaming={status === 'submitted' || status === 'streaming'}
            />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput
        disabled={status === 'submitted' || status === 'streaming'}
        onSend={onSend}
        placeholder={placeholder}
      />
    </div>
  );
}
