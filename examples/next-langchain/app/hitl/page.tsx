'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { AlertCircle, Shield, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChatInput } from '../../components/chat-input';
import { ChatMessage } from '../../components/chat-message';
import {
  getPendingApprovals,
  ToolApprovalCard,
} from '../../components/tool-approval-card';
import type { CustomDataMessage } from '../types';

/**
 * Generate a unique thread ID for HITL persistence
 */
function generateThreadId() {
  return `thread-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function HITLPage() {
  const [threadId] = useState(() => generateThreadId());

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/hitl',
        body: { threadId },
      }),
    [threadId],
  );

  const { messages, status, error, sendMessage, addToolApprovalResponse } =
    useChat<CustomDataMessage>({
      transport,
      /**
       * Automatically send a new request when tool approval responses are added.
       * This checks if there are any dynamic-tool parts with approval-responded state
       * that don't have output yet (meaning the tool hasn't been executed).
       */
      sendAutomaticallyWhen: ({ messages }) => {
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage || lastMessage.role !== 'assistant') {
          return false;
        }

        // Check if there's a tool with approval-responded that needs execution
        // Use part.output == null to check for both undefined and null
        const hasApprovalResponse = lastMessage.parts.some(
          part =>
            part.type === 'dynamic-tool' &&
            part.state === 'approval-responded' &&
            (part as { output?: unknown }).output == null,
        );

        return hasApprovalResponse;
      },
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const pendingApprovals = getPendingApprovals(messages);

  const handleApprove = useCallback(
    (approvalId: string) => {
      addToolApprovalResponse({ id: approvalId, approved: true });
    },
    [addToolApprovalResponse],
  );

  const handleReject = useCallback(
    (approvalId: string, reason?: string) => {
      addToolApprovalResponse({ id: approvalId, approved: false, reason });
    },
    [addToolApprovalResponse],
  );

  const suggestions = [
    'Send an email to john@example.com saying hello',
    'Search for information about AI',
    'Delete the file report.pdf',
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex-shrink-0 rounded-t-xl border-[var(--border)] border-b p-6">
        <h1 className="mb-2 font-semibold text-2xl text-[var(--foreground)]">
          Human-in-the-Loop Agent
        </h1>
        <div className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
          Uses LangChain&apos;s <code>humanInTheLoopMiddleware</code> to require
          approval for sensitive actions. Try sending an email or deleting a
          file - you&apos;ll be asked to approve the action before it executes.
          Search operations are auto-approved.
        </div>
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
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600/20 to-yellow-500/20">
              <Shield className="h-8 w-8 text-amber-400" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 font-medium text-[var(--foreground)] text-lg">
              Human-in-the-Loop Demo
            </h3>
            <p className="mb-6 max-w-xs text-[var(--foreground-secondary)] text-sm">
              Sensitive actions require your approval before executing.
            </p>

            {/* Suggestion chips */}
            <div className="flex w-full max-w-md flex-col gap-2">
              <div className="mb-1 flex items-center justify-center gap-2 text-[var(--foreground-secondary)] text-xs">
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>Try an example</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    className="rounded-full border border-[var(--border-hover)] bg-[var(--background-tertiary)] px-4 py-2.5 text-[var(--foreground)] text-sm transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
                    key={index}
                    onClick={() => sendMessage({ text: suggestion })}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <div key={message.id}>
                <ChatMessage message={message} />
                {/* Render approval cards for this message's pending approvals */}
                {message.role === 'assistant' &&
                  message.parts
                    .filter(
                      part =>
                        part.type === 'dynamic-tool' &&
                        part.state === 'approval-requested',
                    )
                    .map(part => {
                      if (
                        part.type !== 'dynamic-tool' ||
                        part.state !== 'approval-requested'
                      ) {
                        return null;
                      }
                      return (
                        <ToolApprovalCard
                          approvalId={part.approval.id}
                          input={part.input}
                          key={part.approval.id}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          toolName={part.toolName}
                        />
                      );
                    })}
              </div>
            ))}

            {(status === 'submitted' || status === 'streaming') && (
              <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                <div className="flex gap-1">
                  <span
                    className="h-2 w-2 rounded-full bg-[var(--accent)]"
                    style={{ animation: 'typing 1s infinite 0s' }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-[var(--accent)]"
                    style={{ animation: 'typing 1s infinite 0.2s' }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-[var(--accent)]"
                    style={{ animation: 'typing 1s infinite 0.4s' }}
                  />
                </div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput
        disabled={
          status === 'submitted' ||
          status === 'streaming' ||
          pendingApprovals.length > 0
        }
        onSend={text => sendMessage({ text })}
        placeholder={
          pendingApprovals.length > 0
            ? 'Please approve or reject the pending action...'
            : 'Ask me to send an email, search, or delete a file...'
        }
      />
    </div>
  );
}
