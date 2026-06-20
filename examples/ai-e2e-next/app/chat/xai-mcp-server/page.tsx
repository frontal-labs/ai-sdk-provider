'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { XaiMcpServerMessage } from '@/agent/xai/mcp-server-agent';
import ChatInput from '@/components/chat-input';

export default function Chat() {
  const { error, status, sendMessage, messages, regenerate, stop } =
    useChat<XaiMcpServerMessage>({
      transport: new DefaultChatTransport({ api: '/api/chat/xai-mcp-server' }),
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">xAI MCP Server Tool (DeepWiki)</h1>

      {messages.map(message => (
        <div className="mb-4 whitespace-pre-wrap" key={message.id}>
          <div className="font-semibold">
            {message.role === 'user' ? 'User:' : 'AI:'}
          </div>
          {message.parts.map((part, index) => {
            if (part.type === 'text') {
              return <div key={index}>{part.text}</div>;
            }

            if (part.type === 'tool-mcp_server') {
              if (part.state === 'input-streaming') {
                return (
                  <pre
                    className="my-2 overflow-auto rounded bg-gray-100 p-2 text-sm"
                    key={index}
                  >
                    <div className="font-semibold text-blue-600">
                      MCP Server Tool (streaming...)
                    </div>
                    {JSON.stringify(part.input, null, 2)}
                  </pre>
                );
              }
              if (part.state === 'input-available') {
                return (
                  <pre
                    className="my-2 overflow-auto rounded bg-yellow-50 p-2 text-sm"
                    key={index}
                  >
                    <div className="font-semibold text-yellow-600">
                      MCP Server Tool (executing...)
                    </div>
                    {JSON.stringify(part.input, null, 2)}
                  </pre>
                );
              }
              if (part.state === 'output-available') {
                return (
                  <pre
                    className="my-2 overflow-auto rounded bg-green-50 p-2 text-sm"
                    key={index}
                  >
                    <div className="font-semibold text-green-600">
                      MCP Server Tool Result
                    </div>
                    <div className="mb-1 text-gray-500 text-xs">Input:</div>
                    {JSON.stringify(part.input, null, 2)}
                    <div className="mt-2 mb-1 text-gray-500 text-xs">
                      Output:
                    </div>
                    {JSON.stringify(part.output, null, 2)}
                  </pre>
                );
              }
              if (part.state === 'output-error') {
                return (
                  <pre
                    className="my-2 overflow-auto rounded bg-red-50 p-2 text-sm"
                    key={index}
                  >
                    <div className="font-semibold text-red-600">
                      MCP Server Tool Error
                    </div>
                    {part.errorText}
                  </pre>
                );
              }
            }

            return null;
          })}
        </div>
      ))}

      {(status === 'submitted' || status === 'streaming') && (
        <div className="mt-4 text-gray-500">
          {status === 'submitted' && <div>Loading...</div>}
          <button
            className="mt-4 rounded-md border border-blue-500 px-4 py-2 text-blue-500"
            onClick={stop}
            type="button"
          >
            Stop
          </button>
        </div>
      )}

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
