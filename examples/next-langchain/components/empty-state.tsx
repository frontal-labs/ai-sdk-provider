'use client';

import { MessageCircle, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onSend: (message: string) => void;
  suggestions?: string[];
}

export function EmptyState({ onSend, suggestions }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600/20 to-yellow-500/20">
        <MessageCircle className="h-8 w-8 text-amber-400" strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 font-medium text-[var(--foreground)] text-lg">
        Start a conversation
      </h3>
      <p className="mb-6 max-w-xs text-[var(--foreground-secondary)] text-sm">
        Send a message to begin chatting with the AI assistant.
      </p>

      {/* Suggestion chips */}
      {suggestions && suggestions.length > 0 && (
        <div className="flex w-full max-w-md flex-col gap-2">
          <div className="mb-1 flex items-center justify-center gap-2 text-[var(--foreground-secondary)] text-xs">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Try an example</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                className="rounded-full border border-[var(--border-hover)] bg-[var(--background-tertiary)] px-4 py-2.5 text-[var(--foreground)] text-sm transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
                key={index}
                onClick={() => onSend(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
