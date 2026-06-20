'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isStaticToolUIPart } from 'ai';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat/mcp-zapier' }),
  });

  return (
    <div className="flex h-screen flex-col items-center justify-end gap-4">
      <h1 className="p-4 text-xl">My AI Assistant</h1>

      <div className="mt-auto flex flex-col gap-2 p-4">
        {messages.map(message => (
          <div key={message.id}>
            <strong>{`${message.role}: `}</strong>
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return <span key={index}>{part.text}</span>;
              }
              if (isStaticToolUIPart(part)) {
                return <pre key={index}>{JSON.stringify(part, null, 2)}</pre>;
              }
            })}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 p-4">
        <textarea
          className="h-32 w-96 rounded-md border-2 border-gray-300 p-2"
          onChange={e => setInput(e.target.value)}
          placeholder="Start chatting"
          value={input}
        />
        <button
          className="w-full rounded-md bg-blue-500 p-2 px-4 text-white"
          onClick={() => sendMessage({ text: input })}
          type="button"
        >
          Send
        </button>
      </div>
    </div>
  );
}
