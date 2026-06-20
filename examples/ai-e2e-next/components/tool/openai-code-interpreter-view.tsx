import type { openai } from '@ai-sdk/openai';
import type { UIToolInvocation } from 'ai';

export default function CodeInterpreterView({
  invocation,
}: {
  invocation: UIToolInvocation<ReturnType<typeof openai.tools.codeInterpreter>>;
}) {
  return (
    <div className="mb-2 rounded-xl border border-gray-600 bg-gray-900 shadow-lg">
      <div className="rounded-t-xl border-gray-700 border-b bg-gray-800 px-6 py-3">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap font-small text-gray-500 text-xxs tracking-wide">
          {invocation.input?.containerId}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <div className="mb-2 font-medium text-blue-400 text-sm">Code:</div>
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-black p-4 text-gray-100 text-sm">
            {invocation.input?.code}
          </pre>
        </div>

        {invocation.state === 'output-available' && (
          <div className="mb-3">
            <div className="mb-2 font-medium text-sm text-yellow-400">
              Output:
            </div>
            <div className="space-y-2">
              {invocation.output.outputs?.map((output, index) => (
                <div className="rounded-lg bg-black p-3" key={index}>
                  {output.type === 'logs' && (
                    <div className="font-mono text-green-300 text-sm">
                      <span className="whitespace-pre-wrap">{output.logs}</span>
                    </div>
                  )}
                  {output.type === 'image' && <img src={output.url} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
