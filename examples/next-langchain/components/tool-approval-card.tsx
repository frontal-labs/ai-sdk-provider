'use client';

import type { UIMessage } from 'ai';
import { Check, Shield, X } from 'lucide-react';
import { useState } from 'react';

/**
 * Tool Approval Card Component
 *
 * Note: The AI SDK's addToolApprovalResponse doesn't currently support
 * passing edited input values. The edit functionality would require
 * extending the API to support edited input in the approval response.
 */
export function ToolApprovalCard({
  toolName,
  input,
  approvalId,
  onApprove,
  onReject,
}: {
  toolName: string;
  input: unknown;
  approvalId: string;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
}) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  return (
    <div className="mt-4 space-y-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="flex items-center gap-2 text-amber-400">
        <Shield className="h-5 w-5" />
        <span className="font-medium">Action Requires Approval</span>
      </div>

      <div className="space-y-2">
        <div className="text-[var(--foreground-secondary)] text-sm">
          Tool:{' '}
          <code className="rounded bg-[var(--background-tertiary)] px-2 py-0.5">
            {toolName}
          </code>
        </div>

        <pre className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--background-tertiary)] p-3 text-sm">
          {JSON.stringify(input, null, 2)}
        </pre>
      </div>

      {showRejectInput && (
        <div className="space-y-2">
          <label className="text-[var(--foreground-secondary)] text-sm">
            Rejection reason (optional):
          </label>
          <input
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background-tertiary)] px-3 py-2 text-[var(--foreground)] text-sm"
            onChange={e => setRejectReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            type="text"
            value={rejectReason}
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-500"
          onClick={() => onApprove(approvalId)}
        >
          <Check className="h-4 w-4" />
          Approve
        </button>
        {showRejectInput ? (
          <button
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-500"
            onClick={() => {
              onReject(approvalId, rejectReason || 'User rejected the action');
              setShowRejectInput(false);
            }}
          >
            <X className="h-4 w-4" />
            Confirm Reject
          </button>
        ) : (
          <button
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-500"
            onClick={() => setShowRejectInput(true)}
          >
            <X className="h-4 w-4" />
            Reject
          </button>
        )}
        {showRejectInput && (
          <button
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background-tertiary)] px-4 py-2 text-[var(--foreground)] transition-colors hover:bg-[var(--background-secondary)]"
            onClick={() => setShowRejectInput(false)}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Extract pending approvals from messages
 */
export function getPendingApprovals(messages: UIMessage[]) {
  const approvals: Array<{
    toolName: string;
    toolCallId: string;
    input: unknown;
    approvalId: string;
  }> = [];

  for (const message of messages) {
    if (message.role !== 'assistant') {
      continue;
    }

    for (const part of message.parts) {
      // Check for dynamic-tool parts with approval-requested state
      if (part.type === 'dynamic-tool' && part.state === 'approval-requested') {
        approvals.push({
          toolName: part.toolName,
          toolCallId: part.toolCallId,
          input: part.input,
          approvalId: part.approval.id,
        });
      }
    }
  }

  return approvals;
}
