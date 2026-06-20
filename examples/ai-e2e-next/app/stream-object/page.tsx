'use client';

import { type StreamableValue, useStreamableValue } from '@ai-sdk/rsc';
import { useState } from 'react';
import { generateNotifications } from './actions';
import type { PartialNotification } from './schema';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// page component with a button to generate notifications
export default function Page() {
  const [notificationStream, setNotificationStream] =
    useState<StreamableValue<PartialNotification> | null>(null);

  return (
    <div className="m-4 flex min-h-screen flex-col items-center p-4">
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white"
        onClick={async () => {
          setNotificationStream(
            await generateNotifications('Messages during finals week.'),
          );
        }}
      >
        Generate notifications
      </button>

      {notificationStream && (
        <NotificationsView notificationStream={notificationStream} />
      )}
    </div>
  );
}

// separate component to display notifications that received the streamable value:
function NotificationsView({
  notificationStream,
}: {
  notificationStream: StreamableValue<PartialNotification>;
}) {
  const [data, pending, error] = useStreamableValue(notificationStream);

  return (
    <div className="mt-4 flex flex-col gap-4">
      {data?.notifications?.map((notification, index) => (
        <div
          className="flex items-start gap-4 rounded-md bg-gray-100 p-4 dark:bg-gray-800"
          key={index}
        >
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{notification?.name}</p>
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
  );
}
