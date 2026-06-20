import { type CohereRerankingModelOptions, cohere } from '@ai-sdk/cohere';
import { rerank } from 'ai';
import { print } from '../lib/print';
import { run } from '../lib/run';
import { documents } from './documents';

run(async () => {
  const result = await rerank({
    model: cohere.reranking('rerank-v3.5'),
    documents,
    query: 'Which pricing did we get from Oracle?',
    topN: 2,
    providerOptions: {
      cohere: {
        priority: 1,
      } satisfies CohereRerankingModelOptions,
    },
  });

  print('Reranking:', result.ranking);
});
