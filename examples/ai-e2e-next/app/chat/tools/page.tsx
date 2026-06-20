'use client';

import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from 'ai';
import type { UseChatToolsMessage } from '@/app/api/chat/tools/route';
import ChatInput from '@/components/chat-input';

export default function Chat() {
  const { messages, sendMessage, addToolOutput, status } =
    useChat<UseChatToolsMessage>({
      transport: new DefaultChatTransport({ api: '/api/chat/tools' }),
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

      // run client-side tools that are automatically executed:
      async onToolCall({ toolCall }) {
        // artificial 2 second delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (toolCall.toolName === 'getLocation') {
          const cities = [
            'New York',
            'Los Angeles',
            'Chicago',
            'San Francisco',
          ];

          addToolOutput({
            tool: 'getLocation',
            toolCallId: toolCall.toolCallId,
            output: cities[Math.floor(Math.random() * cities.length)],
          });
        }
      },
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages?.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          <strong>{`${message.role}: `}</strong>
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <div key={index}>{part.text}</div>;

              case 'step-start':
                return index > 0 ? (
                  <div className="text-gray-500" key={index}>
                    <hr className="my-2 border-gray-300" />
                  </div>
                ) : null;

              case 'tool-askForConfirmation': {
                switch (part.state) {
                  case 'input-available':
                    return (
                      <div className="text-gray-500" key={index}>
                        {part.input.message}
                        <div className="flex gap-2">
                          <button
                            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                            onClick={async () => {
                              addToolOutput({
                                tool: 'askForConfirmation',
                                toolCallId: part.toolCallId,
                                output: 'Yes, confirmed.',
                              });
                            }}
                          >
                            Yes
                          </button>
                          <button
                            className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                            onClick={async () => {
                              addToolOutput({
                                tool: 'askForConfirmation',
                                toolCallId: part.toolCallId,
                                output: 'No, denied',
                              });
                            }}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    );
                  case 'output-available':
                    return (
                      <div className="text-gray-500" key={index}>
                        Location access allowed: {part.output}
                      </div>
                    );
                }
                break;
              }

              case 'tool-getLocation': {
                switch (part.state) {
                  case 'input-available':
                    return (
                      <div className="text-gray-500" key={index}>
                        Getting location...
                      </div>
                    );
                  case 'output-available':
                    return (
                      <div className="text-gray-500" key={index}>
                        Location: {part.output}
                      </div>
                    );
                }
                break;
              }

              case 'tool-getWeatherInformation': {
                switch (part.state) {
                  // example of pre-rendering streaming tool calls:
                  case 'input-streaming':
                    return (
                      <pre key={index}>
                        {JSON.stringify(part.input, null, 2)}
                      </pre>
                    );
                  case 'input-available':
                    return (
                      <div className="text-gray-500" key={index}>
                        Getting weather information for {part.input.city}...
                      </div>
                    );
                  case 'output-available':
                    return (
                      <div className="text-gray-500" key={index}>
                        {part.output.state === 'loading'
                          ? 'Fetching weather information...'
                          : `Weather in ${part.input.city}: ${part.output.weather}`}
                      </div>
                    );
                  case 'output-error':
                    return (
                      <div className="text-red-500" key={index}>
                        Error: {part.errorText}
                      </div>
                    );
                }
              }
            }
          })}
          <br />
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
