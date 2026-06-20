'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { UseChatToolsMessage } from '@/app/api/chat/test-invalid-tool-call/route';
import ChatInput from '@/components/chat-input';

export default function Chat() {
  const { messages, sendMessage, status } = useChat<UseChatToolsMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat/test-invalid-tool-call',
    }),
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
                        Weather in {part.input.city}: {part.output}
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
