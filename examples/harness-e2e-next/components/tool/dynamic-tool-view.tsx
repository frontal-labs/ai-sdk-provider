import type { DynamicToolUIPart } from 'ai';

export default function WeatherWithApprovalView({
  invocation,
}: {
  invocation: DynamicToolUIPart;
}) {
  switch (invocation.state) {
    case 'input-streaming':
    case 'input-available':
      return (
        <div className="text-gray-500">
          <div className="mb-2 rounded-xl border border-gray-900 bg-gray-600 shadow-lg">
            <pre className="overflow-x-auto whitespace-pre-wrap p-4 text-gray-100 text-sm">
              <div className="pb-2 font-semibold">
                Tool call &quot;{invocation.toolName}&quot;
                {invocation.providerExecuted ? ' (provider-executed)' : ''}
              </div>
              {JSON.stringify(invocation.input, null, 2)}
            </pre>
          </div>
        </div>
      );
    case 'output-available': {
      const isPreliminary = invocation.preliminary ?? false;
      return (
        <div className="text-gray-500">
          <div className="mb-2 rounded-xl border border-gray-900 bg-gray-600 shadow-lg">
            <pre className="overflow-x-auto whitespace-pre-wrap p-4 text-gray-100 text-sm">
              <div className="pb-2 font-semibold">
                {isPreliminary ? 'Executing' : 'Executed'} tool &quot;
                {invocation.toolName}&quot;
                {invocation.providerExecuted ? ' (provider-executed)' : ''}
              </div>
              {JSON.stringify(invocation.input, null, 2)}
              <div className="pt-2 pb-2 font-semibold">Output:</div>
              {JSON.stringify(invocation.output, null, 2)}
            </pre>
          </div>
        </div>
      );
    }
    case 'output-denied':
      return (
        <div className="text-red-500">
          Tool {invocation.toolName} with input{' '}
          {JSON.stringify(invocation.input)} execution denied.
        </div>
      );
    case 'output-error':
      return <div className="text-red-500">Error: {invocation.errorText}</div>;
  }
}
