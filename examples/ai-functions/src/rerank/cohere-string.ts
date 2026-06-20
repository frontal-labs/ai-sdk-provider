import { type CohereRerankingModelOptions, cohere } from '@ai-sdk/cohere';
import { rerank } from 'ai';
import { print } from '../lib/print';
import { run } from '../lib/run';

run(async () => {
  const result = await rerank({
    model: cohere.reranking('rerank-v3.5'),
    documents: ['sunny day at the beach', 'rainy day in the city'],
    query: 'talk about rain',
    topN: 2,
    providerOptions: {
      cohere: {
        priority: 1,
      } satisfies CohereRerankingModelOptions,
    },
  });

  print('Reranking:', result.ranking);
});
