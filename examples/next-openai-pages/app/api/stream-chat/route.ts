import { openai } from '@ai-sdk/openai';
import {
  createUIMessageStreamResponse,
  type ModelMessage,
  streamText,
  toUIMessageStream,
} from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: ModelMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-5'),
    instructions: 'You are a helpful assistant.',
    messages,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
