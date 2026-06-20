import { experimental_useObject } from '@ai-sdk/react';
import { z } from 'zod';

export default function Page() {
  const { object, submit } = experimental_useObject({
    api: '/api/stream-object',
    schema: z.object({ content: z.string() }),
  });

  return (
    <div className="flex flex-col gap-2 p-2">
      <div
        className="cursor-pointer bg-zinc-100 p-2"
        onClick={async () => {
          submit('Final exams');
        }}
      >
        Generate
      </div>

      <pre
        className="w-full whitespace-pre-wrap text-sm"
        data-testid="generation"
      >
        {JSON.stringify(object, null, 2)}
      </pre>
    </div>
  );
}
