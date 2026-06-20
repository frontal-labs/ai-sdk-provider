'use client';

import { useChat } from '@ai-sdk/react';
import type { WeatherAgentUIMessage } from '@/agent/weather-agent';
import ChatInput from '@/component/chat-input';
import WeatherView from '@/component/weather-view';

export default function Chat() {
  const { status, sendMessage, messages } = useChat<WeatherAgentUIMessage>();

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

              case 'tool-weather': {
                return <WeatherView invocation={part} />;
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
