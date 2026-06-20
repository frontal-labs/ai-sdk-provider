'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { AnthropicWebFetch20260209Message } from '@/agent/anthropic/web-fetch-20260209-agent';
import { Response } from '@/components/ai-elements/response';
import ChatInput from '@/components/chat-input';
import SourcesView from '@/components/sources-view';
import AnthropicCodeExecution20260120View from '@/components/tool/anthropic-code-execution-20260120-view';
import AnthropicWebFetch20260209View from '@/components/tool/anthropic-web-fetch-20260209-view';
import DynamicToolView from '@/components/tool/dynamic-tool-view';

export default function TestAnthropicWebFetch20260209() {
  const { error, status, sendMessage, messages, regenerate } =
    useChat<AnthropicWebFetch20260209Message>({
      transport: new DefaultChatTransport({
        api: '/api/chat/anthropic-web-fetch-20260209',
      }),
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">Anthropic Web Fetch (20260209)</h1>

      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text': {
                return <Response key={index}>{part.text}</Response>;
              }
              case 'tool-web_fetch': {
                return (
                  <AnthropicWebFetch20260209View
                    invocation={part}
                    key={index}
                  />
                );
              }
              case 'dynamic-tool': {
                if (part.toolName === 'code_execution') {
                  return (
                    <AnthropicCodeExecution20260120View
                      invocation={
                        {
                          ...part,
                          input: {
                            type: 'programmatic-tool-call',
                            code:
                              typeof part.input === 'object' &&
                              part.input !== null &&
                              'code' in part.input
                                ? String(part.input.code)
                                : '',
                          },
                        } as any
                      }
                      key={index}
                    />
                  );
                }
                return <DynamicToolView invocation={part} key={index} />;
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
