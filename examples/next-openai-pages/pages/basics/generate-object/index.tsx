import { useState } from 'react';

export default function Page() {
  const [generation, setGeneration] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col gap-2 p-2">
      <div
        className="cursor-pointer bg-zinc-100 p-2"
        onClick={async () => {
          setIsLoading(true);

          await fetch('/api/generate-object', {
            method: 'POST',
            body: JSON.stringify({
              prompt: 'Messages during finals week.',
            }),
          }).then(response => {
            response.json().then(json => {
              console.log(json);
              setGeneration(JSON.stringify(json.object, null, 2));
              setIsLoading(false);
            });
          });
        }}
      >
        Generate
      </div>

      {isLoading ? (
        'Loading...'
      ) : (
        <pre
          className="w-full whitespace-pre-wrap text-sm"
          data-testid="generation"
        >
          {generation}
        </pre>
      )}
    </div>
  );
}
