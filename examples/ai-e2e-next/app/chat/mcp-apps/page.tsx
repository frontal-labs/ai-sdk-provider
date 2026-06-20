'use client';

import {
  type MCPAppBridgeHandlers,
  type MCPAppMetadata,
  experimental_MCPAppRenderer as MCPAppRenderer,
  type MCPAppRendererProps,
  type MCPAppResource,
  type MCPAppSandboxConfig,
  useChat,
} from '@ai-sdk/react';
import { DefaultChatTransport, isToolUIPart } from 'ai';
import ChatInput from '@/components/chat-input';

const chatTransport = new DefaultChatTransport({ api: '/chat/mcp-apps/chat' });

const mcpAppSandbox = {
  url: '/chat/mcp-apps/sandbox',
  className:
    'block w-full h-80 overflow-hidden rounded-lg border border-blue-200 bg-white',
  style: { border: 0 },
} satisfies MCPAppSandboxConfig;

const mcpAppFallback = (
  <div className="p-3 text-gray-500 text-sm">Loading MCP App...</div>
);

async function fetchJson(url: string, init?: RequestInit) {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function callMCPAppHost(method: string, params: unknown) {
  return fetchJson('/chat/mcp-apps/host', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ method, params }),
  });
}

function loadMCPAppResource(app: MCPAppMetadata): Promise<MCPAppResource> {
  return callMCPAppHost('mcp-apps/read-resource', { uri: app.resourceUri });
}

const mcpAppHandlers: MCPAppBridgeHandlers = {
  callTool: params => callMCPAppHost('tools/call', params),
  readResource: params => callMCPAppHost('resources/read', params),
  openLink: ({ url }) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    return {};
  },
  onError: error => {
    console.error(error);
  },
};

function MCPAppTool({ part }: { part: MCPAppRendererProps['part'] }) {
  return (
    <MCPAppRenderer
      fallback={mcpAppFallback}
      handlers={mcpAppHandlers}
      loadResource={loadMCPAppResource}
      part={part}
      sandbox={mcpAppSandbox}
    />
  );
}

export default function Chat() {
  const { error, status, sendMessage, messages, regenerate, stop } = useChat({
    transport: chatTransport,
  });
  const isBusy = status === 'submitted' || status === 'streaming';

  return (
    <div className="stretch mx-auto flex w-full max-w-2xl flex-col py-24">
      <div className="mb-6">
        <h1 className="font-semibold text-xl">MCP Apps chat</h1>
        <p className="mt-2 text-gray-600 text-sm">
          Ask for the dashboard. The MCP server advertises an app-backed tool;
          this page renders its UI resource in a sandboxed MCP App frame.
        </p>
      </div>

      {messages.map(m => (
        <div className="mb-4" key={m.id}>
          <div className="mb-2 font-semibold">
            {m.role === 'user' ? 'User' : 'Assistant'}
          </div>
          <div className="space-y-2 pl-4">
            {m.parts.map((part, index) => {
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
                return <MCPAppTool key={part.toolCallId} part={part} />;
              }

              return null;
            })}
          </div>
        </div>
      ))}

      {isBusy ? (
        <div className="mt-4 text-gray-500 text-sm">
          {status === 'submitted' ? <div>Loading...</div> : null}
          <button
            className="mt-4 rounded-md border border-blue-500 px-4 py-2 text-blue-500 text-sm hover:bg-blue-50"
            onClick={stop}
            type="button"
          >
            Stop
          </button>
        </div>
      ) : null}

      {error ? (
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
      ) : null}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
