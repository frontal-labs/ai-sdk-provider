'use client';

import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import { useState } from 'react';
import { Card } from '@/app/components';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new TextStreamChatTransport({
      api: '/api/chat?protocol=text',
    }),
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 p-4">
        {messages.map(message => (
          <div className="flex flex-row gap-2" key={message.id}>
            <div className="w-24 flex-shrink-0 text-zinc-500">{`${message.role}: `}</div>
            <div className="flex flex-col gap-2">
              {message.parts
                .map(part => (part.type === 'text' ? part.text : ''))
                .join('')}
            </div>
          </div>
        ))}
      </div>

      {messages.length === 0 && <Card type="chat-text" />}

      <form
        className="fixed bottom-0 flex w-full flex-col border-t"
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="w-full bg-transparent p-4 outline-none"
          disabled={status !== 'ready'}
          onChange={e => setInput(e.target.value)}
          placeholder="Why is the sky blue?"
          value={input}
        />
      </form>
    </div>
  );
}
