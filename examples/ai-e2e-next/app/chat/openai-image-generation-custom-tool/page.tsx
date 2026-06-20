'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { OpenAIImageGenerationCustomToolMessage } from '@/agent/openai/image-generation-custom-tool-agent';
import ChatInput from '@/components/chat-input';
import GenerateImageView from '@/components/tool/generate-image-view';

export default function TestOpenAIWebSearch() {
  const { status, sendMessage, messages } =
    useChat<OpenAIImageGenerationCustomToolMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/openai-image-generation-custom-tool',
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
                return <GenerateImageView invocation={part} key={index} />;
            }
          })}
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
