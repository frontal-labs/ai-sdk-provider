'use client';

import { useChat } from '@ai-sdk/react';
import {
  type ChatRequestOptions,
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from 'ai';
import { useState } from 'react';
import ChatInput from '@/components/chat-input';
import DynamicToolWithApprovalView from '@/components/tool/dynamic-tool-with-approval-view';

export default function TestToolApprovalOptions() {
  const [systemInstruction, setSystemInstruction] = useState('');

  const requestOptions: ChatRequestOptions = {
    body: { systemInstruction: systemInstruction || undefined },
  };

  const { status, sendMessage, messages, addToolApprovalResponse } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat/tool-approval-options',
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">
        Tool Approval with Options Test
      </h1>

      <label className="mb-4">
        <span className="mb-1 block font-medium text-sm">
          System Instruction (optional):
        </span>
        <input
          className="w-full rounded border border-gray-300 p-2"
          onChange={e => setSystemInstruction(e.target.value)}
          placeholder="e.g. Always respond in French."
          value={systemInstruction}
        />
      </label>

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
                    requestOptions={requestOptions}
                  />
                );
            }
          })}
        </div>
      ))}

      <ChatInput
        onSubmit={text => sendMessage({ text }, requestOptions)}
        status={status}
      />
    </div>
  );
}
