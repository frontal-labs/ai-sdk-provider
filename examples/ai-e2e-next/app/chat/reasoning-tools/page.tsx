'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { ReasoningToolsMessage } from '@/app/api/chat/reasoning-tools/route';
import ChatInput from '@/components/chat-input';

export default function Chat() {
  const { messages, sendMessage, addToolOutput, status } =
    useChat<ReasoningToolsMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/reasoning-tools',
      }),
    });

  console.log(structuredClone(messages));

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages?.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          <strong>{`${message.role}: `}</strong>
          {message.parts.map((part, index) => {
            if (part.type === 'text') {
              return (
                <pre
                  className="max-w-full overflow-x-auto whitespace-pre-wrap break-words"
                  key={index}
                >
                  {part.text}
                </pre>
              );
            }

            if (part.type === 'reasoning') {
              return (
                <pre
                  className="mb-4 max-w-full overflow-x-auto whitespace-pre-wrap break-words text-gray-500 italic"
                  key={index}
                >
                  {part.text}
                </pre>
              );
            }

            if (part.type === 'tool-web_search') {
              switch (part.state) {
                // example of pre-rendering streaming tool calls:
                case 'input-streaming':
                  return (
                    <pre key={part.toolCallId}>
                      {JSON.stringify(part, null, 2)}
                    </pre>
                  );
                case 'input-available':
                  return (
                    <div className="text-gray-500" key={part.toolCallId}>
                      Searching the web...
                    </div>
                  );
                case 'output-available':
                  return (
                    <div className="text-gray-500" key={part.toolCallId}>
                      Finished searching the web.
                    </div>
                  );
              }
            }
          })}
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
