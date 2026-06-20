'use client';

import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from 'ai';
import type { OpenAILocalShellMessage } from '@/agent/openai/local-shell-agent';
import ChatInput from '@/components/chat-input';
import LocalShellView from '@/components/tool/openai-local-shell-view';

export default function TestOpenAIWebSearch() {
  const { status, sendMessage, messages, addToolApprovalResponse } =
    useChat<OpenAILocalShellMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/openai-local-shell',
      }),
      sendAutomaticallyWhen:
        lastAssistantMessageIsCompleteWithApprovalResponses,
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-2 font-bold text-xl">OpenAI Local Shell Test</h1>
      <h2 className="mb-4 border-b pb-2">
        Note: This example requires a Vercel OIDC Token to run the Code Shell
        with Vercel Sandbox
      </h2>

      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          <div className="space-y-4">
            {message.parts.map((part, index) => {
              switch (part.type) {
                case 'text':
                  return <div key={index}>{part.text}</div>;
                case 'tool-shell':
                  return (
                    <LocalShellView
                      addToolApprovalResponse={addToolApprovalResponse}
                      invocation={part}
                      key={index}
                    />
                  );
              }
            })}
          </div>
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
