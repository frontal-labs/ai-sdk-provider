import { type XaiVideoModelOptions, xai } from '@ai-sdk/xai';
import { experimental_generateVideo as generateVideo } from 'ai';
import { presentVideos } from '../../lib/present-video';
import { run } from '../../lib/run';
import { withSpinner } from '../../lib/spinner';

run(async () => {
  const result = await withSpinner('Generating xAI video...', () =>
    generateVideo({
      model: xai.video('grok-imagine-video'),
      prompt: 'A cat sitting on a windowsill watching rain.',
      duration: 5,
      providerOptions: {
        xai: {
          pollTimeoutMs: 600_000,
        } satisfies XaiVideoModelOptions,
      },
    }),
  );

  await presentVideos(result.videos);

  console.log(
    'Provider metadata:',
    JSON.stringify(result.providerMetadata, null, 2),
  );
});
