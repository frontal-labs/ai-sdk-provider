import { createAgentUIStreamResponse } from 'ai';
import { openaiCompactionAgent } from '@/agent/openai/compaction-agent';

export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json();

  return createAgentUIStreamResponse({
    agent: openaiCompactionAgent,
    uiMessages: body.messages,
    abortSignal: req.signal,
  });
}
