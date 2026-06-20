'use client';

import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from 'ai';
import type { WeatherPiHarnessAgentMessage } from '@/agent/harness/pi/weather-agent';
import { Response } from '@/components/ai-elements/response';
import { useChatId } from '@/components/chat-id-provider';
import ChatInput from '@/components/chat-input';
import DynamicToolView from '@/components/tool/dynamic-tool-view';
import HarnessBashToolView from '@/components/tool/harness-bash-tool-view';
import HarnessFileToolView from '@/components/tool/harness-file-tool-view';
import HarnessToolView from '@/components/tool/harness-tool-view';
import WeatherView from '@/components/tool/weather-tool-view';

export default function WeatherPiHarnessChat({
  apiRoute,
  exampleLabel,
}: {
  apiRoute: string;
  exampleLabel: string;
}) {
  const { chatId, resetChatId } = useChatId();
  const {
    error,
    status,
    sendMessage,
    messages,
    regenerate,
    addToolApprovalResponse,
  } = useChat<WeatherPiHarnessAgentMessage>({
    id: chatId,
    transport: new DefaultChatTransport({
      api: apiRoute,
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-5xl flex-col pt-12 pb-24">
      <h1 className="mb-2 font-bold text-xl">Pi — {exampleLabel}</h1>
      <p className="mb-4 text-gray-500 text-xs">
        chat id: <code>{chatId}</code>
        <button className="ml-2 underline" onClick={resetChatId} type="button">
          new session
        </button>
      </p>

      {messages.map(message => (
        <div className="mb-3" key={message.id}>
          <strong>{message.role === 'user' ? 'You: ' : 'AI: '}</strong>
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text': {
                return (
                  <Response className="mb-2" key={index}>
                    {part.text}
                  </Response>
                );
              }
              case 'reasoning': {
                return (
                  <Response
                    className="mb-2 whitespace-pre-wrap text-gray-500 italic"
                    key={index}
                  >
                    {part.text}
                  </Response>
                );
              }
              case 'file':
              case 'reasoning-file': {
                if (part.mediaType.startsWith('image/')) {
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt="Generated image"
                      className="mb-2"
                      key={index}
                      src={part.url}
                    />
                  );
                }
                return null;
              }
              case 'tool-get_weather': {
                return (
                  <WeatherView
                    addToolApprovalResponse={addToolApprovalResponse}
                    invocation={part}
                    key={index}
                  />
                );
              }
              case 'tool-bash': {
                return <HarnessBashToolView invocation={part} key={index} />;
              }
              case 'tool-read':
              case 'tool-write':
              case 'tool-edit': {
                return <HarnessFileToolView invocation={part} key={index} />;
              }
              case 'tool-glob':
              case 'tool-grep':
              case 'tool-ls': {
                return (
                  <HarnessToolView
                    key={index}
                    output={
                      part.state === 'output-available'
                        ? part.output
                        : undefined
                    }
                    state={part.state}
                    toolArg={
                      typeof part.input === 'object' && part.input != null
                        ? ((part.input as { pattern?: string; path?: string })
                            .pattern ??
                          (part.input as { pattern?: string; path?: string })
                            .path ??
                          '')
                        : ''
                    }
                    toolName={part.type.replace(/^tool-/, '')}
                  />
                );
              }
              case 'dynamic-tool': {
                // Pi already emits Write tool calls, so we don't need to surface these dynamic fileChange events, which effectively show the same thing.
                if (part.toolName === 'fileChange') {
                  return null;
                }
                return <DynamicToolView invocation={part} key={index} />;
              }
            }
          })}
        </div>
      ))}

      {status === 'submitted' && (
        <div
          aria-label="Loading"
          className="mb-3 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700"
        />
      )}

      {error && (
        <div className="mt-4">
          <div className="whitespace-pre-wrap break-words text-red-500">
            {error.message || String(error)}
          </div>
          <button
            className="mt-4 rounded-md border border-blue-500 px-4 py-2 text-blue-500"
            onClick={() => regenerate()}
            type="button"
          >
            Retry
          </button>
        </div>
      )}

      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent"
      />

      <ChatInput
        maxWidth="5xl"
        onSubmit={text => sendMessage({ text })}
        status={status}
      />
    </div>
  );
}
