'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { OpenAIToolSearchMessage } from '@/agent/openai/tool-search-agent';
import { Response } from '@/components/ai-elements/response';
import ChatInput from '@/components/chat-input';
import OpenAIToolSearchView from '@/components/tool/openai-tool-search-view';

export default function TestOpenAIToolSearch() {
  const { error, status, sendMessage, messages, regenerate } =
    useChat<OpenAIToolSearchMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/openai-tool-search',
      }),
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">
        OpenAI Tool Search (Multi-turn)
      </h1>
      <p className="mb-4 text-gray-600 text-sm">
        This example demonstrates OpenAI&apos;s tool search feature with
        deferred loading. Ask about weather, files, or email to see how tools
        are dynamically discovered and loaded.
      </p>

      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text': {
                return <Response key={index}>{part.text}</Response>;
              }
              case 'tool-toolSearch': {
                return <OpenAIToolSearchView invocation={part} key={index} />;
              }
              case 'tool-get_weather':
              case 'tool-search_files':
              case 'tool-send_email': {
                return (
                  <div
                    className="mb-2 rounded-xl border border-gray-900 bg-gray-600 shadow-lg"
                    key={index}
                  >
                    <pre className="overflow-x-auto whitespace-pre-wrap p-4 text-gray-100 text-sm">
                      <div className="pb-2 font-semibold">
                        Tool call &quot;{part.type.replace('tool-', '')}&quot;
                        {part.providerExecuted ? ' (provider-executed)' : ''}
                      </div>
                      {JSON.stringify(part.input, null, 2)}
                      {part.state === 'output-available' && (
                        <>
                          <div className="pt-2 pb-2 font-semibold">Output:</div>
                          {JSON.stringify(part.output, null, 2)}
                        </>
                      )}
                    </pre>
                  </div>
                );
              }
            }
          })}
        </div>
      ))}

      {error && (
        <div className="mt-4">
          <div className="text-red-500">An error occurred: {error.message}</div>
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
