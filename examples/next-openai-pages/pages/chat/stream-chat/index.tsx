import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/stream-chat' }),
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 p-2">
        {messages.map(message => (
          <div className="flex flex-row gap-2" key={message.id}>
            <div className="w-24 text-zinc-500">{`${message.role}: `}</div>
            <div className="w-full">
              {message.parts
                .map(part => (part.type === 'text' ? part.text : ''))
                .join('')}
            </div>
          </div>
        ))}
      </div>

      <form
        className="fixed bottom-0 w-full p-2"
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="w-full bg-zinc-100 p-2"
          disabled={status !== 'ready'}
          onChange={e => setInput(e.target.value)}
          placeholder="Send message..."
          value={input}
        />
      </form>
    </div>
  );
}
