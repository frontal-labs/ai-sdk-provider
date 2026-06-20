import type { openai } from '@ai-sdk/openai';
import type { UIToolInvocation } from 'ai';

export default function FileSearchView({
  invocation,
}: {
  invocation: UIToolInvocation<ReturnType<typeof openai.tools.fileSearch>>;
}) {
  switch (invocation.state) {
    case 'input-available':
      return (
        <div className="mb-2 rounded-xl border border-gray-600 bg-gray-900 shadow-lg">
          Searching...
        </div>
      );
    case 'output-available':
      return (
        <div className="mb-2 rounded-xl border border-gray-600 bg-gray-900 p-4 shadow-lg">
          <div className="mb-2">
            <span className="font-semibold text-gray-300">Queries:</span>
            <ul className="mt-1 list-inside list-disc text-gray-100 text-sm">
              {invocation.output.queries.map((query, index) => (
                <li key={index}>- {query}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-semibold text-gray-300">Results:</span>
            <div className="mt-1 text-gray-100 text-sm">
              {invocation.output.results?.map((result, index) => (
                <div className="mb-2 rounded bg-gray-800 p-2" key={index}>
                  <pre className="whitespace-pre-wrap text-xs">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
  }
}
