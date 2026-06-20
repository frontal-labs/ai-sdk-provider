'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useMemo } from 'react';
import type { OpenAICompactionMessage } from '@/agent/openai/compaction-agent';
import ChatInput from '@/components/chat-input';

export default function Page() {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat/use-chat-openai-compaction',
      }),
    [],
  );

  const { messages, sendMessage, status } = useChat<OpenAICompactionMessage>({
    transport,
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-2xl flex-col py-24">
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h1 className="font-bold text-lg">OpenAI Compaction Test</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Context is pre-loaded with a large document corpus (~50k tokens) and 5
          conversation turns. Your messages will be appended to this context.
          Compaction should trigger soon - a notification will appear when it
          does.
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Try asking: &quot;Summarize the key algorithms and data structures
          from the documentation&quot;
        </p>
      </div>

      <div className="flex flex-col gap-4 pb-40">
        {messages.map(message => (
          <div className="flex flex-col gap-2" key={message.id}>
            <div className="font-semibold text-sm text-zinc-500">
              {message.role === 'user' ? 'You' : 'Assistant'}
            </div>

            {message.parts.map((part, index) => {
              if (part.type === 'custom' && part.kind === 'openai.compaction') {
                return (
                  <div
                    className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3"
                    key={index}
                  >
                    <span className="text-amber-600 text-lg">⚡</span>
                    <div>
                      <span className="font-semibold text-amber-700 text-sm">
                        Context Compacted
                      </span>
                      <p className="mt-0.5 text-amber-600 text-xs">
                        The server compressed the conversation context to reduce
                        token usage. The encrypted compaction state will be
                        passed forward automatically.
                      </p>
                    </div>
                  </div>
                );
              }

              if (part.type === 'text') {
                return (
                  <div className="whitespace-pre-wrap" key={index}>
                    {part.text}
                  </div>
                );
              }
            })}
          </div>
        ))}

        {status === 'streaming' && (
          <div className="animate-pulse text-sm text-zinc-400">
            Streaming...
          </div>
        )}
      </div>

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
