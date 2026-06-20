'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { AzureOpenAICodeInterpreterMessage } from '@/app/api/chat/azure-code-interpreter-annotation-download/route';
import ChatInput from '@/components/chat-input';
import CodeInterpreterView from '@/components/tool/openai-code-interpreter-view';
import { ResponsesText } from '@/components/tool/responses-text';

export default function TestAzureOpenAICodeInterpreter() {
  const { status, sendMessage, messages } =
    useChat<AzureOpenAICodeInterpreterMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/azure-code-interpreter-annotation-download',
      }),
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">
        Azure OpenAI Code Interpreter Test
      </h1>

      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <ResponsesText key={index} part={part} />;
              case 'tool-code_interpreter':
                return <CodeInterpreterView invocation={part} key={index} />;
            }
          })}
          {message.metadata?.downloadLinks &&
            message.metadata.downloadLinks.length > 0 && (
              <div className="mt-2 space-y-1">
                {message.metadata.downloadLinks.map((link, idx) => (
                  <a
                    className="block text-blue-600 hover:underline"
                    download={link.filename}
                    href={link.url}
                    key={idx}
                  >
                    📥 Download {link.filename}
                  </a>
                ))}
              </div>
            )}
        </div>
      ))}
      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
