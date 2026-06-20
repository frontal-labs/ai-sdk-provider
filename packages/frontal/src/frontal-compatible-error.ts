import { type ZodType, z } from 'zod/v4';
export const frontalErrorDataSchema = z.object({
  error: z.object({
    message: z.string(),

    // The additional information below is handled loosely to support
    // OpenAI-compatible providers that have slightly different error
    // responses:
    type: z.string().nullish(),
    param: z.any().nullish(),
    code: z.union([z.string(), z.number()]).nullish(),
  }),
});

export type FrontalErrorData = z.infer<
  typeof frontalErrorDataSchema
>;

export type ProviderErrorStructure<T> = {
  errorSchema: ZodType<T>;
  errorToMessage: (error: T) => string;
  isRetryable?: (response: Response, error?: T) => boolean;
};

export const defaultFrontalErrorStructure: ProviderErrorStructure<FrontalErrorData> =
  {
    errorSchema: frontalErrorDataSchema,
    errorToMessage: data => data.error.message,
  };
