'use client';

import { useState } from 'react';

const COLLAPSED_LINE_COUNT = 6;

export default function CollapsibleOutput({
  content,
  className,
}: {
  content: string;
  className: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const lines = content.split('\n');
  const isCollapsible = lines.length > COLLAPSED_LINE_COUNT;
  const visibleContent =
    isCollapsible && !expanded
      ? lines.slice(0, COLLAPSED_LINE_COUNT).join('\n')
      : content;

  return (
    <div>
      <pre className={className}>{visibleContent}</pre>
      {isCollapsible && (
        <button
          className="mt-2 font-medium text-blue-600 text-xs hover:text-blue-800"
          onClick={() => setExpanded(value => !value)}
          type="button"
        >
          {expanded
            ? 'Show less'
            : `Show ${lines.length - COLLAPSED_LINE_COUNT} more line${
                lines.length - COLLAPSED_LINE_COUNT === 1 ? '' : 's'
              }`}
        </button>
      )}
    </div>
  );
}
