'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat({
    onError: err => toast.error(err.message),
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.length > 0
        ? messages.map(m => (
            <div className="whitespace-pre-wrap" key={m.id}>
              {m.role === 'user' ? 'User: ' : 'AI: '}
              {m.parts
                .map(part => (part.type === 'text' ? part.text : ''))
                .join('')}
            </div>
          ))
        : null}

      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
          onChange={e => setInput(e.target.value)}
          placeholder="Say something..."
          value={input}
        />
      </form>
    </div>
  );
}
