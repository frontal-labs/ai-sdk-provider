'use client';

import { createOpenAI } from '@ai-sdk/openai';
import { useChat } from '@ai-sdk/react';
import { DirectChatTransport, ToolLoopAgent } from 'ai';
import ChatInput from '@/components/chat-input';

/**
 * WARNING: This example is for testing/demonstration purposes only.
 *
 * DO NOT USE IN PRODUCTION! Exposing your OpenAI API key in client-side code
 * is a security risk. Anyone can view the key in the browser and use it for
 * their own purposes, potentially incurring charges on your account.
 *
 * For production, use DefaultChatTransport with a server-side API route.
 *
 * You might want to use direct calls when there are no API keys, e.g.
 * when calling on-device, in-browser, or local models.
 */
const openai = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const agent = new ToolLoopAgent({
  model: openai('gpt-4o-mini'),
  instructions: 'You are a helpful assistant.',
});

export default function Chat() {
  const { error, status, sendMessage, messages, regenerate, stop } = useChat({
    transport: new DirectChatTransport({ agent }),
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
