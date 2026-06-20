'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { OpenAICodeInterpreterMessage } from '@/agent/openai/code-interpreter-agent';
import ChatInput from '@/components/chat-input';
import CodeInterpreterView from '@/components/tool/openai-code-interpreter-view';
import { ResponsesText } from '@/components/tool/responses-text';

export default function TestOpenAIWebSearch() {
  const { status, sendMessage, messages } =
    useChat<OpenAICodeInterpreterMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/openai-code-interpreter',
      }),
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">OpenAI Code Interpreter Test</h1>

      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <ResponsesText key={index} part={part} />;
              case 'tool-executeCode':
                return <CodeInterpreterView invocation={part} key={index} />;
            }
          })}
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
