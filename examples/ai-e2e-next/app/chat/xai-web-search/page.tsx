'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { XaiWebSearchMessage } from '@/agent/xai/web-search-agent';
import { Response } from '@/components/ai-elements/response';
import ChatInput from '@/components/chat-input';
import SourcesView from '@/components/sources-view';

export default function ChatXaiWebSearch() {
  const { error, status, sendMessage, messages, regenerate } =
    useChat<XaiWebSearchMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/xai-web-search',
      }),
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">xAI Web Search (Agentic)</h1>

      {messages.map(message => (
        <div className="mb-4 whitespace-pre-wrap" key={message.id}>
          <div className="font-bold">
            {message.role === 'user' ? 'User: ' : 'AI: '}
          </div>
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text': {
                return <Response key={index}>{part.text}</Response>;
              }
              case 'tool-web_search': {
                return (
                  <div className="text-gray-500 text-sm italic" key={index}>
                    [Searching web...]
                  </div>
                );
              }
              case 'tool-x_search': {
                return (
                  <div className="text-gray-500 text-sm italic" key={index}>
                    [Searching X...]
                  </div>
                );
              }
            }
          })}

          <SourcesView
            sources={message.parts.filter(part => part.type === 'source-url')}
          />
        </div>
      ))}

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
