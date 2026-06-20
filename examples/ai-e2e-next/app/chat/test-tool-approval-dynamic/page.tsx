'use client';

import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from 'ai';
import type { DynamicWeatherWithApprovalAgentUIMessage } from '@/agent/anthropic/dynamic-weather-with-approval-agent';
import ChatInput from '@/components/chat-input';
import DynamicToolWithApprovalView from '@/components/tool/dynamic-tool-with-approval-view';

export default function TestToolApproval() {
  const { status, sendMessage, messages, addToolApprovalResponse } =
    useChat<DynamicWeatherWithApprovalAgentUIMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/tool-approval-dynamic',
      }),
      sendAutomaticallyWhen:
        lastAssistantMessageIsCompleteWithApprovalResponses,
    });

  console.log(structuredClone(messages));

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">Tool Approval Test</h1>

      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <div key={index}>{part.text}</div>;
              case 'dynamic-tool':
                return (
                  <DynamicToolWithApprovalView
                    addToolApprovalResponse={addToolApprovalResponse}
                    invocation={part}
                    key={index}
                  />
                );
            }
          })}
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
