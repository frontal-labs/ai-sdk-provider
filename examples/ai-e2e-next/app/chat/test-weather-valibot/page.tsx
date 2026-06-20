'use client';

import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from 'ai';
import type { WeatherValibotAgentUIMessage } from '@/agent/anthropic/weather-valibot-agent';
import ChatInput from '@/components/chat-input';
import WeatherValibotView from '@/components/tool/weather-valibot-view';

export default function TestWeatherValibot() {
  const { status, sendMessage, messages } =
    useChat<WeatherValibotAgentUIMessage>({
      transport: new DefaultChatTransport({ api: '/api/chat/weather-valibot' }),
      sendAutomaticallyWhen:
        lastAssistantMessageIsCompleteWithApprovalResponses,
    });

  console.log(structuredClone(messages));

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h1 className="mb-4 font-bold text-xl">Weather Valibot Test</h1>

      {messages.map(message => (
        <div className="whitespace-pre-wrap" key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <div key={index}>{part.text}</div>;
              case 'tool-weather':
                return <WeatherValibotView invocation={part} key={index} />;
            }
          })}
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
