'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import ChatInput from '@/components/chat-input';

export default function Chat() {
  const { status, sendMessage, messages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat/image-output' }),
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            if (part.type === 'text') {
              return <div key={index}>{part.text}</div>;
            }
            if (part.type === 'file' && part.mediaType.startsWith('image/')) {
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="Generated image" key={index} src={part.url} />
              );
            }
          })}
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
