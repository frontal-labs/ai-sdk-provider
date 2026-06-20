'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { OpenAIResponsesMCPMessage } from '@/app/api/chat/openai-responses-mcp/route';
import ChatInput from '@/components/chat-input';
import DynamicToolView from '@/components/tool/dynamic-tool-view';
import OpenAIMCPView from '@/components/tool/openai-mcp-view';

export default function TestOpenAIResponsesMCP() {
  const { status, sendMessage, messages } = useChat<OpenAIResponsesMCPMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat/openai-responses-mcp',
    }),
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">OpenAI Responses MCP Tool Test</h1>

      {messages.map(message => (
        <div className="mb-4 whitespace-pre-wrap" key={message.id}>
          <div className="mb-2 font-semibold">
            {message.role === 'user' ? 'User' : 'AI'}:
          </div>
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return (
                  <div className="mb-2" key={index}>
                    {part.text}
                  </div>
                );

              case 'dynamic-tool':
                return (
                  <div className="mb-4" key={index}>
                    <DynamicToolView invocation={part} />
                  </div>
                );

              case 'tool-mcp':
                return (
                  <div className="mb-4" key={index}>
                    <OpenAIMCPView invocation={part} />
                  </div>
                );

              case 'step-start':
                return index > 0 ? (
                  <div className="my-2 border-gray-300 border-t" key={index} />
                ) : null;
            }
          })}
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
