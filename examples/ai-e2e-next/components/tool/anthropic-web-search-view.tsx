import type { anthropic } from '@ai-sdk/anthropic';
import type { UIToolInvocation } from 'ai';

export default function AnthropicWebSearchView({
  invocation,
}: {
  invocation: UIToolInvocation<
    ReturnType<typeof anthropic.tools.webSearch_20250305>
  >;
}) {
  switch (invocation.state) {
    case 'input-available': {
      return (
        <div className="flex flex-col gap-2 rounded border-indigo-400 border-l-4 bg-indigo-50 p-3 shadow">
          <div className="flex items-center font-semibold text-indigo-700">
            <span className="mr-2 inline-block rounded bg-indigo-200 px-2 py-0.5 font-mono text-indigo-900 text-xs tracking-wider">
              SEARCH
            </span>
            Searching the web...
          </div>
          <div className="pl-5 text-indigo-800 text-sm">
            <span className="font-semibold">Query:</span>{' '}
            <span className="inline-block rounded border border-indigo-100 bg-white px-2 py-0.5 font-mono">
              {invocation.input.query}
            </span>
          </div>
        </div>
      );
    }
    case 'output-available': {
      const output = invocation.output;
      return (
        <div className="flex flex-col gap-2 rounded border-indigo-400 border-l-4 bg-indigo-50 p-3 shadow">
          <div className="flex items-center font-semibold text-indigo-700">
            <span className="mr-2 inline-block rounded bg-indigo-200 px-2 py-0.5 font-mono text-indigo-900 text-xs tracking-wider">
              SEARCH
            </span>
            Searched the web
          </div>
          <div className="pl-5 text-indigo-800 text-sm">
            <span className="font-semibold">Query:</span>{' '}
            <span className="inline-block rounded border border-indigo-100 bg-white px-2 py-0.5 font-mono">
              {invocation.input.query}
            </span>
          </div>
          <div className="whitespace-pre-wrap pl-5 text-indigo-900 text-xs">
            <span className="font-semibold">Result:</span>{' '}
            <span className="break-all font-mono">
              {output.map(result => (
                <div key={result.url}>
                  <a
                    className="underline hover:text-indigo-700"
                    href={result.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {result.title}
                  </a>
                </div>
              ))}
            </span>
          </div>
        </div>
      );
    }
  }
}
