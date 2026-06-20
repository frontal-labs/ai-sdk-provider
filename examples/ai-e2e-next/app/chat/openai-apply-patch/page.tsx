'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { OpenAIApplyPatchMessage } from '@/agent/openai/apply-patch-agent';
import { Response } from '@/components/ai-elements/response';
import ChatInput from '@/components/chat-input';
import { ReasoningView } from '@/components/reasoning-view';
import OpenAIApplyPatchView from '@/components/tool/openai-apply-patch-view';

export default function ChatOpenAIApplyPatch() {
  const { error, status, sendMessage, messages, regenerate } =
    useChat<OpenAIApplyPatchMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/openai-apply-patch',
      }),
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-4xl flex-col py-24">
      <h1 className="mb-4 font-bold text-2xl">OpenAI Apply Patch Tool</h1>
      <p className="mb-6 text-gray-600">
        Create, update, and delete files in a workspace using structured diffs.
      </p>

      <div className="space-y-6">
        {messages.map(message => (
          <div className="whitespace-pre-wrap" key={message.id}>
            <div className="mb-2 font-semibold">
              {message.role === 'user' ? '👤 User' : '🤖 Assistant'}
            </div>
            <div className="space-y-4 pl-4">
              {message.parts.map((part, index) => {
                switch (part.type) {
                  case 'text': {
                    return <Response key={index}>{part.text}</Response>;
                  }
                  case 'reasoning': {
                    return <ReasoningView key={index} part={part} />;
                  }
                  case 'tool-apply_patch': {
                    return (
                      <OpenAIApplyPatchView invocation={part} key={index} />
                    );
                  }
                }
              })}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4">
          <div className="text-red-500">An error occurred.</div>
          <button
            className="mt-4 rounded-md border border-blue-500 px-4 py-2 text-blue-500"
            onClick={() => regenerate()}
            type="button"
          >
            Retry
          </button>
        </div>
      )}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
