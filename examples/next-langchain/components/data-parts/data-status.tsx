'use client';

export interface DataStatusProps {
  message: string;
  status: 'complete' | 'pending' | string;
}

export function DataStatus({ status, message }: DataStatusProps) {
  const isComplete = status === 'complete';

  return (
    <div
      className={`rounded-lg border p-3 text-sm ${
        isComplete
          ? 'border-green-500/30 bg-green-500/10'
          : 'border-yellow-500/30 bg-yellow-500/10'
      }`}
    >
      <div className="flex items-center gap-2">
        {isComplete ? (
          <svg
            className="h-5 w-5 text-green-400"
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
        ) : (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" />
        )}
        <span
          className={`font-medium ${
            isComplete ? 'text-green-400' : 'text-yellow-400'
          }`}
        >
          {message}
        </span>
      </div>
    </div>
  );
}
