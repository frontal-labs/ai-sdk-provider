'use client';

import { Server } from 'lucide-react';
import { useState } from 'react';

interface LangsmithConfigPanelProps {
  apiKey: string;
  customUrl: string;
  deploymentUrl: string;
  localDevUrl: string;
  setApiKey: (key: string) => void;
  setCustomUrl: (url: string) => void;
}

export function LangsmithConfigPanel({
  deploymentUrl,
  customUrl,
  setCustomUrl,
  apiKey,
  setApiKey,
  localDevUrl,
}: LangsmithConfigPanelProps) {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background-tertiary)] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-light)]">
            <Server className="h-4 w-4 text-[var(--accent)]" strokeWidth={2} />
          </div>
          <div>
            <div className="font-medium text-[var(--foreground)] text-sm">
              Connected to
            </div>
            <code className="text-[var(--accent)] text-xs">
              {deploymentUrl}
            </code>
          </div>
        </div>
        <button
          className="rounded-lg px-3 py-1.5 font-medium text-[var(--foreground-secondary)] text-xs transition-colors hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]"
          onClick={() => setShowConfig(!showConfig)}
        >
          {showConfig ? 'Hide' : 'Configure'}
        </button>
      </div>

      {showConfig && (
        <div className="mt-4 animate-fade-in space-y-3 border-[var(--border)] border-t pt-4">
          <div>
            <label className="mb-1.5 block font-medium text-[var(--foreground-secondary)] text-xs">
              Deployment URL
            </label>
            <input
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 py-2 text-[var(--foreground)] text-sm placeholder-[var(--foreground-muted)] focus:border-[var(--accent)] focus:outline-none"
              onChange={e => setCustomUrl(e.target.value)}
              placeholder={`Default: ${localDevUrl}`}
              type="url"
              value={customUrl}
            />
          </div>
          <div>
            <label className="mb-1.5 block font-medium text-[var(--foreground-secondary)] text-xs">
              API Key
            </label>
            <input
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 py-2 text-[var(--foreground)] text-sm placeholder-[var(--foreground-muted)] focus:border-[var(--accent)] focus:outline-none"
              onChange={e => setApiKey(e.target.value)}
              placeholder="Required for LangSmith deployments"
              type="password"
              value={apiKey}
            />
          </div>
          <p className="text-[var(--foreground-secondary)] text-xs">
            💡 The local server starts automatically with{' '}
            <code className="text-[var(--accent)]">pnpm dev</code>
          </p>
        </div>
      )}
    </div>
  );
}
