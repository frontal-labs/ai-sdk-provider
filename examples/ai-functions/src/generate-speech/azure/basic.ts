import { azure } from '@ai-sdk/azure';
import { generateSpeech } from 'ai';
import { run } from '../../lib/run';
import { saveAudioFile } from '../../lib/save-audio';

run(async () => {
  const result = await generateSpeech({
    model: azure.speech('tts-1'), // use your own deployment
    text: 'Hello from the AI SDK!',
  });

  console.log('Audio:', result.audio);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
  console.log('Provider Metadata:', result.providerMetadata);

  await saveAudioFile(result.audio);
});
