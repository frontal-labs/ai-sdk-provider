import type { SendEmailUIToolInvocation } from '@/agent/anthropic/tool-search-agent';

export default function SendEmailView({
  invocation,
}: {
  invocation: SendEmailUIToolInvocation;
}) {
  switch (invocation.state) {
    case 'input-available': {
      return (
        <div className="flex flex-col gap-2 rounded border-violet-400 border-l-4 bg-violet-50 p-3 shadow">
          <div className="flex items-center font-semibold text-violet-700">
            <span className="mr-2 inline-block rounded bg-violet-200 px-2 py-0.5 font-mono text-violet-900 text-xs tracking-wider">
              EMAIL
            </span>
            Sending email...
          </div>
          <div className="pl-5 text-sm text-violet-800">
            <span className="font-semibold">To:</span>{' '}
            <span className="inline-block rounded border border-violet-100 bg-white px-2 py-0.5 font-mono">
              {invocation.input.to}
            </span>
          </div>
          <div className="pl-5 text-sm text-violet-800">
            <span className="font-semibold">Subject:</span>{' '}
            <span className="inline-block rounded border border-violet-100 bg-white px-2 py-0.5">
              {invocation.input.subject}
            </span>
          </div>
        </div>
      );
    }
    case 'output-available': {
      const output = invocation.output;
      return (
        <div className="flex flex-col gap-2 rounded border-violet-400 border-l-4 bg-violet-50 p-3 shadow">
          <div className="flex items-center font-semibold text-violet-700">
            <span className="mr-2 inline-block rounded bg-violet-200 px-2 py-0.5 font-mono text-violet-900 text-xs tracking-wider">
              EMAIL
            </span>
            {output.success ? 'Email sent' : 'Failed to send'}
          </div>
          <div className="pl-5 text-sm text-violet-800">
            <span className="font-semibold">To:</span>{' '}
            <span className="inline-block rounded border border-violet-100 bg-white px-2 py-0.5 font-mono">
              {invocation.input.to}
            </span>
          </div>
          <div className="pl-5 text-sm text-violet-800">
            <span className="font-semibold">Subject:</span>{' '}
            <span className="inline-block rounded border border-violet-100 bg-white px-2 py-0.5">
              {output.subject}
            </span>
          </div>
          <div className="pl-5 text-violet-600 text-xs">{output.message}</div>
        </div>
      );
    }

    case 'output-error':
      return (
        <div className="flex flex-col gap-2 rounded border-red-400 border-l-4 bg-red-50 p-3 shadow">
          <div className="flex items-center font-semibold text-red-700">
            <span className="mr-2 inline-block rounded bg-red-200 px-2 py-0.5 font-mono text-red-900 text-xs tracking-wider">
              EMAIL
            </span>
            Error
          </div>
          <div className="pl-5 text-red-600 text-sm">
            {invocation.errorText}
          </div>
        </div>
      );
  }
}
