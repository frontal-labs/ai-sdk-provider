'use client';

import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from 'ai';
import type { VertexStreamingToolCallsMessage } from '@/app/api/chat/vertex-streaming-tool-calls/route';
import ChatInput from '@/components/chat-input';

export default function Chat() {
  const { messages, status, sendMessage, addToolOutput } =
    useChat<VertexStreamingToolCallsMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/vertex-streaming-tool-calls',
      }),

      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

      async onToolCall({ toolCall }) {
        if (toolCall.toolName === 'showWeatherInformation') {
          addToolOutput({
            tool: 'showWeatherInformation',
            toolCallId: toolCall.toolCallId,
            output: 'Weather information displayed to user.',
          });
        }
      },
    });

  let lastRole: string | undefined;

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-lg">
        Vertex AI — Streaming Tool Call Arguments
      </h1>

      {messages?.map(m => {
        const isNewRole = m.role !== lastRole;
        lastRole = m.role;

        return (
          <div className="mb-2 whitespace-pre-wrap" key={m.id}>
            {isNewRole && (
              <strong className="mb-1 block">{`${m.role}: `}</strong>
            )}
            {m.parts.map((part, i) => {
              if (part.type === 'text') {
                return <span key={i}>{part.text}</span>;
              }

              if (part.type === 'tool-showWeatherInformation') {
                if (part.state === 'input-streaming') {
                  return (
                    <div
                      className="my-2 rounded border border-blue-300 bg-blue-50 p-3"
                      key={i}
                    >
                      <div className="mb-1 font-mono text-blue-600 text-xs">
                        streaming tool args…
                      </div>
                      <pre className="text-sm">
                        {JSON.stringify(part.input, null, 2)}
                      </pre>
                    </div>
                  );
                }

                if (part.state === 'input-available') {
                  return (
                    <div
                      className="my-2 rounded border border-yellow-300 bg-yellow-50 p-3"
                      key={i}
                    >
                      <div className="mb-1 text-xs text-yellow-700">
                        tool call complete — awaiting result
                      </div>
                      <pre className="text-sm">
                        {JSON.stringify(part.input, null, 2)}
                      </pre>
                    </div>
                  );
                }

                if (part.state === 'output-available') {
                  return (
                    <div
                      className="my-2 rounded border border-green-300 bg-green-50 p-4"
                      key={i}
                    >
                      <h4 className="mb-1 font-semibold">{part.input.city}</h4>
                      <div className="flex gap-3 text-sm">
                        <span>🌡 {part.input.temperature}°C</span>
                        <span>☁ {part.input.weather}</span>
                      </div>
                      {part.input.description && (
                        <p className="mt-1 text-gray-600 text-sm">
                          {part.input.description}
                        </p>
                      )}
                    </div>
                  );
                }
              }

              return null;
            })}
          </div>
        );
      })}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
