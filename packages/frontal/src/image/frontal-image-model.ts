import type {
  ImageModelV4,
  ImageModelV4File,
  SharedV4ProviderOptions,
  SharedV4Warning,
} from '@ai-sdk/provider';
import {
  combineHeaders,
  convertBase64ToUint8Array,
  convertToFormData,
  createJsonErrorResponseHandler,
  createJsonResponseHandler,
  downloadBlob,
  type FetchFunction,
  postFormDataToApi,
  postJsonToApi,
  serializeModelOptions,
  WORKFLOW_DESERIALIZE,
  WORKFLOW_SERIALIZE,
} from '@ai-sdk/provider-utils';
import { z } from 'zod/v4';
import {
  defaultFrontalErrorStructure,
  type ProviderErrorStructure,
} from '../frontal-error';
import {
  toCamelCase,
  warnIfDeprecatedProviderOptionsKey,
} from '../utils/to-camel-case';
import type { FrontalImageModelId } from './frontal-image-settings';

export type FrontalImageModelConfig = {
  provider: string;
  headers?: () => Record<string, string | undefined>;
  url: (options: { modelId: string; path: string }) => string;
  fetch?: FetchFunction;
  errorStructure?: ProviderErrorStructure<any>;
  _internal?: {
    currentDate?: () => Date;
  };
};

export class FrontalImageModel implements ImageModelV4 {
  readonly specificationVersion = 'v4';
  readonly maxImagesPerCall = 10;

  get provider(): string {
    return this.config.provider;
  }

  /**
   * The provider options key used to extract provider-specific options.
   */
  private get providerOptionsKey(): string {
    return this.config.provider.split('.')[0].trim();
  }

  static [WORKFLOW_SERIALIZE](model: FrontalImageModel) {
    return serializeModelOptions({
      modelId: model.modelId,
      config: model.config,
    });
  }

  static [WORKFLOW_DESERIALIZE](options: {
    modelId: string;
    config: FrontalImageModelConfig;
  }) {
    return new FrontalImageModel(options.modelId, options.config);
  }

  constructor(
    readonly modelId: FrontalImageModelId,
    private readonly config: FrontalImageModelConfig,
  ) {}

  private getArgs(
    providerOptions: SharedV4ProviderOptions,
    warnings: SharedV4Warning[],
  ): Record<string, unknown> {
    warnIfDeprecatedProviderOptionsKey({
      rawName: this.providerOptionsKey,
      providerOptions,
      warnings,
    });
    return {
      ...providerOptions[this.providerOptionsKey],
      ...providerOptions[toCamelCase(this.providerOptionsKey)],
    };
  }

  async doGenerate({
    prompt,
    n,
    size,
    aspectRatio,
    seed,
    providerOptions,
    headers,
    abortSignal,
    files,
    mask,
  }: Parameters<ImageModelV4['doGenerate']>[0]): Promise<
    Awaited<ReturnType<ImageModelV4['doGenerate']>>
  > {
    const warnings: Array<SharedV4Warning> = [];

    if (aspectRatio != null) {
      warnings.push({
        type: 'unsupported',
        feature: 'aspectRatio',
        details:
          'This model does not support aspect ratio. Use `size` instead.',
      });
    }

    if (seed != null) {
      warnings.push({ type: 'unsupported', feature: 'seed' });
    }

    const currentDate = this.config._internal?.currentDate?.() ?? new Date();

    const args = this.getArgs(providerOptions, warnings);

    // Image editing mode - use form data and /images/edits endpoint
    if (files != null && files.length > 0) {
      const { value: response, responseHeaders } = await postFormDataToApi({
        url: this.config.url({
          path: '/images/edits',
          modelId: this.modelId,
        }),
        headers: combineHeaders(this.config.headers?.(), headers),
        formData: convertToFormData<FrontalFormDataInput>({
          model: this.modelId,
          prompt,
          image: await Promise.all(files.map(file => fileToBlob(file))),
          mask: mask == null ? undefined : await fileToBlob(mask),
          n,
          size,
          ...args,
        }),
        failedResponseHandler: createJsonErrorResponseHandler(
          this.config.errorStructure ?? defaultFrontalErrorStructure,
        ),
        successfulResponseHandler: createJsonResponseHandler(
          frontalImageResponseSchema,
        ),
        abortSignal,
        fetch: this.config.fetch,
      });

      return {
        images: response.data.map(item => item.b64_json),
        warnings,
        response: {
          timestamp: currentDate,
          modelId: this.modelId,
          headers: responseHeaders,
        },
      };
    }

    // Standard image generation mode - use JSON and /images/generations endpoint
    const { value: response, responseHeaders } = await postJsonToApi({
      url: this.config.url({
        path: '/images/generations',
        modelId: this.modelId,
      }),
      headers: combineHeaders(this.config.headers?.(), headers),
      body: {
        model: this.modelId,
        prompt,
        n,
        size,
        ...args,
        response_format: 'b64_json',
      },
      failedResponseHandler: createJsonErrorResponseHandler(
        this.config.errorStructure ?? defaultFrontalErrorStructure,
      ),
      successfulResponseHandler: createJsonResponseHandler(
        frontalImageResponseSchema,
      ),
      abortSignal,
      fetch: this.config.fetch,
    });

    return {
      images: response.data.map(item => item.b64_json),
      warnings,
      response: {
        timestamp: currentDate,
        modelId: this.modelId,
        headers: responseHeaders,
      },
    };
  }
}

// minimal version of the schema, focussed on what is needed for the implementation
// this approach limits breakages when the API changes and increases efficiency
const frontalImageResponseSchema = z.object({
  data: z.array(z.object({ b64_json: z.string() })),
});

type FrontalFormDataInput = {
  model: string;
  prompt: string | undefined;
  image: Blob | Blob[];
  mask?: Blob;
  n: number;
  size: `${number}x${number}` | undefined;
  [key: string]: unknown;
};

async function fileToBlob(file: ImageModelV4File): Promise<Blob> {
  if (file.type === 'url') {
    return downloadBlob(file.url);
  }

  const data =
    file.data instanceof Uint8Array
      ? file.data
      : convertBase64ToUint8Array(file.data);

  return new Blob([data as BlobPart], { type: file.mediaType });
}
