'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { OpenAIFileSearchMessage } from '@/app/api/chat/openai-file-search/route';
import ChatInput from '@/components/chat-input';
import FileSearchView from '@/components/tool/openai-file-search-view';

export default function TestOpenAIFileSearch() {
  const { status, sendMessage, messages } = useChat<OpenAIFileSearchMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat/openai-file-search',
    }),
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">OpenAI File Search Test</h1>

      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <div key={index}>{part.text}</div>;
              case 'tool-file_search':
                return <FileSearchView invocation={part} key={index} />;
            }
          })}
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
