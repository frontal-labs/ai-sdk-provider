import { elevenLabs } from '@ai-sdk/elevenlabs';
import { generateSpeech } from 'ai';
import { run } from '../../lib/run';
import { saveAudioFile } from '../../lib/save-audio';

run(async () => {
  const result = await generateSpeech({
    model: elevenLabs.speech('eleven_multilingual_v2'),
    text: 'Hola, este es un ejemplo de síntesis de voz en español.',
    language: 'es', // Spanish language code
  });

  console.log('Audio:', result.audio);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
  console.log('Provider Metadata:', result.providerMetadata);

  await saveAudioFile(result.audio);
});
