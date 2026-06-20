'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { AnthropicMicrosoftMessage } from '@/agent/anthropic/microsoft-agent';
import { Response } from '@/components/ai-elements/response';
import ChatInput from '@/components/chat-input';
import { ReasoningView } from '@/components/reasoning-view';
import SourcesView from '@/components/sources-view';
import AnthropicCodeExecutionView from '@/components/tool/anthropic-code-execution-view';
import AnthropicWebFetchView from '@/components/tool/anthropic-web-fetch-view';
import AnthropicWebSearchView from '@/components/tool/anthropic-web-search-view';

export default function TestAnthropicWebFetch() {
  const { error, status, sendMessage, messages, regenerate } =
    useChat<AnthropicMicrosoftMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/anthropic-microsoft',
      }),
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">Microsoft Foundry Anthropic</h1>
      <h2 className="mb-4 font-bold text-xl">
        web search , web fetch , code execution
      </h2>

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
              case 'tool-web_fetch': {
                return <AnthropicWebFetchView invocation={part} key={index} />;
              }
              case 'tool-web_search': {
                return <AnthropicWebSearchView invocation={part} key={index} />;
              }
              case 'tool-code_execution': {
                return (
                  <AnthropicCodeExecutionView
                    invocation={part}
                    key={index}
                    provider="anthropic-microsoft"
                  />
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
