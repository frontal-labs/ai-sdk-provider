'use client';

import type { McpProviderMetadata } from '@ai-sdk/mcp';
import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  type DynamicToolUIPart,
  getToolName,
  isToolUIPart,
  type ToolUIPart,
} from 'ai';
import ChatInput from '@/components/chat-input';
export default function Chat() {
  const { error, status, sendMessage, messages, regenerate, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/chat/mcp/chat' }),
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-2xl flex-col py-24">
      {messages.map(m => (
        <div className="mb-4" key={m.id}>
          <div className="mb-2 font-semibold">
            {m.role === 'user' ? '👤 User' : '🤖 Assistant'}
          </div>
          <div className="space-y-2 pl-4">
            {m.parts.map((part, index) => {
              // Handle text parts
              if (part.type === 'text') {
                return (
                  <div className="whitespace-pre-wrap" key={index}>
                    {part.text}
                  </div>
                );
              }

              if (part.type === 'step-start') {
                return index > 0 ? (
                  <div className="my-4" key={index}>
                    <hr className="border-gray-300" />
                  </div>
                ) : null;
              }

              if (isToolUIPart(part)) {
                const toolPart = part as ToolUIPart<any> | DynamicToolUIPart;
                const toolName = getToolName(toolPart);
                const mcpMetadata = toolPart.toolMetadata as
                  | McpProviderMetadata
                  | undefined;
                const mcpTitle = mcpMetadata?.title;
                const mcpClientName = mcpMetadata?.clientName;

                // Display tool title if available, fallback to tool name
                const displayName = mcpTitle || toolPart.title || toolName;

                return (
                  <div
                    className="rounded-lg border border-gray-300 bg-gray-50 p-4"
                    key={index}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xl">🔧</span>
                      <div>
                        <div className="font-semibold text-sm">
                          {displayName}
                        </div>
                        {displayName !== toolName && (
                          <div className="text-gray-500 text-xs">
                            Tool ID: {toolName}
                          </div>
                        )}
                        {mcpClientName && (
                          <div className="text-gray-500 text-xs">
                            MCP server: {mcpClientName}
                          </div>
                        )}
                      </div>
                    </div>

                    {toolPart.state === 'input-streaming' && (
                      <div className="text-gray-600 text-sm">
                        <div className="mb-1">Streaming input...</div>
                        {toolPart.input && (
                          <pre className="overflow-x-auto rounded bg-white p-2 text-xs">
                            {JSON.stringify(toolPart.input, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}

                    {toolPart.state === 'input-available' && (
                      <div className="text-gray-600 text-sm">
                        <div className="mb-1">Input:</div>
                        <pre className="overflow-x-auto rounded bg-white p-2 text-xs">
                          {JSON.stringify(toolPart.input, null, 2)}
                        </pre>
                      </div>
                    )}

                    {toolPart.state === 'output-available' && (
                      <div className="text-sm">
                        <div className="mb-1 text-gray-600">Output:</div>
                        <div className="rounded bg-white p-2 text-xs">
                          {typeof toolPart.output === 'string'
                            ? toolPart.output
                            : JSON.stringify(toolPart.output, null, 2)}
                        </div>
                      </div>
                    )}

                    {toolPart.state === 'output-error' && (
                      <div className="text-red-600 text-sm">
                        Error: {toolPart.errorText}
                      </div>
                    )}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      ))}

      {(status === 'submitted' || status === 'streaming') && (
        <div className="mt-4 text-gray-500 text-sm">
          {status === 'submitted' && <div>Loading...</div>}
          <button
            className="mt-4 rounded-md border border-blue-500 px-4 py-2 text-blue-500 text-sm hover:bg-blue-50"
            onClick={stop}
            type="button"
          >
            Stop
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4">
          <div className="text-red-500 text-sm">An error occurred.</div>
          <button
            className="mt-4 rounded-md border border-blue-500 px-4 py-2 text-blue-500 text-sm hover:bg-blue-50"
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
