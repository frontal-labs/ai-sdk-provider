'use client';

import { zodSchema } from '@ai-sdk/provider-utils';
import { type UIMessage, useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { z } from 'zod';
import ChatInput from '@/components/chat-input';

export default function Chat({
  id,
  initialMessages,
}: {
  id?: string | undefined;
  initialMessages?: UIMessage<{ createdAt: string }>[];
} = {}) {
  const { sendMessage, status, messages } = useChat({
    id, // use the provided chatId
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat/persistence-metadata',
    }),
    messageMetadataSchema: zodSchema(
      z.object({
        createdAt: z.string().datetime(),
      }),
    ),
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map(m => (
        <div className="whitespace-pre-wrap" key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.metadata?.createdAt && (
            <div>
              Created at: {new Date(m.metadata.createdAt).toLocaleString()}
            </div>
          )}
          {m.parts.map((part, index) => {
            if (part.type === 'text') {
              return <div key={index}>{part.text}</div>;
            }
          })}
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
