'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import ChatInput from '@/components/chat-input';

export default function Chat() {
  const { error, status, sendMessage, messages, regenerate, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat/reasoning' }),
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-2xl flex-col py-24">
      {messages.map(message => (
        <div
          className="mb-6 flex gap-4 border-gray-100 border-b pb-4 last:border-0"
          key={message.id}
        >
          <div className="min-w-[50px] font-medium">
            {message.role === 'user' ? 'User:' : 'AI:'}
          </div>
          <div className="flex-1">
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return (
                  <pre
                    className="max-w-full overflow-x-auto whitespace-pre-wrap break-words"
                    key={index}
                  >
                    {part.text}
                  </pre>
                );
              }

              if (part.type === 'reasoning') {
                return (
                  <pre
                    className="mb-4 max-w-full overflow-x-auto whitespace-pre-wrap break-words text-gray-500 italic"
                    key={index}
                  >
                    {part.text}
                  </pre>
                );
              }
            })}
          </div>
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
