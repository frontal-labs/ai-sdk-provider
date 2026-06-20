'use client';

import { useCompletion } from '@ai-sdk/react';
import { AlertCircle, Send, Sparkles, Square } from 'lucide-react';
import { type FormEvent, type KeyboardEvent, useState } from 'react';

export default function CompletionPage() {
  const { completion, error, isLoading, stop, complete, setCompletion } =
    useCompletion({
      api: '/api/completion',
    });

  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      complete(input);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInput('');
    setCompletion('');
    complete(suggestion);
  };

  const suggestions = [
    'Write a haiku about programming',
    'Explain quantum computing in one sentence',
    'Generate a creative product name for a smart water bottle',
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex-shrink-0 rounded-t-xl border-[var(--border)] border-b p-6">
        <h1 className="mb-2 font-semibold text-2xl text-[var(--foreground)]">
          Text Completion
        </h1>
        <div className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
          Simple streaming completion using <code>useCompletion</code> hook with
          LangChain. Enter a prompt and watch the response stream in real-time.
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mx-6 mt-4 animate-fade-in rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" strokeWidth={2} />
            {error.message}
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {completion || isLoading ? (
          <>
            {/* Completion output */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600/80 to-yellow-500/80 shadow-lg">
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 font-medium text-[var(--foreground-secondary)] text-xs uppercase tracking-wide">
                  Assistant
                </div>
                <div className="whitespace-pre-wrap text-[var(--foreground)] leading-relaxed">
                  {completion || (
                    <span className="text-[var(--foreground-secondary)] italic">
                      Generating...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Loading indicator */}
            {isLoading && (
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
                <span className="text-sm">AI is generating...</span>
                <button
                  className="ml-auto flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-red-400 text-xs transition-all hover:bg-red-500/20"
                  onClick={stop}
                >
                  <Square
                    className="h-3 w-3"
                    fill="currentColor"
                    strokeWidth={2}
                  />
                  Stop
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600/20 to-yellow-500/20">
              <Sparkles className="h-8 w-8 text-amber-400" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 font-medium text-[var(--foreground)] text-lg">
              Start a completion
            </h3>
            <p className="mb-6 max-w-xs text-[var(--foreground-secondary)] text-sm">
              Enter a prompt below to generate a streaming text completion.
            </p>

            {/* Suggestion chips */}
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
                    onClick={() => handleSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        className="relative flex items-center gap-3 rounded-b-xl border-[var(--border)] border-t bg-[var(--background-secondary)] p-4"
        onSubmit={handleSubmit}
      >
        <div className="relative flex-1">
          <textarea
            className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background-tertiary)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground-muted)] transition-all focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a prompt..."
            rows={1}
            style={{ minHeight: '48px', maxHeight: '200px' }}
            value={input}
          />
        </div>
        <button
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading || !input.trim()}
          type="submit"
        >
          <Send className="h-5 w-5" strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}
