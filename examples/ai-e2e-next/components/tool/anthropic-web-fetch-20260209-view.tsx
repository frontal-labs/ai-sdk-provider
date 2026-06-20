import type { anthropic } from '@ai-sdk/anthropic';
import type { UIToolInvocation } from 'ai';

export default function AnthropicWebFetch20260209View({
  invocation,
}: {
  invocation: UIToolInvocation<
    ReturnType<typeof anthropic.tools.webFetch_20260209>
  >;
}) {
  switch (invocation.state) {
    case 'input-streaming':
    case 'input-available':
      return (
        <div className="flex flex-col gap-2 rounded border-emerald-400 border-l-4 bg-emerald-50 p-3 shadow">
          <div className="flex items-center font-semibold text-emerald-700">
            <span className="mr-2 inline-block rounded bg-emerald-200 px-2 py-0.5 font-mono text-emerald-900 text-xs tracking-wider">
              FETCH
            </span>
            Fetching URL...
          </div>
          <div className="pl-5 text-emerald-800 text-sm">
            <span className="font-semibold">URL:</span>{' '}
            <span className="inline-block break-all rounded border border-emerald-100 bg-white px-2 py-0.5 font-mono">
              {invocation.input?.url}
            </span>
          </div>
        </div>
      );
    case 'output-available':
      return (
        <div className="flex flex-col gap-2 rounded border-emerald-400 border-l-4 bg-emerald-50 p-3 shadow">
          <div className="flex items-center font-semibold text-emerald-700">
            <span className="mr-2 inline-block rounded bg-emerald-200 px-2 py-0.5 font-mono text-emerald-900 text-xs tracking-wider">
              FETCH
            </span>
            Fetched content
          </div>
          <div className="pl-5 text-emerald-800 text-sm">
            <span className="font-semibold">URL:</span>{' '}
            <span className="inline-block break-all rounded border border-emerald-100 bg-white px-2 py-0.5 font-mono">
              {invocation.input.url}
            </span>
          </div>
          <div className="pl-5 text-emerald-900 text-xs">
            <span className="font-semibold">Title:</span>{' '}
            {invocation.output.content.title ?? 'N/A'}
          </div>
          <div className="pl-5 text-emerald-900 text-xs">
            <span className="font-semibold">Type:</span>{' '}
            {invocation.output.content.source.mediaType}
          </div>
        </div>
      );
  }
}
