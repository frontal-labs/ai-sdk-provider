'use client';

import { useCompletion } from '@ai-sdk/react';

export default function Page() {
  const { completion, complete } = useCompletion({
    api: '/api/stream-text',
  });

  return (
    <div className="flex flex-col gap-2 p-2">
      <div
        className="cursor-pointer bg-zinc-100 p-2"
        onClick={async () => {
          await complete('Why is the sky blue?');
        }}
      >
        Generate
      </div>

      <div data-testid="generation">{completion}</div>
    </div>
  );
}
