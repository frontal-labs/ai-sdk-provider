'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ChatContainer } from '../../components/chat-container';
import type { CustomDataMessage } from '../types';

const transport = new DefaultChatTransport({
  api: '/api/createAgent',
});

export default function AgentPage() {
  const { messages, sendMessage, status, error } = useChat<CustomDataMessage>({
    transport,
  });

  return (
    <ChatContainer
      description={
        <>
          Uses LangChain&apos;s <code>createAgent</code> with{' '}
          <strong>GPT-5</strong> and multiple tools including image generation,
          weather, Wikipedia search, and date/time. GPT-5&apos;s reasoning
          tokens are displayed in a collapsible panel, showing the model&apos;s
          thought process.
        </>
      }
      error={error}
      messages={messages}
      onSend={text => sendMessage({ text })}
      placeholder="Ask me anything - I can search, check weather, get time, and create images..."
      status={status}
      suggestions={[
        "What's the weather in Tokyo and what time is it there?",
        'Tell me about artificial intelligence',
        'What time is it in New York right now?',
        'Draw a futuristic city skyline',
      ]}
      title="Multi-Tool Agent"
    />
  );
}
