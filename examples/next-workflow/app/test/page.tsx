'use client';

import { useChat } from '@ai-sdk/react';
import { WorkflowChatTransport } from '@ai-sdk/workflow';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function TestChat() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const ts = new Date().toISOString().split('T')[1].split('.')[0];
    setLog(prev => [...prev, `[${ts}] ${msg}`]);
  };

  const transport = useMemo(
    () =>
      new WorkflowChatTransport({
        api: '/api/test-chat',
        maxConsecutiveErrors: 5,
        initialStartIndex: -50,
        onChatSendMessage: response => {
          const runId = response.headers.get('x-workflow-run-id');
          addLog(`POST response received, runId=${runId}`);
        },
        onChatEnd: ({ chatId, chunkIndex }) => {
          addLog(`Chat ended: chatId=${chatId}, total chunks=${chunkIndex}`);
        },
      }),
    [],
  );

  const { status, sendMessage, messages } = useChat({
    transport,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (status === 'streaming') {
      addLog('Status: streaming');
    } else if (status === 'submitted') {
      addLog('Status: submitted');
    } else if (status === 'ready') {
      addLog('Status: ready');
    }
  }, [status]);

  return (
    <div className="mx-auto flex h-screen max-w-4xl flex-col">
      <header className="border-b p-4">
        <h1 className="font-semibold text-lg">
          WorkflowChatTransport Test Page
        </h1>
        <p className="text-gray-500 text-sm">
          Tests stream interruption recovery. The POST endpoint sends a partial
          stream (no finish event), forcing the transport to reconnect via GET.
        </p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel */}
        <div className="flex flex-1 flex-col space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="mt-8 text-center text-gray-400">
              Send a message to test stream interruption + reconnection
            </p>
          )}
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
                  if (part.type === 'text') {
                    return (
                      <div className="whitespace-pre-wrap" key={index}>
                        {part.text}
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

        {/* Log panel */}
        <div className="flex w-80 flex-col border-l bg-gray-50">
          <div className="border-b bg-gray-100 p-2 font-mono font-semibold text-xs">
            Transport Log
          </div>
          <div
            className="flex-1 space-y-1 overflow-y-auto p-2 font-mono text-xs"
            id="log-panel"
          >
            {log.map((entry, i) => (
              <div
                className={`${
                  entry.includes('POST response')
                    ? 'text-blue-600'
                    : entry.includes('Chat ended')
                      ? 'text-green-600'
                      : entry.includes('error') || entry.includes('Error')
                        ? 'text-red-600'
                        : 'text-gray-600'
                }`}
                key={i}
              >
                {entry}
              </div>
            ))}
          </div>
        </div>
      </div>

      <form
        className="flex gap-2 border-t p-4"
        onSubmit={e => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem(
            'message',
          ) as HTMLInputElement;
          if (input.value.trim()) {
            addLog(`Sending: "${input.value}"`);
            sendMessage({ text: input.value });
            input.value = '';
          }
        }}
      >
        <input
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={status === 'streaming' || status === 'submitted'}
          name="message"
          placeholder="Type a message to test reconnection..."
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
