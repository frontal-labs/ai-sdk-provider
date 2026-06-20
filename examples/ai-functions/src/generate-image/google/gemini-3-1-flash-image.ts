import { google } from '@ai-sdk/google';
import { generateImage } from 'ai';
import { presentImages } from '../../lib/present-image';
import { run } from '../../lib/run';

run(async () => {
  const { images } = await generateImage({
    model: google.image('gemini-3.1-flash-image-preview'),
    prompt: 'A nano banana in a fancy restaurant',
    aspectRatio: '4:1',
  });

  presentImages(images);
});
