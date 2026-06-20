import { xai } from '@ai-sdk/xai';
import { generateSpeech } from 'ai';
import { run } from '../../lib/run';
import { saveAudioFile } from '../../lib/save-audio';

run(async () => {
  const result = await generateSpeech({
    model: xai.speech(),
    text: 'Hello from the AI SDK!',
    voice: 'ara',
    language: 'en',
  });

  console.log('Audio:', result.audio);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);

  await saveAudioFile(result.audio);
});
