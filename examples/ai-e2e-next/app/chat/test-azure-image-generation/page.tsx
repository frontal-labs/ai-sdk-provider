'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { AzureImageGenerationMessage } from '@/agent/azure/image-generation-agent';
import ChatInput from '@/components/chat-input';
import ImageGenerationView from '@/components/tool/openai-image-generation-view';

export default function TestOpenAIImageGeneration() {
  const { status, sendMessage, messages } =
    useChat<AzureImageGenerationMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/azure-image-generation',
      }),
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">
        Azure OpenAI Image Generation Test
      </h1>

      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <div key={index}>{part.text}</div>;
              case 'tool-image_generation':
                return <ImageGenerationView invocation={part} key={index} />;
            }
          })}
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
