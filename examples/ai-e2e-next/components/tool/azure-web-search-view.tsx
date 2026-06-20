import type { azure } from '@ai-sdk/azure';
import type { UIToolInvocation } from 'ai';

export default function AzureWebSearchView({
  invocation,
}: {
  invocation: UIToolInvocation<ReturnType<typeof azure.tools.webSearch>>;
}) {
  switch (invocation.state) {
    case 'input-available': {
      return (
        <div className="flex flex-col gap-2 rounded border-blue-400 border-l-4 bg-blue-50 p-3 shadow">
          <div className="flex items-center font-semibold text-blue-700">
            <span className="mr-2 inline-block rounded bg-blue-200 px-2 py-0.5 font-mono text-blue-900 text-xs tracking-wider">
              SEARCH
            </span>
            Searching the web...
          </div>
        </div>
      );
    }
    case 'output-available': {
      const output = invocation.output;

      switch (output.action?.type) {
        case 'search':
          return (
            <div className="flex flex-col gap-2 rounded border-blue-400 border-l-4 bg-blue-50 p-3 shadow">
              <div className="flex items-center font-semibold text-blue-700">
                <span className="mr-2 inline-block rounded bg-blue-200 px-2 py-0.5 font-mono text-blue-900 text-xs tracking-wider">
                  SEARCH
                </span>
                Searched the web
              </div>
              <div className="pl-5 text-blue-800 text-sm">
                <span className="font-semibold">Query:</span>{' '}
                <span className="inline-block rounded border border-blue-100 bg-white px-2 py-0.5 font-mono">
                  {output.action.query}
                </span>
              </div>
            </div>
          );
        case 'openPage':
          return (
            <div className="flex flex-col gap-2 rounded border-green-500 border-l-4 bg-green-50 p-3 shadow">
              <div className="flex items-center font-semibold text-green-800">
                <span className="mr-2 inline-block rounded bg-green-200 px-2 py-0.5 font-mono text-green-900 text-xs tracking-wider">
                  OPEN PAGE
                </span>
                Opened a page
              </div>
              {output.action.url && (
                <div className="break-all pl-5 text-green-900 text-sm">
                  <span className="font-semibold">URL:</span>{' '}
                  <a
                    className="underline hover:text-green-700"
                    href={output.action.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {output.action.url}
                  </a>
                </div>
              )}
            </div>
          );
        case 'findInPage':
          return (
            <div className="flex flex-col gap-2 rounded border-yellow-500 border-l-4 bg-yellow-50 p-3 shadow">
              <div className="flex items-center font-semibold text-yellow-800">
                <span className="mr-2 inline-block rounded bg-yellow-200 px-2 py-0.5 font-mono text-xs text-yellow-900 tracking-wider">
                  FIND IN PAGE
                </span>
                Searched for pattern in page
              </div>
              {output.action.url && (
                <div className="break-all pl-5 text-sm text-yellow-900">
                  <span className="font-semibold">URL:</span>{' '}
                  <a
                    className="underline hover:text-yellow-700"
                    href={output.action.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {output.action.url}
                  </a>
                </div>
              )}
              <div className="pl-5 text-sm text-yellow-900">
                <span className="font-semibold">Pattern:</span>{' '}
                <span className="inline-block rounded border border-yellow-100 bg-white px-2 py-0.5 font-mono">
                  {output.action.pattern}
                </span>
              </div>
            </div>
          );
      }
    }
  }
}
