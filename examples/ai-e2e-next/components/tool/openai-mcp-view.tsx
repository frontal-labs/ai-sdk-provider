import type { openai } from '@ai-sdk/openai';
import type { UIToolInvocation } from 'ai';

export default function OpenAIMCPView({
  invocation,
}: {
  invocation: UIToolInvocation<ReturnType<typeof openai.tools.mcp>>;
}) {
  switch (invocation.state) {
    case 'input-streaming':
    case 'input-available': {
      return (
        <div className="mb-4 rounded border-blue-400 border-l-4 bg-blue-50 p-3 shadow">
          <div className="flex items-center font-semibold text-blue-700">
            <span className="mr-2 inline-block rounded bg-blue-200 px-2 py-0.5 font-mono text-blue-900 text-xs tracking-wider">
              MCP
            </span>
            Calling MCP tool...
          </div>
        </div>
      );
    }
    case 'output-available': {
      const output = invocation.output;

      // Handle MCP call output
      if (
        output &&
        typeof output === 'object' &&
        'type' in output &&
        output.type === 'call'
      ) {
        return (
          <div className="mb-4 rounded border-green-400 border-l-4 bg-green-50 p-3 shadow">
            <div className="flex items-center font-semibold text-green-700">
              <span className="mr-2 inline-block rounded bg-green-200 px-2 py-0.5 font-mono text-green-900 text-xs tracking-wider">
                MCP
              </span>
              MCP tool executed
            </div>
            <div className="mt-2 pl-5 text-green-800 text-sm">
              <div className="mb-2">
                <span className="font-semibold">Server:</span>{' '}
                <span className="font-mono">{output.serverLabel}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Tool:</span>{' '}
                <span className="font-mono">{output.name}</span>
              </div>
              {output.arguments && (
                <div className="mb-2">
                  <span className="font-semibold">Arguments:</span>
                  <pre className="mt-1 overflow-auto rounded border border-green-100 bg-white p-2 text-xs">
                    {output.arguments}
                  </pre>
                </div>
              )}
              {output.output !== null && output.output !== undefined && (
                <div className="mb-2">
                  <span className="font-semibold">Output:</span>
                  <pre className="mt-1 overflow-auto rounded border border-green-100 bg-white p-2 text-xs">
                    {typeof output.output === 'string'
                      ? output.output
                      : JSON.stringify(output.output, null, 2)}
                  </pre>
                </div>
              )}
              {output.error && (
                <div className="mb-2 text-red-600">
                  <span className="font-semibold">Error:</span>
                  <pre className="mt-1 overflow-auto rounded border border-red-200 bg-red-50 p-2 text-xs">
                    {typeof output.error === 'string'
                      ? output.error
                      : JSON.stringify(output.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        );
      }

      // Fallback if output structure is unexpected
      return (
        <div className="mb-4 rounded border-gray-400 border-l-4 bg-gray-50 p-3 shadow">
          <div className="flex items-center font-semibold text-gray-700">
            <span className="mr-2 inline-block rounded bg-gray-200 px-2 py-0.5 font-mono text-gray-900 text-xs tracking-wider">
              MCP
            </span>
            MCP tool executed
          </div>
          <div className="mt-2 pl-5">
            <div className="mb-2">
              <span className="mb-1 font-semibold text-gray-600 text-xs">
                Input:
              </span>
              <pre className="overflow-auto rounded border border-gray-200 bg-white p-2 text-xs">
                {JSON.stringify(invocation.input, null, 2)}
              </pre>
            </div>
            <div>
              <span className="mb-1 font-semibold text-gray-600 text-xs">
                Output:
              </span>
              <pre className="overflow-auto rounded border border-gray-200 bg-white p-2 text-xs">
                {JSON.stringify(output, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      );
    }
    case 'output-error': {
      return (
        <div className="mb-4 rounded border-red-400 border-l-4 bg-red-50 p-3 shadow">
          <div className="flex items-center font-semibold text-red-700">
            <span className="mr-2 inline-block rounded bg-red-200 px-2 py-0.5 font-mono text-red-900 text-xs tracking-wider">
              MCP
            </span>
            MCP tool error
          </div>
          <div className="mt-2 pl-5 text-red-600 text-sm">
            {invocation.errorText}
          </div>
        </div>
      );
    }
  }
}
