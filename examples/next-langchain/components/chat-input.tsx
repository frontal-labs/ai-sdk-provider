'use client';

import { Send } from 'lucide-react';
import { type FormEvent, type KeyboardEvent, useState } from 'react';

interface ChatInputProps {
  disabled?: boolean;
  onSend: (message: string) => void;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Send a message...',
}: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      className="relative flex items-center gap-3 rounded-b-xl border-[var(--border)] border-t bg-[var(--background-secondary)] p-4"
      onSubmit={handleSubmit}
    >
      <div className="relative flex-1">
        <textarea
          className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background-tertiary)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground-muted)] transition-all focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          style={{ minHeight: '48px', maxHeight: '200px' }}
          value={input}
        />
      </div>
      <button
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled || !input.trim()}
        type="submit"
      >
        <Send className="h-5 w-5" strokeWidth={2} />
      </button>
    </form>
  );
}
