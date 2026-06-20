'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { AnthropicProgrammaticToolCallingMessage } from '@/agent/anthropic/programmatic-tool-calling-agent';
import { Response } from '@/components/ai-elements/response';
import ChatInput from '@/components/chat-input';
import AnthropicCodeExecution20260120View from '@/components/tool/anthropic-code-execution-20260120-view';

export default function ChatAnthropicProgrammaticToolCalling() {
  const { error, status, sendMessage, messages, regenerate } =
    useChat<AnthropicProgrammaticToolCallingMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/anthropic-programmatic-tool-calling',
      }),
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">
        Anthropic Programmatic Tool Calling
      </h1>
      <p className="mb-4 text-gray-600 text-sm">
        This example demonstrates programmatic tool calling, where Claude can
        write code that calls tools programmatically within a code execution
        container.
      </p>
      <p className="mb-4 text-gray-500 text-sm">
        Try: &quot;Two players are playing a dice game. Each round both players
        roll a die. The player with the higher roll wins the round. The first
        player to win 3 rounds wins the game.&quot;
      </p>

      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text': {
                return <Response key={index}>{part.text}</Response>;
              }
              case 'tool-code_execution': {
                return (
                  <AnthropicCodeExecution20260120View
                    invocation={part}
                    key={index}
                  />
                );
              }
              case 'tool-rollDie': {
                return (
                  <div className="text-gray-500" key={index}>
                    {part.state === 'output-available'
                      ? `🎲 ${part.input.player} rolled: ${part.output.roll}`
                      : `🎲 ${part.input?.player ?? 'Player'} rolling...`}
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
