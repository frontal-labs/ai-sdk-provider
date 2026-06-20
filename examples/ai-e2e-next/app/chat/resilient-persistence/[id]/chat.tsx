'use client';

import { type UIMessage, useChat } from '@ai-sdk/react';
import { createIdGenerator, DefaultChatTransport } from 'ai';
import ChatInput from '@/components/chat-input';

export default function Chat({
  id,
  initialMessages,
}: {
  id?: string | undefined;
  initialMessages?: UIMessage[];
} = {}) {
  const { sendMessage, status, messages, stop } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat/resilient-persistence',
    }),
    generateId: createIdGenerator({ prefix: 'msgc', size: 16 }), // id format for client-side messages
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map(m => (
        <div className="whitespace-pre-wrap" key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.parts
            .map(part => (part.type === 'text' ? part.text : ''))
            .join('')}
        </div>
      ))}

      <ChatInput
        onSubmit={text => sendMessage({ text })}
        status={status}
        stop={stop}
      />
    </div>
  );
}
