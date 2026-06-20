'use client';

import { createOpenAI } from '@ai-sdk/openai';
import { type UIMessage, useChat } from '@ai-sdk/react';
import {
  type ChatTransport,
  convertToModelMessages,
  streamText,
  toUIMessageStream,
} from 'ai';
import ChatInput from '@/components/chat-input';

// Note: this needs a client-side OpenAI API key to work.
// DO NOT USE THIS IN ENVIRONMENTS WHERE THE API KEY IS CONFIDENTIAL.
const openai = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default function Chat() {
  const { error, status, sendMessage, messages, regenerate, stop } = useChat({
    transport: {
      sendMessages: async ({ messages, abortSignal }) => {
        const result = streamText({
          model: openai('gpt-4o'),
          messages: await convertToModelMessages(messages),
          abortSignal,
        });

        return toUIMessageStream({ stream: result.stream });
      },

      reconnectToStream: async ({ chatId }) => {
        throw new Error('Not implemented');
      },
    } satisfies ChatTransport<UIMessage>,
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map(m => (
        <div className="whitespace-pre-wrap" key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.parts.map(part => {
            if (part.type === 'text') {
              return part.text;
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

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
