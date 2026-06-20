'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useLayoutEffect, useRef } from 'react';
import ChatInput from '@/components/chat-input';

export default function Chat() {
  const renderCount = useRef(0);
  useLayoutEffect(() => {
    console.log(`component rendered #${++renderCount.current}`);
  });

  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat/throttle' }),
    experimental_throttle: 50,
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h4 className="pb-4 font-bold text-gray-900 text-xl md:text-xl">
        useChat throttle example
      </h4>
      {messages.map(m => (
        <div className="whitespace-pre-wrap" key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.parts
            .map(part => (part.type === 'text' ? part.text : ''))
            .join('')}
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
