'use client';

import type { openai } from '@ai-sdk/openai';
import type { UIToolInvocation } from 'ai';
import { parseDiffForVisualization } from '@/lib/apply-diff';

export default function OpenAIApplyPatchView({
  invocation,
}: {
  invocation: UIToolInvocation<ReturnType<typeof openai.tools.applyPatch>>;
}) {
  switch (invocation.state) {
    case 'input-streaming':
    case 'input-available': {
      if (!invocation.input) {
        return;
      }
      const input = invocation.input as {
        callId: string;
        operation: {
          type: 'create_file' | 'update_file' | 'delete_file';
          path: string;
          diff: string;
        };
      };

      const operationType = input.operation.type;
      const operationLabel =
        operationType === 'create_file'
          ? invocation.state === 'input-available'
            ? 'CREATE FILE'
            : 'CREATING FILE'
          : operationType === 'update_file'
            ? invocation.state === 'input-available'
              ? 'UPDATE FILE'
              : 'UPDATING FILE'
            : invocation.state === 'input-available'
              ? 'DELETE FILE'
              : 'DELETING FILE';

      const bgColor =
        operationType === 'create_file'
          ? 'bg-green-50 border-green-400'
          : operationType === 'update_file'
            ? 'bg-blue-50 border-blue-400'
            : 'bg-red-50 border-red-400';

      const textColor =
        operationType === 'create_file'
          ? 'text-green-700'
          : operationType === 'update_file'
            ? 'text-blue-700'
            : 'text-red-700';

      const badgeColor =
        operationType === 'create_file'
          ? 'bg-green-200 text-green-900'
          : operationType === 'update_file'
            ? 'bg-blue-200 text-blue-900'
            : 'bg-red-200 text-red-900';

      // Parse diff for visualization
      const { lines, addedLines, removedLines, contextLines } =
        parseDiffForVisualization(input.operation.diff || '');

      return (
        <div
          className={`flex flex-col gap-3 rounded-lg border-l-4 p-4 shadow-sm ${bgColor}`}
        >
          <div className={`flex items-center font-semibold ${textColor}`}>
            <span
              className={`mr-2 inline-block rounded px-2 py-0.5 font-mono text-xs tracking-wider ${badgeColor}`}
            >
              {operationLabel}
            </span>
            <span className="text-sm">
              {operationType === 'create_file'
                ? 'Creating file'
                : operationType === 'update_file'
                  ? 'Updating file'
                  : 'Deleting file'}
            </span>
          </div>

          <div className="pl-2 text-sm">
            <span className={`font-semibold ${textColor}`}>File name:</span>{' '}
            <span
              className={`inline-block rounded border bg-white px-2 py-0.5 font-mono text-xs ${textColor}`}
            >
              {input.operation.path}
            </span>
          </div>

          {operationType !== 'delete_file' && input.operation.diff && (
            <div className="mt-2 overflow-hidden rounded border border-gray-200 bg-white">
              <div className="max-h-96 overflow-y-auto">
                <div className="font-mono text-xs">
                  {lines.length > 0 ? (
                    <div>
                      {lines.map((lineItem, idx) => {
                        if (lineItem.type === 'removed') {
                          return (
                            <div
                              className="flex items-start border-red-500 border-l-4 bg-red-50"
                              key={`line-${idx}`}
                            >
                              <span className="select-none px-2 py-1 font-semibold text-red-600">
                                -
                              </span>
                              <span className="flex-1 whitespace-pre-wrap break-words px-2 py-1 text-red-800">
                                {lineItem.line || ' '}
                              </span>
                            </div>
                          );
                        }
                        if (lineItem.type === 'added') {
                          return (
                            <div
                              className="flex items-start border-green-500 border-l-4 bg-green-50"
                              key={`line-${idx}`}
                            >
                              <span className="select-none px-2 py-1 font-semibold text-green-600">
                                +
                              </span>
                              <span className="flex-1 whitespace-pre-wrap break-words px-2 py-1 text-green-800">
                                {lineItem.line || ' '}
                              </span>
                            </div>
                          );
                        }
                        return (
                          <div
                            className="flex items-start bg-gray-50"
                            key={`line-${idx}`}
                          >
                            <span className="select-none px-2 py-1 text-gray-400">
                              {' '}
                            </span>
                            <span className="flex-1 whitespace-pre-wrap break-words px-2 py-1 text-gray-700">
                              {lineItem.line || ' '}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-2 text-gray-500 text-sm italic">
                      No diff content to display
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    case 'output-available': {
      const input = invocation.input as {
        callId: string;
        operation: {
          type: 'create_file' | 'update_file' | 'delete_file';
          path: string;
          diff: string;
        };
      };

      const output = invocation.output as {
        status: 'completed' | 'failed';
        output?: string;
      };

      const operationType = input.operation.type;
      const operationLabel =
        operationType === 'create_file'
          ? 'CREATE FILE'
          : operationType === 'update_file'
            ? 'UPDATE FILE'
            : 'DELETE FILE';

      const isSuccess = output.status === 'completed';
      const bgColor = isSuccess
        ? operationType === 'create_file'
          ? 'bg-green-50 border-green-500'
          : operationType === 'update_file'
            ? 'bg-blue-50 border-blue-500'
            : 'bg-red-50 border-red-500'
        : 'bg-red-50 border-red-500';

      const textColor = isSuccess
        ? operationType === 'create_file'
          ? 'text-green-800'
          : operationType === 'update_file'
            ? 'text-blue-800'
            : 'text-red-800'
        : 'text-red-800';

      const badgeColor = isSuccess
        ? operationType === 'create_file'
          ? 'bg-green-200 text-green-900'
          : operationType === 'update_file'
            ? 'bg-blue-200 text-blue-900'
            : 'bg-red-200 text-red-900'
        : 'bg-red-200 text-red-900';

      // Parse diff for visualization
      const { lines, addedLines, removedLines, contextLines } =
        parseDiffForVisualization(input.operation.diff || '');

      return (
        <div
          className={`flex flex-col gap-3 rounded-lg border-l-4 p-4 shadow-sm ${bgColor}`}
        >
          <div className={`flex items-center font-semibold ${textColor}`}>
            <span
              className={`mr-2 inline-block rounded px-2 py-0.5 font-mono text-xs tracking-wider ${badgeColor}`}
            >
              {operationLabel}
            </span>
            <span className="text-sm">
              {isSuccess
                ? operationType === 'create_file'
                  ? 'File created'
                  : operationType === 'update_file'
                    ? 'File updated'
                    : 'File deleted'
                : 'Operation failed'}
            </span>
          </div>

          <div className="pl-2 text-sm">
            <span className={`font-semibold ${textColor}`}>File name:</span>{' '}
            <span
              className={`inline-block rounded border bg-white px-2 py-0.5 font-mono text-xs ${textColor}`}
            >
              {input.operation.path}
            </span>
          </div>

          {operationType !== 'delete_file' &&
            input.operation.diff &&
            lines.length > 0 && (
              <div className="mt-2 overflow-hidden rounded border border-gray-200 bg-white">
                <div className="max-h-96 overflow-y-auto">
                  <div className="font-mono text-xs">
                    {lines.map((lineItem, idx) => {
                      if (lineItem.type === 'removed') {
                        return (
                          <div
                            className="flex items-start border-red-500 border-l-4 bg-red-50"
                            key={`line-${idx}`}
                          >
                            <span className="select-none px-2 py-1 font-semibold text-red-600">
                              -
                            </span>
                            <span className="flex-1 whitespace-pre-wrap break-words px-2 py-1 text-red-800">
                              {lineItem.line || ' '}
                            </span>
                          </div>
                        );
                      }
                      if (lineItem.type === 'added') {
                        return (
                          <div
                            className="flex items-start border-green-500 border-l-4 bg-green-50"
                            key={`line-${idx}`}
                          >
                            <span className="select-none px-2 py-1 font-semibold text-green-600">
                              +
                            </span>
                            <span className="flex-1 whitespace-pre-wrap break-words px-2 py-1 text-green-800">
                              {lineItem.line || ' '}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div
                          className="flex items-start bg-gray-50"
                          key={`line-${idx}`}
                        >
                          <span className="select-none px-2 py-1 text-gray-400">
                            {' '}
                          </span>
                          <span className="flex-1 whitespace-pre-wrap break-words px-2 py-1 text-gray-700">
                            {lineItem.line || ' '}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
        </div>
      );
    }
  }
}
