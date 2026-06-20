'use client';

export interface DataFileStatusProps {
  filename: string;
  operation: string;
  size?: string;
  status: 'started' | 'completed' | string;
}

export function DataFileStatus({
  filename,
  operation,
  status,
  size,
}: DataFileStatusProps) {
  const isCompleted = status === 'completed';

  return (
    <div
      className={`rounded-lg border p-3 text-sm ${
        isCompleted
          ? 'border-purple-500/30 bg-purple-500/10'
          : 'border-gray-500/30 bg-gray-500/10'
      }`}
    >
      <div className="flex items-center gap-2">
        <svg
          className={`h-5 w-5 ${isCompleted ? 'text-purple-400' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
        <div className="flex-1">
          <span className="font-medium text-[var(--foreground)]">
            {operation.charAt(0).toUpperCase() + operation.slice(1)}ing:{' '}
            {filename}
          </span>
          {isCompleted && size && (
            <span className="ml-2 text-purple-400 text-xs">({size})</span>
          )}
        </div>
        {isCompleted && (
          <svg
            className="h-5 w-5 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        )}
      </div>
    </div>
  );
}
