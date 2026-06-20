'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { SourcesChatMessage } from '@/app/api/chat/sources/route';
import ChatInput from '@/components/chat-input';

export default function Chat() {
  const { error, status, sendMessage, messages, regenerate, stop } =
    useChat<SourcesChatMessage>({
      transport: new DefaultChatTransport({ api: '/api/chat/sources' }),
    });

  console.log(messages);

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            if (part.type === 'text') {
              return <div key={index}>{part.text}</div>;
            }

            if (part.type === 'tool-web_search') {
              if (
                part.state === 'input-available' ||
                part.state === 'input-streaming'
              ) {
                return (
                  <pre
                    className="overflow-auto rounded bg-gray-100 p-2 text-sm"
                    key={index}
                  >
                    {JSON.stringify(part.input, null, 2)}
                  </pre>
                );
              }
              if (part.state === 'output-available') {
                return (
                  <pre
                    className="overflow-auto rounded bg-gray-100 p-2 text-sm"
                    key={index}
                  >
                    {JSON.stringify(part.input, null, 2)}
                    {`\n\nDONE - ${part.output.length} results`}
                  </pre>
                );
              }
            }

            if (part.type === 'source-url') {
              return (
                <span key={index}>
                  [
                  <a
                    className="font-bold text-blue-500 text-sm hover:underline"
                    href={part.url}
                    rel="noopener"
                    target="_blank"
                  >
                    {part.title ?? new URL(part.url).hostname}
                  </a>
                  ]
                </span>
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
