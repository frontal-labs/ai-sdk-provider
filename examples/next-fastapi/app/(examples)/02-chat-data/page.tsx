'use client';

import { useChat } from '@ai-sdk/react';
import { getStaticToolName, isStaticToolUIPart } from 'ai';
import { GeistMono } from 'geist/font/mono';
import { useState } from 'react';
import { Card } from '@/app/components';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 p-4">
        {messages.map(message => (
          <div className="flex flex-row gap-2" key={message.id}>
            <div className="w-24 flex-shrink-0 text-zinc-500">{`${message.role}: `}</div>

            <div className="flex flex-col gap-2">
              {message.parts.map((part, index) => {
                if (part.type === 'text') {
                  return <div key={index}>{part.text}</div>;
                }
                if (isStaticToolUIPart(part)) {
                  return (
                    <div
                      className={`${GeistMono.className} rounded-lg bg-zinc-100 p-3 text-sm text-zinc-500`}
                      key={index}
                    >
                      {`${getStaticToolName(part)}(${JSON.stringify(
                        part.input,
                        null,
                        2,
                      )})`}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>

      {messages.length === 0 && <Card type="chat-data" />}

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
          placeholder="What's the weather in San Francisco?"
          value={input}
        />
      </form>
    </div>
  );
}
