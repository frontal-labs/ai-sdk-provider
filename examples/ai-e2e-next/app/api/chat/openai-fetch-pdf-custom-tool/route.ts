import { createAgentUIStreamResponse } from 'ai';
import { openaiFetchPdfCustomToolAgent } from '@/agent/openai/fetch-pdf-custom-tool-agent';

export async function POST(request: Request) {
  const body = await request.json();

  console.dir(body.messages, { depth: Number.POSITIVE_INFINITY });

  return createAgentUIStreamResponse({
    agent: openaiFetchPdfCustomToolAgent,
    uiMessages: body.messages,
  });
}
