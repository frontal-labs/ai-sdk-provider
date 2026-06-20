import type { ModelMessage } from 'ai';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ModelMessage[]>([]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 p-2">
        {messages.map((message, index) => (
          <div className="flex flex-row gap-2" key={`${message.role}-${index}`}>
            <div className="w-24 text-zinc-500">{`${message.role}: `}</div>
            <div className="w-full">
              {typeof message.content === 'string'
                ? message.content
                : message.content
                    .filter(part => part.type === 'text')
                    .map((part, partIndex) => (
                      // @ts-expect-error
                      <div key={partIndex}>{part.text}</div>
                    ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 w-full p-2">
        <input
          className="w-full bg-zinc-100 p-2"
          onChange={event => {
            setInput(event.target.value);
          }}
          onKeyDown={async event => {
            if (event.key === 'Enter') {
              setInput('');

              setMessages(currentMessages => [
                ...currentMessages,
                { role: 'user', content: input },
              ]);

              const response = await fetch('/api/generate-chat', {
                method: 'POST',
                body: JSON.stringify({
                  messages: [...messages, { role: 'user', content: input }],
                }),
              });

              const { messages: newMessages } = await response.json();

              setMessages(currentMessages => [
                ...currentMessages,
                ...newMessages,
              ]);
            }
          }}
          placeholder="Send message..."
          value={input}
        />
      </div>
    </div>
  );
}
