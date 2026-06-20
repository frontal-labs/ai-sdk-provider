/**
 * Thinking indicator component for the chat container.
 * @param isStreaming - Whether the AI is currently thinking.
 * @returns The thinking indicator component.
 */
export function ThinkingIndicator({ isStreaming }: { isStreaming: boolean }) {
  if (!isStreaming) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
      <div className="flex gap-1">
        <span
          className="h-2 w-2 rounded-full bg-[var(--accent)]"
          style={{ animation: 'typing 1s infinite 0s' }}
        />
        <span
          className="h-2 w-2 rounded-full bg-[var(--accent)]"
          style={{ animation: 'typing 1s infinite 0.2s' }}
        />
        <span
          className="h-2 w-2 rounded-full bg-[var(--accent)]"
          style={{ animation: 'typing 1s infinite 0.4s' }}
        />
      </div>
      <span className="text-sm">AI is thinking...</span>
    </div>
  );
}
