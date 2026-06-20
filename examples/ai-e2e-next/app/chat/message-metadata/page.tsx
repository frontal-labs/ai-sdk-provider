'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import type { ExampleMetadata } from '@/agent/openai/metadata-agent';
import ChatInput from '@/components/chat-input';

type MyMessage = UIMessage<ExampleMetadata>;

export default function Chat() {
  const { error, status, sendMessage, messages, regenerate, stop } =
    useChat<MyMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/message-metadata',
      }),
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.metadata?.createdAt && (
            <div>
              Created at:{' '}
              {new Date(message.metadata.createdAt).toLocaleString()}
            </div>
          )}
          {message.metadata?.duration && (
            <div>Duration: {message.metadata.duration}ms</div>
          )}
          {message.metadata?.model && (
            <div>Model: {message.metadata.model}</div>
          )}
          {message.metadata?.totalTokens && (
            <div>Total tokens: {message.metadata.totalTokens}</div>
          )}
          {message.metadata?.finishReason && (
            <div>Finish reason: {message.metadata.finishReason}</div>
          )}
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

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
