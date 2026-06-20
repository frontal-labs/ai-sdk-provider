import type { openai } from '@ai-sdk/openai';
import type { UIToolInvocation } from 'ai';

export default function OpenAIToolSearchView({
  invocation,
}: {
  invocation: UIToolInvocation<ReturnType<typeof openai.tools.toolSearch>>;
}) {
  switch (invocation.state) {
    case 'input-available': {
      return (
        <div className="flex flex-col gap-2 rounded border-purple-400 border-l-4 bg-purple-50 p-3 shadow">
          <div className="flex items-center font-semibold text-purple-700">
            <span className="mr-2 inline-block rounded bg-purple-200 px-2 py-0.5 font-mono text-purple-900 text-xs tracking-wider">
              TOOL SEARCH
            </span>
            Searching for tools...
          </div>
          <div className="pl-5 text-purple-600 text-xs italic">
            OpenAI is discovering relevant tools from the available catalog...
          </div>
        </div>
      );
    }
    case 'output-available': {
      const output = invocation.output;
      const tools = output.tools ?? [];
      return (
        <div className="flex flex-col gap-2 rounded border-purple-400 border-l-4 bg-purple-50 p-3 shadow">
          <div className="flex items-center font-semibold text-purple-700">
            <span className="mr-2 inline-block rounded bg-purple-200 px-2 py-0.5 font-mono text-purple-900 text-xs tracking-wider">
              TOOL SEARCH
            </span>
            Loaded {tools.length} tool{tools.length === 1 ? '' : 's'}
          </div>
          {tools.length > 0 && (
            <div className="pl-5 text-purple-900 text-sm">
              <span className="font-semibold">Discovered tools:</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {tools.map((tool, index) => (
                  <span
                    className="inline-block rounded border border-purple-200 bg-purple-100 px-2 py-0.5 font-mono text-xs"
                    key={index}
                  >
                    {(tool as { name?: string }).name ?? 'unknown'}
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
