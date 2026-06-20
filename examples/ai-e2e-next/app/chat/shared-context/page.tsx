'use client';

import { useChat } from '@ai-sdk/react';
import { useSharedChatContext } from './chat-context';
import ChatInput from './chat-input';

export default function Chat() {
  const { chat, clearChat } = useSharedChatContext();
  const { messages } = useChat({
    chat,
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <button
        className="mb-4 rounded border border-gray-300 px-3 py-1.5 text-gray-600 text-sm hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={messages.length === 0}
        onClick={clearChat}
      >
        Clear Chat
      </button>

      {messages?.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          <strong>{`${message.role}: `}</strong>
          {message.parts.map((part, index) => {
            if (part.type === 'text') {
              return (
                <div
                  className="max-w-full overflow-x-auto whitespace-pre-wrap break-words"
                  key={index}
                >
                  {part.text}
                </div>
              );
            }
          })}
        </div>
      ))}

      <ChatInput />
    </div>
  );
}
