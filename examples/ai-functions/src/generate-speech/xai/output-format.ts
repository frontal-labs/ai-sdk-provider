import { type XaiSpeechModelOptions, xai } from '@ai-sdk/xai';
import { generateSpeech } from 'ai';
import { run } from '../../lib/run';
import { saveAudioFile } from '../../lib/save-audio';

run(async () => {
  const result = await generateSpeech({
    model: xai.speech(),
    text: 'A high fidelity narration sample generated with xAI.',
    voice: 'rex',
    language: 'en',
    outputFormat: 'mp3',
    providerOptions: {
      xai: {
        sampleRate: 44_100,
        bitRate: 192_000,
        textNormalization: true,
      } satisfies XaiSpeechModelOptions,
    },
  });

  console.log('Audio:', result.audio);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);

  await saveAudioFile(result.audio);
});
