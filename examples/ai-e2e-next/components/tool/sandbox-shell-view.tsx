import type { ChatAddToolApproveResponseFunction, UIToolInvocation } from 'ai';
import type { sandboxShellTool } from '@/tool/sandbox-shell-tool';

export default function SandboxShellView({
  invocation,
  addToolApprovalResponse,
}: {
  invocation: UIToolInvocation<ReturnType<typeof sandboxShellTool>>;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
}) {
  const command = invocation.input?.command || '';

  switch (invocation.state) {
    case 'approval-requested':
      return (
        <div className="mb-2 rounded-xl border border-gray-300 bg-white p-2 shadow-lg">
          <div className="rounded-t-xl border-gray-300 border-b bg-gray-100 px-6 py-3">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap font-small text-black text-xxs tracking-wide">
              Shell Command Approval Required
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <div className="mb-2 font-medium text-black text-sm">
                Command to execute:
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-gray-300 bg-gray-100 p-4 text-black text-sm">
                {command}
              </pre>
            </div>

            <div className="flex gap-2">
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
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
        </div>
      );

    case 'approval-responded':
      return (
        <div className="mb-2 rounded-xl border border-gray-300 bg-white p-2 shadow-lg">
          <div className="rounded-t-xl border-gray-300 border-b bg-gray-100 px-6 py-3">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap font-small text-black text-xxs tracking-wide">
              Shell Command Approval
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <div className="mb-2 font-medium text-black text-sm">
                Command:
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-gray-300 bg-gray-100 p-4 text-black text-sm">
                {command}
              </pre>
            </div>

            <div
              className={`font-medium text-sm ${
                invocation.approval.approved ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {invocation.approval.approved ? '✓ Approved' : '✗ Denied'}
            </div>
          </div>
        </div>
      );

    case 'output-available': {
      const output = invocation.output;

      return (
        <div className="mb-2 rounded-xl border border-gray-300 bg-white p-2 shadow-lg">
          <div className="rounded-t-xl border-gray-300 border-b bg-gray-100 px-6 py-3">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap font-small text-black text-xxs tracking-wide">
              Shell Execution Results
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-2">
              <div>
                <div className="mb-2 font-medium text-black text-sm">
                  Command:
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-gray-300 bg-gray-100 p-4 text-black text-sm">
                  {command}
                </pre>
              </div>

              <div className="rounded-lg border border-gray-300 bg-gray-100 p-3">
                <div className="mb-1 text-black text-xs">
                  Exit Code: {output.exitCode}
                </div>
              </div>

              {output.stdout && (
                <div>
                  <div className="mb-2 font-medium text-black text-sm">
                    Output:
                  </div>
                  <div className="rounded-lg border border-gray-300 bg-gray-100 p-3">
                    <div className="whitespace-pre-wrap font-mono text-black text-sm">
                      {output.stdout}
                    </div>
                  </div>
                </div>
              )}

              {output.stderr && (
                <div>
                  <div className="mb-2 font-medium text-black text-sm">
                    Error:
                  </div>
                  <div className="rounded-lg border border-red-300 bg-red-50 p-3">
                    <div className="whitespace-pre-wrap font-mono text-red-600 text-sm">
                      {output.stderr}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    case 'output-denied':
      return (
        <div className="mb-2 rounded-xl border border-gray-300 bg-white p-2 shadow-lg">
          <div className="rounded-t-xl border-gray-300 border-b bg-gray-100 px-6 py-3">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap font-small text-black text-xxs tracking-wide">
              Shell Command Denied
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <div className="mb-2 font-medium text-black text-sm">
                Command:
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-gray-300 bg-gray-100 p-4 text-black text-sm">
                {command}
              </pre>
            </div>

            <div className="font-medium text-red-600 text-sm">
              Execution was denied by user.
            </div>
          </div>
        </div>
      );

    case 'output-error':
      return (
        <div className="mb-2 rounded-xl border border-red-300 bg-red-50 p-2 shadow-lg">
          <div className="p-6">
            <div className="mb-2 font-medium text-red-600 text-sm">Error:</div>
            <div className="text-black text-sm">{invocation.errorText}</div>
          </div>
        </div>
      );
  }
}
