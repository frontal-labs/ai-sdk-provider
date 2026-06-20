import { createAgentUIStreamResponse } from 'ai';
import { deepseekToolsAgent } from '@/agent/deepseek/tools-agent';

export async function POST(request: Request) {
  const body = await request.json();

  return createAgentUIStreamResponse({
    agent: deepseekToolsAgent,
    uiMessages: body.messages,
  });
}
