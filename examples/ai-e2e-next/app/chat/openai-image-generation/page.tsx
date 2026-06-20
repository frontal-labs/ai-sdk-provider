'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { OpenAIImageGenerationMessage } from '@/agent/openai/image-generation-agent';
import ChatInput from '@/components/chat-input';
import ImageGenerationView from '@/components/tool/openai-image-generation-view';

export default function TestOpenAIWebSearch() {
  const { status, sendMessage, messages } =
    useChat<OpenAIImageGenerationMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/openai-image-generation',
      }),
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">OpenAI Image Generation Test</h1>

      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <div key={index}>{part.text}</div>;
              case 'tool-image':
                return <ImageGenerationView invocation={part} key={index} />;
            }
          })}
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
