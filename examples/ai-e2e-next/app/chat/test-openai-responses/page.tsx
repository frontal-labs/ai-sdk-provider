'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import ChatInput from '@/components/chat-input';

export default function TestOpenAIResponses() {
  const { error, status, sendMessage, messages, regenerate, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat/openai-responses' }),
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">
        OpenAI Responses Block-Based Streaming Test
      </h1>

      {messages.map(m => (
        <div className="mb-4 whitespace-pre-wrap" key={m.id}>
          <div className="mb-1 font-semibold">
            {m.role === 'user' ? 'User:' : 'AI:'}
          </div>
          {m.parts.map((part, index) => {
            if (part.type === 'text') {
              return <div key={index}>{part.text}</div>;
            }
            if (part.type === 'reasoning') {
              return (
                <div
                  className="mt-2 border-blue-300 border-l-2 bg-blue-50 p-2 text-blue-800 text-sm"
                  key={index}
                >
                  <strong>Reasoning:</strong> {part.text}
                </div>
              );
            }
          })}
        </div>
      ))}

      {(status === 'submitted' || status === 'streaming') && (
        <div className="mt-4 text-gray-500">
          {status === 'submitted' && <div>Loading...</div>}
          <button
            className="mt-4 rounded-md border border-blue-500 px-4 py-2 text-blue-500"
            onClick={stop}
            type="button"
          >
            Stop
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4">
          <div className="text-red-500">An error occurred.</div>
          <button
            className="mt-4 rounded-md border border-blue-500 px-4 py-2 text-blue-500"
            onClick={() => regenerate()}
            type="button"
          >
            Retry
          </button>
        </div>
      )}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
