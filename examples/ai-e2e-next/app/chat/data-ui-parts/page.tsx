'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type FinishReason, type UIMessage } from 'ai';
import { useState } from 'react';
import ChatInput from '@/components/chat-input';

type MyMessage = UIMessage<
  never,
  {
    weather: {
      city: string;
      weather: string;
      status: 'loading' | 'success';
    };
  }
>;

export default function Chat() {
  const [lastFinishReason, setLastFinishReason] = useState<
    FinishReason | undefined
  >(undefined);
  const { error, status, sendMessage, messages, regenerate, stop } =
    useChat<MyMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/data-ui-parts',
      }),
      onData: dataPart => {
        console.log('dataPart', JSON.stringify(dataPart, null, 2));
      },
      onFinish: ({ finishReason }) => {
        setLastFinishReason(finishReason);
      },
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}{' '}
          {message.parts
            .filter(part => part.type === 'data-weather')
            .map((part, index) => (
              <span
                key={index}
                style={{
                  border: '2px solid red',
                  padding: '2px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  minWidth: '180px',
                }}
              >
                {part.data.status === 'loading' ? (
                  <>
                    Getting weather for <b>{part.data.city}</b>...
                  </>
                ) : part.data.status === 'success' ? (
                  <>
                    Weather in <b>{part.data.city}</b>:{' '}
                    <b>{part.data.weather}</b>
                  </>
                ) : (
                  <>Unknown weather state</>
                )}
              </span>
            ))}
          {message.parts
            .filter(part => part.type !== 'data-weather')
            .map((part, index) => {
              if (part.type === 'text') {
                return <div key={index}>{part.text}</div>;
              }
            })}
        </div>
      ))}

      {(status === 'submitted' || status === 'streaming') && (
        <div className="mt-4 text-gray-500">
          {status === 'submitted' && <div>Loading...</div>}
          <button
            className="mt-4 rounded-md border border-blue-500 px-4 py-2 text-blue-500"
            onClick={stop}
            type="button"
          >
            Stop
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4">
          <div className="text-red-500">An error occurred.</div>
          <button
            className="mt-4 rounded-md border border-blue-500 px-4 py-2 text-blue-500"
            onClick={() => regenerate()}
            type="button"
          >
            Retry
          </button>
        </div>
      )}

      {messages.length > 0 && (
        <div className="mt-4 text-gray-500">
          Finish reason: {String(lastFinishReason)}
        </div>
      )}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
