import type { anthropic } from '@ai-sdk/anthropic';
import type { UIToolInvocation } from 'ai';

export default function AnthropicToolSearchView({
  invocation,
}: {
  invocation: UIToolInvocation<
    ReturnType<typeof anthropic.tools.toolSearchBm25_20251119>
  >;
}) {
  switch (invocation.state) {
    case 'input-available': {
      return (
        <div className="flex flex-col gap-2 rounded border-amber-400 border-l-4 bg-amber-50 p-3 shadow">
          <div className="flex items-center font-semibold text-amber-700">
            <span className="mr-2 inline-block rounded bg-amber-200 px-2 py-0.5 font-mono text-amber-900 text-xs tracking-wider">
              TOOL SEARCH
            </span>
            Searching for tools...
          </div>
          <div className="pl-5 text-amber-800 text-sm">
            <span className="font-semibold">Query:</span>{' '}
            <span className="inline-block rounded border border-amber-100 bg-white px-2 py-0.5 font-mono">
              {invocation.input.query}
            </span>
          </div>
          <div className="pl-5 text-amber-600 text-xs italic">
            Discovering relevant tools from the available catalog...
          </div>
        </div>
      );
    }
    case 'output-available': {
      const output = invocation.output;
      return (
        <div className="flex flex-col gap-2 rounded border-amber-400 border-l-4 bg-amber-50 p-3 shadow">
          <div className="flex items-center font-semibold text-amber-700">
            <span className="mr-2 inline-block rounded bg-amber-200 px-2 py-0.5 font-mono text-amber-900 text-xs tracking-wider">
              TOOL SEARCH
            </span>
            Found {output.length} tool{output.length === 1 ? '' : 's'}
          </div>
          <div className="pl-5 text-amber-800 text-sm">
            <span className="font-semibold">Query:</span>{' '}
            <span className="inline-block rounded border border-amber-100 bg-white px-2 py-0.5 font-mono">
              {invocation.input.query}
            </span>
          </div>
          {output.length > 0 && (
            <div className="pl-5 text-amber-900 text-sm">
              <span className="font-semibold">Discovered tools:</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {output.map((tool, index) => (
                  <span
                    className="inline-block rounded border border-amber-200 bg-amber-100 px-2 py-0.5 font-mono text-xs"
                    key={index}
                  >
                    {tool.toolName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  }
}
