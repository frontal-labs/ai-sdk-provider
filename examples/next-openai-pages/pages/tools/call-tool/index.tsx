import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isStaticToolUIPart } from 'ai';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: '/api/call-tool' }),
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 p-2">
        {messages.map(message => (
          <div className="flex flex-row gap-2" key={message.id}>
            <strong>{`${message.role}: `}</strong>

            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return <div key={index}>{part.text}</div>;
              }
              if (isStaticToolUIPart(part)) {
                return <div key={index}>{JSON.stringify(part.input)}</div>;
              }
            })}
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
          onChange={e => setInput(e.target.value)}
          placeholder="Send message..."
          value={input}
        />
      </form>
    </div>
  );
}
