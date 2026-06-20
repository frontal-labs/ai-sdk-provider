<picture>
  <source srcset="./banner-dark.png" media="(prefers-color-scheme: dark)">
  <source srcset="./banner.png" media="(prefers-color-scheme: light)">
  <img src="./banner-dark.png" alt="Frontal Website Banner">
</picture>

# AI SDK - Frontal Provider

The Frontal provider is a lightweight package for working with providers that expose an OpenAI-compatible API through our brand and AI gateway.

> **Deploying to Frontal?** With Frontal's AI Gateway you can access hundreds of models from any provider — no additional packages, API keys, or extra cost. [Get started with AI Gateway](https://frontal.ai/gateway).

## Setup

The provider is available in the `ai-sdk-frontal` module. You can install it with

```bash
npm i ai-sdk-frontal
```

## Skill for Coding Agents

If you use coding agents such as Claude Code or Cursor, we highly recommend adding the Frontal skill to your repository:

```shell
npx skills add frontal/ai
```

## Provider Instance

You can import the provider creation method `createFrontal` from `ai-sdk-frontal`:

```ts
import { createFrontal } from 'ai-sdk-frontal';
```

## Example

```ts
import { createFrontal } from 'ai-sdk-frontal';
import { generateText } from 'ai';

const { text } = await generateText({
  model: createFrontal({
    baseURL: 'https://api.example.com/v1',
    name: 'example',
    apiKey: process.env.MY_API_KEY,
  }).chatModel('meta-llama/Llama-3-70b-chat-hf'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

### Customizing headers

You can further customize headers if desired. For example, here is an alternate implementation to pass along api key authentication:

```ts
import { createFrontal } from 'ai-sdk-frontal';
import { generateText } from 'ai';

const { text } = await generateText({
  model: createFrontal({
    baseURL: 'https://api.example.com/v1',
    name: 'example',
    headers: {
      Authorization: `Bearer ${process.env.MY_API_KEY}`,
    },
  }).chatModel('meta-llama/Llama-3-70b-chat-hf'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

### Including model ids for auto-completion

```ts
import { createFrontal } from 'ai-sdk-frontal';
import { generateText } from 'ai';

type ExampleChatModelIds =
  | 'meta-llama/Llama-3-70b-chat-hf'
  | 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'
  | (string & {});

type ExampleCompletionModelIds =
  | 'codellama/CodeLlama-34b-Instruct-hf'
  | 'Qwen/Qwen2.5-Coder-32B-Instruct'
  | (string & {});

type ExampleEmbeddingModelIds =
  | 'BAAI/bge-large-en-v1.5'
  | 'bert-base-uncased'
  | (string & {});

const model = createFrontal<
  ExampleChatModelIds,
  ExampleCompletionModelIds,
  ExampleEmbeddingModelIds
>({
  baseURL: 'https://api.example.com/v1',
  name: 'example',
  apiKey: process.env.MY_API_KEY,
});

// Subsequent calls to e.g. `model.chatModel` will auto-complete the model id
// from the list of `ExampleChatModelIds` while still allowing free-form
// strings as well.

const { text } = await generateText({
  model: model.chatModel('meta-llama/Llama-3-70b-chat-hf'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

For more examples, see the [Frontal Provider](https://frontal.ai/providers/frontal) documentation.
