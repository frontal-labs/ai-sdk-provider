'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { notificationSchema } from '../api/use-object-valibot/schema';

export default function Page() {
  const { submit, isLoading, object, stop, error, clear } = useObject({
    api: '/api/use-object-valibot',
    schema: notificationSchema,
  });

  return (
    <div className="m-4 flex min-h-screen flex-col items-center p-4">
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white disabled:bg-blue-200"
        disabled={isLoading}
        onClick={async () => {
          submit('Messages during finals week.');
        }}
      >
        Generate notifications
      </button>

      {error && (
        <div className="mt-4 text-red-500">
          An error occurred. {error.message}
        </div>
      )}

      {isLoading && (
        <div className="mt-4 text-gray-500">
          <div>Loading...</div>
          <button
            className="mt-4 rounded-md border border-blue-500 px-4 py-2 text-blue-500"
            onClick={() => stop()}
            type="button"
          >
            STOP
          </button>
        </div>
      )}

      <div className="mt-4 text-gray-500">
        <button
          className="mt-4 rounded-md border border-blue-500 px-4 py-2 text-blue-500"
          onClick={() => clear()}
          type="button"
        >
          Clear
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {object?.notifications?.map((notification, index) => (
          <div
            className="flex items-start gap-4 rounded-md bg-gray-100 p-4 dark:bg-gray-800"
            key={index}
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium dark:text-white">
                  {notification?.name}
                </p>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  {notification?.minutesAgo}
                  {notification?.minutesAgo == null ? '' : ' minutes ago'}
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {notification?.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
