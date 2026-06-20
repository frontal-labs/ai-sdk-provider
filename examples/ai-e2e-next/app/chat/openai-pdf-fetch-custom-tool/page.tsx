'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { OpenAIFetchPdfCustomToolMessage } from '@/agent/openai/fetch-pdf-custom-tool-agent';
import ChatInput from '@/components/chat-input';
import FetchPDFView from '@/components/tool/fetch-pdf-view';

export default function TestOpenAIFileGenerationPDF() {
  const { status, sendMessage, messages } =
    useChat<OpenAIFetchPdfCustomToolMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/openai-fetch-pdf-custom-tool',
      }),
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">
        OpenAI Fetch PDF Custom Tool Test
      </h1>

      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <div key={index}>{part.text}</div>;
              case 'tool-fetchPdf':
                return <FetchPDFView invocation={part} key={index} />;
            }
          })}
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
