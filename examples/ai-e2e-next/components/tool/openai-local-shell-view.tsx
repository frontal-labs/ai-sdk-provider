import type { openai } from '@ai-sdk/openai';
import type { ChatAddToolApproveResponseFunction, UIToolInvocation } from 'ai';

export default function LocalShellView({
  invocation,
  addToolApprovalResponse,
}: {
  invocation: UIToolInvocation<ReturnType<typeof openai.tools.localShell>>;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
}) {
  const action = invocation.input?.action;
  const command = action?.command?.join(' ') || '';

  switch (invocation.state) {
    case 'approval-requested':
      return (
        <div className="text-gray-500">
          Can I execute the command <code>{command}</code>?
          <div>
            <button
              className="mr-2 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
              onClick={() =>
                addToolApprovalResponse({
                  id: invocation.approval.id,
                  approved: true,
                })
              }
            >
              Approve
            </button>
            <button
              className="rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
              onClick={() =>
                addToolApprovalResponse({
                  id: invocation.approval.id,
                  approved: false,
                })
              }
            >
              Deny
            </button>
          </div>
        </div>
      );
    case 'approval-responded':
      return (
        <div className="text-gray-500">
          Can I execute the command <code>{command}</code>?
          <div>{invocation.approval.approved ? 'Approved' : 'Denied'}</div>
        </div>
      );

    case 'output-available':
      return (
        <div className="mb-2 rounded-xl border border-gray-600 bg-gray-900 p-2 shadow-lg">
          <div className="rounded-t-xl border-gray-700 border-b bg-gray-800 px-6 py-3">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap font-small text-gray-500 text-xxs tracking-wide">
              Local Shell Execution
            </div>
          </div>

          <div className="p-6">
            <div className="mb-3">
              <div className="mb-2 font-medium text-blue-400 text-sm">
                Command:
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-black p-4 text-gray-100 text-sm">
                {command}
              </pre>
            </div>

            {action?.workingDirectory && (
              <div className="mb-3">
                <div className="mb-2 font-medium text-gray-400 text-sm">
                  Working Directory:
                </div>
                <div className="rounded-lg bg-black p-3 font-mono text-gray-300 text-sm">
                  {action.workingDirectory}
                </div>
              </div>
            )}

            {invocation.state === 'output-available' && (
              <div className="mb-3">
                <div className="mb-2 font-medium text-sm text-yellow-400">
                  Output:
                </div>
                <div className="space-y-2">
                  <div className="rounded-lg bg-black p-3">
                    <div className="font-mono text-green-300 text-sm">
                      <span className="whitespace-pre-wrap">
                        {invocation.output.output}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case 'output-denied':
      return (
        <div className="text-gray-500">
          Execution of <code>{command}</code> was denied.
        </div>
      );
    case 'output-error':
      return <div className="text-red-500">Error: {invocation.errorText}</div>;
  }
}
