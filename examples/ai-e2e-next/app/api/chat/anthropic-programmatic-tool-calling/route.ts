import {
  createAgentUIStreamResponse,
  type UIMessage,
  validateUIMessages,
} from 'ai';
import { anthropicProgrammaticToolCallingAgent } from '@/agent/anthropic/programmatic-tool-calling-agent';
export async function POST(request: Request) {
  const { messages } = await request.json();

  console.dir(messages, { depth: Number.POSITIVE_INFINITY });

  const uiMessages = await validateUIMessages<
    UIMessage<{ containerId: string }>
  >({ messages });

  const lastAssistantMessage = uiMessages.findLast(
    message => message.role === 'assistant',
  );

  return createAgentUIStreamResponse({
    agent: anthropicProgrammaticToolCallingAgent,
    uiMessages: messages,
    options: {
      containerId: lastAssistantMessage?.metadata?.containerId,
    },
  });
}
