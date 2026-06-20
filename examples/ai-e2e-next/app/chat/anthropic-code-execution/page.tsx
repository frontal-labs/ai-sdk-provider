'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { AnthropicCodeExecutionMessage } from '@/agent/anthropic/code-execution-agent';
import { Response } from '@/components/ai-elements/response';
import ChatInput from '@/components/chat-input';
import AnthropicCodeExecutionView from '@/components/tool/anthropic-code-execution-view';

export default function TestAnthropicCodeExecution() {
  const { error, status, sendMessage, messages, regenerate } =
    useChat<AnthropicCodeExecutionMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/anthropic-code-execution',
      }),
    });

  console.log(structuredClone(messages));

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">Anthropic Code Execution Test</h1>

      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text': {
                return <Response key={index}>{part.text}</Response>;
              }
              case 'tool-code_execution': {
                return (
                  <AnthropicCodeExecutionView invocation={part} key={index} />
                );
              }
            }
          })}
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
