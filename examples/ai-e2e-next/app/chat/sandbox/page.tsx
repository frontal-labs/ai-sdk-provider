'use client';

import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from 'ai';
import { useState } from 'react';
import type { SandboxAgentUIMessage } from '@/agent/openai/sandbox-agent';
import SandboxShellView from '@/components/tool/sandbox-shell-view';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, error, sendMessage, addToolApprovalResponse } =
    useChat<SandboxAgentUIMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/sandbox',
      }),
      sendAutomaticallyWhen:
        lastAssistantMessageIsCompleteWithApprovalResponses,
    });
  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <div className="space-y-4">
        {messages.map(m =>
          m.parts.map((p, i) => {
            switch (p.type) {
              case 'text':
                return (
                  <div className="whitespace-pre-wrap" key={i}>
                    <div>
                      <div className="font-bold">{m.role}</div>
                      <p>{p.text}</p>
                    </div>
                  </div>
                );
              case 'tool-shell':
                return (
                  <SandboxShellView
                    addToolApprovalResponse={addToolApprovalResponse}
                    invocation={p}
                    key={i}
                  />
                );
              default:
                return null;
            }
          }),
        )}
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
          onChange={e => setInput(e.currentTarget.value)}
          placeholder="Say something..."
          value={input}
        />
      </form>
    </div>
  );
}
