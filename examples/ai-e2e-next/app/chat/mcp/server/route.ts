import type { NextRequest } from 'next/server';
import { mcpApiHandler } from '@/util/mcp/handler';

// This route (/chat/mcp/server) serves the MCP server; it's called by the /mcp/chat route that's used by useChat to connect to the server and fetch tools:
const requestHandler = (req: NextRequest) => mcpApiHandler(req);

export {
  requestHandler as DELETE,
  requestHandler as GET,
  requestHandler as POST,
};
