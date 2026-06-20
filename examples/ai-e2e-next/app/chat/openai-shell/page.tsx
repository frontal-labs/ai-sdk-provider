'use client';

import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from 'ai';
import type { OpenAIShellMessage } from '@/agent/openai/shell-agent';
import ChatInput from '@/components/chat-input';
import ShellView from '@/components/tool/openai-shell-view';

export default function ChatOpenAIShell() {
  const { status, sendMessage, messages, addToolApprovalResponse } =
    useChat<OpenAIShellMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/openai-shell',
      }),
      sendAutomaticallyWhen:
        lastAssistantMessageIsCompleteWithApprovalResponses,
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-4xl flex-col py-24">
      <h1 className="mb-2 font-bold text-black text-xl">OpenAI Shell Tool</h1>
      <h2 className="mb-4 border-b pb-2 text-black">
        Note: This example requires a Vercel OIDC Token to run commands with
        Vercel Sandbox
      </h2>

      {messages.map(message => (
        <div className="mb-4 whitespace-pre-wrap" key={message.id}>
          <div className="mb-2">
            <div className="mb-1 font-semibold text-black text-sm">
              {message.role === 'user' ? 'User:' : 'Assistant:'}
            </div>
            <div className="space-y-4">
              {message.parts.map((part, index) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <div className="text-black" key={index}>
                        {part.text}
                      </div>
                    );
                  case 'tool-shell':
                    return (
                      <ShellView
                        addToolApprovalResponse={addToolApprovalResponse}
                        invocation={part}
                        key={index}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
