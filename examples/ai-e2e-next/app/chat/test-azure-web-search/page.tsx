'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { AzureWebSearchMessage } from '@/app/api/chat/azure-web-search/route';
import { Response } from '@/components/ai-elements/response';
import ChatInput from '@/components/chat-input';
import { ReasoningView } from '@/components/reasoning-view';
import SourcesView from '@/components/sources-view';
import AzureWebSearchView from '@/components/tool/azure-web-search-view';

export default function TestOpenAIWebSearch() {
  const { error, status, sendMessage, messages, regenerate } =
    useChat<AzureWebSearchMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/azure-web-search',
      }),
      onError: error => {
        console.error('Chat error:', error);
      },
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">Azure OpenAI Web Search</h1>

      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text': {
                return <Response key={index}>{part.text}</Response>;
              }
              case 'reasoning': {
                return <ReasoningView key={index} part={part} />;
              }
              case 'tool-web_search': {
                return <AzureWebSearchView invocation={part} key={index} />;
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
