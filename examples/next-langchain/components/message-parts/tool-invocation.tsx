'use client';

interface ToolInvocationProps {
  input?: unknown;
  output?: unknown;
  toolName: string;
}

/**
 * Renders a tool invocation message part
 */
export function ToolInvocation({
  toolName,
  input,
  output,
}: ToolInvocationProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-3 text-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-[var(--accent-light)]">
          🔧
        </span>
        <span className="font-medium text-[var(--foreground)]">{toolName}</span>
      </div>

      {input !== undefined && (
        <div className="mb-1 font-mono text-[var(--foreground-muted)] text-xs">
          <span className="text-[var(--foreground-secondary)]">Input: </span>
          {JSON.stringify(input)}
        </div>
      )}

      {output !== undefined && (
        <div className="break-all font-mono text-[var(--success)] text-xs">
          <span className="text-[var(--foreground-secondary)]">Result: </span>
          {typeof output === 'string' && output.length > 200
            ? `${output.slice(0, 200)}...`
            : JSON.stringify(output)}
        </div>
      )}
    </div>
  );
}
