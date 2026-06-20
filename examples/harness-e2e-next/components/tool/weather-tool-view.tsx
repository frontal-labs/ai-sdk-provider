import type { ChatAddToolApproveResponseFunction } from 'ai';
import HarnessToolView from '@/components/tool/harness-tool-view';
import type { WeatherUIToolInvocation } from '@/lib/tools/weather-tool';

export default function WeatherView({
  invocation,
  addToolApprovalResponse,
}: {
  invocation: WeatherUIToolInvocation;
  addToolApprovalResponse?: ChatAddToolApproveResponseFunction;
}) {
  if (invocation.state === 'approval-requested') {
    return (
      <div className="mb-2">
        <HarnessToolView
          state={invocation.state}
          toolArg={invocation.input?.city}
          toolName="Weather"
        />
        <div className="ml-4 flex gap-2">
          <button
            className="rounded bg-green-600 px-2 py-1 text-white text-xs"
            onClick={() =>
              addToolApprovalResponse?.({
                id: invocation.approval.id,
                approved: true,
              })
            }
            type="button"
          >
            Approve
          </button>
          <button
            className="rounded bg-red-600 px-2 py-1 text-white text-xs"
            onClick={() =>
              addToolApprovalResponse?.({
                id: invocation.approval.id,
                approved: false,
                reason: 'User denied the weather lookup.',
              })
            }
            type="button"
          >
            Deny
          </button>
        </div>
      </div>
    );
  }

  if (invocation.state === 'approval-responded') {
    return (
      <HarnessToolView
        output={
          invocation.approval.approved
            ? 'Approved. Waiting for tool execution...'
            : `Denied${invocation.approval.reason ? `: ${invocation.approval.reason}` : ''}`
        }
        state={invocation.state}
        toolArg={invocation.input?.city}
        toolName="Weather"
      />
    );
  }

  return (
    <HarnessToolView
      errorText={invocation.errorText}
      output={
        invocation.output?.state === 'loading'
          ? 'Fetching weather information...'
          : `Weather in ${invocation.input?.city}: ${invocation.output?.weather} (temperature: ${invocation.output?.temperature}°)`
      }
      state={invocation.state}
      toolArg={invocation.input?.city}
      toolName="Weather"
    />
  );
}
