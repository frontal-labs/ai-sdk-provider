import { embed } from 'ai';
import { run } from '../lib/run';
import { registry } from './setup-registry';

run(async () => {
  const { embedding } = await embed({
    model: registry.embeddingModel('openai:text-embedding-3-small'),
    value: 'sunny day at the beach',
  });

  console.log(embedding);
});
