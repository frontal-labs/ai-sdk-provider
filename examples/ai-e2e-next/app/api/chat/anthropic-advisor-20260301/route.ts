import { createAgentUIStreamResponse } from 'ai';
import { anthropicAdvisor20260301Agent } from '@/agent/anthropic/advisor-20260301-agent';

export async function POST(request: Request) {
  const body = await request.json();

  return createAgentUIStreamResponse({
    agent: anthropicAdvisor20260301Agent,
    uiMessages: body.messages,
  });
}
