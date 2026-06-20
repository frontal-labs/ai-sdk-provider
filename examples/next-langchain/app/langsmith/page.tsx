'use client';

import { LangSmithDeploymentTransport } from '@ai-sdk/langchain';
import { useChat } from '@ai-sdk/react';
import { useMemo, useState } from 'react';
import { ChatContainer } from '../../components/chat-container';
import { LangsmithConfigPanel } from '../../components/langsmith-config-panel';
import type { CustomDataMessage } from '../types';

const LOCAL_DEV_URL = 'http://localhost:2024';

export default function LangSmithPage() {
  const [customUrl, setCustomUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  const deploymentUrl = customUrl || LOCAL_DEV_URL;

  const transport = useMemo(
    () =>
      new LangSmithDeploymentTransport({
        url: deploymentUrl,
        apiKey: apiKey || undefined,
      }),
    [deploymentUrl, apiKey],
  );

  const { messages, sendMessage, status, error } = useChat<CustomDataMessage>({
    transport,
  });

  return (
    <ChatContainer
      configPanel={
        <LangsmithConfigPanel
          apiKey={apiKey}
          customUrl={customUrl}
          deploymentUrl={deploymentUrl}
          localDevUrl={LOCAL_DEV_URL}
          setApiKey={setApiKey}
          setCustomUrl={setCustomUrl}
        />
      }
      description={
        <>
          Uses <code>LangSmithDeploymentTransport</code> to communicate directly
          from the browser to a LangGraph deployment, bypassing the Next.js API
          route.
        </>
      }
      error={error}
      messages={messages}
      onSend={text => sendMessage({ text })}
      placeholder="Send a message..."
      status={status}
      suggestions={[
        "What's the weather in Paris?",
        'Calculate 25 * 4 + 10',
        'Tell me a fun fact',
      ]}
      title="LangSmith Deployment"
    />
  );
}
