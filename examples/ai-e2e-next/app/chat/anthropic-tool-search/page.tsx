'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { AnthropicToolSearchAgentMessage } from '@/agent/anthropic/tool-search-agent';
import { Response } from '@/components/ai-elements/response';
import ChatInput from '@/components/chat-input';
import AnthropicToolSearchView from '@/components/tool/anthropic-tool-search-view';
import SendEmailView from '@/components/tool/send-email-view';
import WeatherView from '@/components/tool/weather-view';

export default function ChatAnthropicToolSearch() {
  const { error, status, sendMessage, messages, regenerate } =
    useChat<AnthropicToolSearchAgentMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/anthropic-tool-search',
      }),
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">Anthropic Tool Search</h1>
      <p className="mb-6 text-gray-600 text-sm">
        Ask about weather or send emails. Claude will use the tool search to
        discover and load the appropriate tools dynamically.
      </p>

      {messages.map(message => (
        <div className="mb-4 whitespace-pre-wrap" key={message.id}>
          <div className="mb-1 font-semibold text-gray-500">
            {message.role === 'user' ? 'User' : 'AI'}
          </div>
          <div className="flex flex-col gap-2">
            {message.parts.map((part, index) => {
              switch (part.type) {
                case 'text': {
                  return <Response key={index}>{part.text}</Response>;
                }
                case 'tool-toolSearch': {
                  return (
                    <AnthropicToolSearchView invocation={part} key={index} />
                  );
                }
                case 'tool-weather': {
                  return <WeatherView invocation={part} key={index} />;
                }
                case 'tool-send_email': {
                  return <SendEmailView invocation={part} key={index} />;
                }
              }
            })}
          </div>
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
