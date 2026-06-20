import { lmnt } from '@ai-sdk/lmnt';
import { generateSpeech } from 'ai';
import { run } from '../../lib/run';
import { saveAudioFile } from '../../lib/save-audio';

run(async () => {
  const result = await generateSpeech({
    model: lmnt.speech('aurora'),
    text: 'Hello from the AI SDK!',
  });

  console.log('Audio:', result.audio);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
  console.log('Provider Metadata:', result.providerMetadata);

  await saveAudioFile(result.audio);
});
