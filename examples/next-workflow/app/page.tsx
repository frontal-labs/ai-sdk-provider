'use client';

import { useChat } from '@ai-sdk/react';
import { WorkflowChatTransport } from '@ai-sdk/workflow';
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai';
import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';

export default function Chat() {
  const transport = useMemo(
    () =>
      new WorkflowChatTransport({
        api: '/api/chat',
        maxConsecutiveErrors: 5,
        initialStartIndex: -50,
      }),
    [],
  );

  const { status, sendMessage, messages, addToolApprovalResponse } = useChat({
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col">
      <header className="border-b p-4">
        <h1 className="font-semibold text-lg">WorkflowAgent Chat</h1>
        <p className="text-gray-500 text-sm">
          A workflow AI agent with weather, calculator, and file tools
        </p>
        <Link
          className="mt-2 inline-block text-blue-600 text-sm hover:underline"
          href="/telemetry"
        >
          Open telemetry e2e harness
        </Link>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map(message => (
          <div
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            key={message.id}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.parts.map((part, index) => {
                const p = part as any;
                if (part.type === 'text') {
                  return (
                    <div className="whitespace-pre-wrap" key={index}>
                      {part.text}
                    </div>
                  );
                }
                if (p.type?.startsWith('tool-') && p.toolCallId) {
                  const toolName = p.type.replace('tool-', '');

                  if (p.state === 'approval-requested' && p.approval?.id) {
                    return (
                      <div
                        className="my-2 rounded border border-amber-200 bg-amber-50 p-3"
                        key={index}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-amber-600 text-lg">
                            &#9888;
                          </span>
                          <span className="font-semibold text-amber-800">
                            Approval Required
                          </span>
                        </div>
                        <p className="mb-1 text-gray-700 text-sm">
                          The assistant wants to use{' '}
                          <code className="rounded bg-amber-100 px-1 font-semibold">
                            {toolName}
                          </code>
                        </p>
                        <pre className="mb-3 overflow-x-auto rounded border bg-white p-2 text-xs">
                          {JSON.stringify(p.input, null, 2)}
                        </pre>
                        <div className="flex gap-2">
                          <button
                            className="rounded-lg bg-green-500 px-4 py-1.5 text-sm text-white transition-colors hover:bg-green-600"
                            onClick={() =>
                              addToolApprovalResponse({
                                id: p.approval.id,
                                approved: true,
                              })
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="rounded-lg bg-red-500 px-4 py-1.5 text-sm text-white transition-colors hover:bg-red-600"
                            onClick={() =>
                              addToolApprovalResponse({
                                id: p.approval.id,
                                approved: false,
                                reason: 'User denied the operation.',
                              })
                            }
                          >
                            Deny
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (p.state === 'approval-responded') {
                    return (
                      <div
                        className={`my-2 rounded border p-2 text-sm ${
                          p.approval?.approved
                            ? 'border-green-200 bg-green-50 text-green-800'
                            : 'border-red-200 bg-red-50 text-red-800'
                        }`}
                        key={index}
                      >
                        <code>{toolName}</code>{' '}
                        {p.approval?.approved
                          ? 'approved — executing...'
                          : 'denied'}
                      </div>
                    );
                  }

                  return (
                    <div
                      className="my-2 rounded border bg-white/50 p-2 text-sm"
                      key={index}
                    >
                      <div className="font-mono text-gray-500 text-xs">
                        {toolName}
                      </div>
                      {p.state === 'output-available' && (
                        <pre className="mt-1 overflow-x-auto text-xs">
                          {JSON.stringify(p.output, null, 2)}
                        </pre>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        className="flex gap-2 border-t p-4"
        onSubmit={e => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem(
            'message',
          ) as HTMLInputElement;
          if (input.value.trim()) {
            sendMessage({ text: input.value });
            input.value = '';
          }
        }}
      >
        <input
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={status === 'streaming' || status === 'submitted'}
          name="message"
          placeholder="Ask about weather, math, or file operations..."
          type="text"
        />
        <button
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          disabled={status === 'streaming' || status === 'submitted'}
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
}
