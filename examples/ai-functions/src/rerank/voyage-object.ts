import { voyage } from '@ai-sdk/voyage';
import { rerank } from 'ai';
import { print } from '../lib/print';
import { run } from '../lib/run';
import { documents } from './documents';

run(async () => {
  const result = await rerank({
    model: voyage.reranking('rerank-2.5'),
    documents,
    query: 'Which pricing did we get from Oracle?',
    topN: 2,
  });

  print('Reranking:', result.ranking);
});
