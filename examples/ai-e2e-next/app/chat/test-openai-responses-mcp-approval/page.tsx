'use client';

import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from 'ai';
import type { OpenAIResponsesMCPApprovalMessage } from '@/app/api/chat/openai-responses-mcp-approval/route';
import ChatInput from '@/components/chat-input';
import DynamicToolView from '@/components/tool/dynamic-tool-view';
import OpenAIMCPApprovalView from '@/components/tool/openai-mcp-approval-view';

export default function TestOpenAIResponsesMCPApproval() {
  const { status, sendMessage, messages, addToolApprovalResponse } =
    useChat<OpenAIResponsesMCPApprovalMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/openai-responses-mcp-approval',
      }),
      sendAutomaticallyWhen:
        lastAssistantMessageIsCompleteWithApprovalResponses,
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">
        OpenAI Responses MCP Tool Approval Test
      </h1>
      <p className="mb-4 text-gray-600 text-sm">
        Try asking: &quot;Shorten the link https://ai-sdk.dev/&quot;
      </p>

      {messages.map(message => (
        <div className="mb-4 whitespace-pre-wrap" key={message.id}>
          <div className="mb-2 font-semibold">
            {message.role === 'user' ? 'User' : 'AI'}:
          </div>
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return (
                  <div className="mb-2" key={index}>
                    {part.text}
                  </div>
                );
              case 'dynamic-tool':
                // MCP tools from OpenAI are dynamic tools - check if it's an MCP tool
                // by looking at the toolName (starts with 'mcp.')
                if (
                  part.toolName.startsWith('mcp.') ||
                  part.toolName === 'mcp'
                ) {
                  return (
                    <div className="mb-4" key={index}>
                      <OpenAIMCPApprovalView
                        addToolApprovalResponse={addToolApprovalResponse}
                        invocation={part}
                      />
                    </div>
                  );
                }
                return (
                  <div className="mb-4" key={index}>
                    <DynamicToolView invocation={part} />
                  </div>
                );
              case 'step-start':
                return index > 0 ? (
                  <div className="my-2 border-gray-300 border-t" key={index} />
                ) : null;
            }
          })}
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
