import type { anthropic } from '@ai-sdk/anthropic';
import type { UIToolInvocation } from 'ai';

export default function AnthropicAdvisor20260301View({
  invocation,
}: {
  invocation: UIToolInvocation<
    ReturnType<typeof anthropic.tools.advisor_20260301>
  >;
}) {
  switch (invocation.state) {
    case 'input-streaming':
    case 'input-available': {
      return (
        <div className="flex flex-col gap-2 rounded border-violet-400 border-l-4 bg-violet-50 p-3 shadow">
          <div className="flex items-center font-semibold text-violet-700">
            <span className="mr-2 inline-block rounded bg-violet-200 px-2 py-0.5 font-mono text-violet-900 text-xs tracking-wider">
              ADVISOR
            </span>
            Consulting advisor model...
          </div>
          <div className="pl-5 text-violet-600 text-xs italic">
            Executor paused while the advisor sub-inference runs server-side.
          </div>
        </div>
      );
    }
    case 'output-available': {
      const output = invocation.output;

      if (output.type === 'advisor_result') {
        return (
          <div className="flex flex-col gap-2 rounded border-violet-400 border-l-4 bg-violet-50 p-3 shadow">
            <div className="flex items-center font-semibold text-violet-700">
              <span className="mr-2 inline-block rounded bg-violet-200 px-2 py-0.5 font-mono text-violet-900 text-xs tracking-wider">
                ADVISOR
              </span>
              Advice received
            </div>
            <div className="whitespace-pre-wrap pl-5 text-sm text-violet-900">
              {output.text}
            </div>
          </div>
        );
      }

      if (output.type === 'advisor_redacted_result') {
        return (
          <div className="flex flex-col gap-2 rounded border-violet-400 border-l-4 bg-violet-50 p-3 shadow">
            <div className="flex items-center font-semibold text-violet-700">
              <span className="mr-2 inline-block rounded bg-violet-200 px-2 py-0.5 font-mono text-violet-900 text-xs tracking-wider">
                ADVISOR
              </span>
              Encrypted advice received
            </div>
            <div className="pl-5 text-violet-700 text-xs italic">
              Advice is encrypted; round-tripped to the server on the next turn.
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-2 rounded border-red-400 border-l-4 bg-red-50 p-3 shadow">
          <div className="flex items-center font-semibold text-red-700">
            <span className="mr-2 inline-block rounded bg-red-200 px-2 py-0.5 font-mono text-red-900 text-xs tracking-wider">
              ADVISOR
            </span>
            Advisor call failed
          </div>
          <div className="pl-5 text-red-800 text-sm">
            <span className="font-semibold">Error code:</span>{' '}
            <span className="inline-block rounded border border-red-100 bg-white px-2 py-0.5 font-mono">
              {output.errorCode}
            </span>
          </div>
        </div>
      );
    }
  }
}
