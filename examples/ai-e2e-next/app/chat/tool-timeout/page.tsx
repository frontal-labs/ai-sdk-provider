'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import type { ToolTimeoutMessage } from '@/app/api/chat/tool-timeout/route';
import ChatInput from '@/components/chat-input';

function ErrorDetails({
  errorText,
  toolName,
  query,
  timeoutMs,
}: {
  errorText: string;
  toolName: string;
  query: string;
  timeoutMs: number;
}) {
  const [open, setOpen] = useState(false);
  const timestamp = new Date().toISOString();

  return (
    <div className="my-1 flex flex-col overflow-hidden rounded-lg border border-red-200 text-sm">
      <div className="flex items-center justify-between bg-red-50 px-3 py-2.5">
        <div className="flex items-center gap-2 text-red-700">
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Tool execution timed out
        </div>
        <button
          className="flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 font-medium text-red-500 text-xs transition-colors hover:bg-red-200 hover:text-red-700"
          onClick={() => setOpen(!open)}
        >
          <svg
            aria-hidden="true"
            className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {open ? 'hide' : 'logs'}
        </button>
      </div>
      {open && (
        <div className="bg-gray-950 px-3 py-3 font-mono text-gray-300 text-xs leading-relaxed">
          <div className="text-gray-500">{timestamp}</div>
          <div className="mt-1">
            <span className="text-blue-400">tool</span>
            <span className="text-gray-500">.</span>
            <span className="text-yellow-300">{toolName}</span>
            <span className="text-gray-500">(</span>
            <span className="text-green-400">&quot;{query}&quot;</span>
            <span className="text-gray-500">)</span>
          </div>
          <div className="mt-1 text-gray-500">timeout: {timeoutMs}ms</div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-red-400">ERR</span>
            <span className="text-red-300">{errorText}</span>
          </div>
          <div className="mt-1 text-gray-500">
            Tool aborted - error sent to model as context
          </div>
        </div>
      )}
    </div>
  );
}

export default function Chat() {
  const { messages, status, sendMessage } = useChat<ToolTimeoutMessage>({
    transport: new DefaultChatTransport({ api: '/api/chat/tool-timeout' }),
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-8">
      <h1 className="font-semibold text-2xl tracking-tight">
        Tool Timeout Demo
      </h1>
      <p className="text-gray-500 text-sm">
        Tools abort after 1 second. Try &quot;what is the weather in
        tokyo&quot;.
      </p>

      <div className="flex flex-1 flex-col gap-3 pb-20">
        {messages?.map(m => (
          <div
            className={`flex flex-col gap-1 ${
              m.role === 'user' ? 'items-end' : 'items-start'
            }`}
            key={m.id}
          >
            <span className="font-medium text-gray-400 text-xs uppercase">
              {m.role}
            </span>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                m.role === 'user'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {m.parts.map((part, index) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <span className="whitespace-pre-wrap" key={index}>
                        {part.text}
                      </span>
                    );

                  case 'step-start':
                    return index > 0 ? (
                      <hr className="my-2 border-gray-300" key={index} />
                    ) : null;

                  case 'tool-getWeather': {
                    switch (part.state) {
                      case 'input-streaming':
                        return (
                          <div
                            className="my-1 flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-500 text-sm"
                            key={index}
                          >
                            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
                            Getting weather...
                          </div>
                        );
                      case 'input-available':
                        return (
                          <div
                            className="my-1 flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-500 text-sm"
                            key={index}
                          >
                            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
                            Getting weather for {part.input.city}...
                          </div>
                        );
                      case 'output-available':
                        return (
                          <div
                            className="my-1 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-green-700 text-sm"
                            key={index}
                          >
                            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                            Result: {JSON.stringify(part.output)}
                          </div>
                        );
                      case 'output-error':
                        return (
                          <ErrorDetails
                            errorText={part.errorText}
                            key={index}
                            query={part.input?.city ?? 'unknown'}
                            timeoutMs={1000}
                            toolName="getWeather"
                          />
                        );
                    }
                    break;
                  }
                }
              })}
            </div>
          </div>
        ))}
      </div>

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
