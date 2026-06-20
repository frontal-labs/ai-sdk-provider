import { elevenLabs } from '@ai-sdk/elevenlabs';
import { generateSpeech } from 'ai';
import { run } from '../../lib/run';
import { saveAudioFile } from '../../lib/save-audio';

run(async () => {
  const result = await generateSpeech({
    model: elevenLabs.speech('eleven_multilingual_v2'),
    text: 'Hello from the AI SDK with ElevenLabs!',
    voice: process.env.ELEVENLABS_VOICE_ID || 'your-voice-id-here',
  });

  console.log('Audio:', result.audio);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
  console.log('Provider Metadata:', result.providerMetadata);

  await saveAudioFile(result.audio);
});
