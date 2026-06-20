'use client';

import { Brain, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ReasoningProps {
  state: 'streaming' | 'done';
  text: string;
}

/**
 * Collapsible component for reasoning content
 */
export function Reasoning({ text, state }: ReasoningProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-500/30 bg-gray-500/5">
      <button
        className="flex w-full items-center gap-2 px-3 py-2 text-gray-400 text-sm transition-colors hover:bg-gray-500/10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Brain className="h-4 w-4" />
        <span className="font-medium">
          {state === 'streaming' ? 'Thinking...' : 'Reasoning'}
        </span>
        {state === 'streaming' && (
          <span className="ml-1 flex gap-0.5">
            <span
              className="h-1.5 w-1.5 rounded-full bg-gray-400"
              style={{ animation: 'typing 1s infinite 0s' }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full bg-gray-400"
              style={{ animation: 'typing 1s infinite 0.2s' }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full bg-gray-400"
              style={{ animation: 'typing 1s infinite 0.4s' }}
            />
          </span>
        )}
        <span className="ml-auto">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      </button>
      {isExpanded && (
        <div className="max-h-64 overflow-y-auto whitespace-pre-wrap border-gray-500/20 border-t px-3 py-2 text-gray-300/80 text-sm">
          {text || 'Processing...'}
        </div>
      )}
    </div>
  );
}
