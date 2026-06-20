import { generateSpeech } from 'ai';
import { run } from '../lib/run';
import { registry } from './setup-registry';

run(async () => {
  const { audio } = await generateSpeech({
    model: registry.speechModel('openai:tts-1'),
    text: 'Hello, this is a test of speech synthesis using the provider registry!',
  });

  console.log('Generated audio:', audio);
});
