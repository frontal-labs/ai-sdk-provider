'use client';

import type { OpenaiResponsesProviderMetadata } from '@ai-sdk/openai';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useRef } from 'react';
import type {
  PreviousResponseIdRequestBody,
  PreviousResponseIdUIMessage,
} from '@/app/api/chat/openai-previous-response-id/route';
import { Response } from '@/components/ai-elements/response';
import ChatInput from '@/components/chat-input';
import { ReasoningView } from '@/components/reasoning-view';

export default function OpenPreviousResponseIdPage() {
  // Keep the last provider metadata so we can supply previousResponseId on the next request.
  const providerMetadataRef = useRef<
    OpenaiResponsesProviderMetadata | undefined
  >(undefined);

  const { error, status, sendMessage, messages, regenerate } =
    useChat<PreviousResponseIdUIMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/openai-previous-response-id',
        prepareSendMessagesRequest: ({ messages }) => {
          // Send the newest message plus the previous provider metadata.
          const body: PreviousResponseIdRequestBody = {
            message: messages[messages.length - 1],
            previousProviderMetadata: providerMetadataRef.current,
          };
          return {
            body,
          };
        },
      }),
      onData: ({ data, type }) => {
        switch (type) {
          case 'data-providerMetadata': {
            // Store the latest responseId for the next round trip.
            providerMetadataRef.current = data;
            break;
          }
        }
      },
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">OpenAI previous Response ID</h1>

      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text': {
                return <Response key={index}>{part.text}</Response>;
              }
              case 'reasoning': {
                return <ReasoningView key={index} part={part} />;
              }
              case 'tool-rollDieToolWithProgrammaticCalling': {
                return (
                  <div className="flex gap-2 p-1" key={index}>
                    <div>{part.input?.player}</div>
                    {part.output && <div>roll:{part.output.roll}</div>}
                  </div>
                );
              }
            }
          })}
        </div>
      ))}

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
