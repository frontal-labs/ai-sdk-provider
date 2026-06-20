import type { AnthropicMessageMetadata } from '@ai-sdk/anthropic';
import {
  createAgentUIStreamResponse,
  type UIMessage,
  validateUIMessages,
} from 'ai';
import { anthropicCodeExecutionFileUploadAgent } from '@/agent/anthropic/code-execution-file-upload-agent';

type AnthropicCodeExecutionFileUploadMessage = UIMessage<{
  containerId?: string;
}>;

function removeCodeExecutionToolParts(
  messages: AnthropicCodeExecutionFileUploadMessage[],
) {
  return messages
    .map(message =>
      message.role === 'assistant'
        ? {
            ...message,
            parts: message.parts.filter(
              part => part.type !== 'tool-code_execution',
            ),
          }
        : message,
    )
    .filter(message => message.parts.length > 0);
}

export async function POST(request: Request) {
  const { messages } = await request.json();

  const uiMessages =
    await validateUIMessages<AnthropicCodeExecutionFileUploadMessage>({
      messages,
    });

  const lastAssistantMessage = uiMessages.findLast(
    message => message.role === 'assistant',
  );

  const sanitizedMessages = removeCodeExecutionToolParts(uiMessages);

  return createAgentUIStreamResponse({
    agent: anthropicCodeExecutionFileUploadAgent,
    uiMessages: sanitizedMessages,
    messageMetadata({ part }) {
      if (part.type !== 'finish-step') {
        return;
      }

      const anthropicContainer = (
        part.providerMetadata?.anthropic as unknown as AnthropicMessageMetadata
      )?.container;

      if (anthropicContainer?.id == null) {
        return;
      }

      return {
        containerId: anthropicContainer.id,
      };
    },
    options: {
      containerId: lastAssistantMessage?.metadata?.containerId,
    },
  });
}
