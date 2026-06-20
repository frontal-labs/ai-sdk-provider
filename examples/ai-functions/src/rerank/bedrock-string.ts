import { amazonBedrock } from '@ai-sdk/amazon-bedrock';
import { rerank } from 'ai';
import { print } from '../lib/print';
import { run } from '../lib/run';

run(async () => {
  const result = await rerank({
    model: amazonBedrock.reranking('amazon.rerank-v1:0'),
    documents: ['sunny day at the beach', 'rainy day in the city'],
    query: 'talk about rain',
    topN: 2,
  });

  print('Reranking:', result.ranking);
});
