'use client';

import {
  type Experimental_GoogleRealtimeModelOptions as GoogleRealtimeModelOptions,
  google,
} from '@ai-sdk/google';
import { experimental_useRealtime } from '@ai-sdk/react';
import { Activity, Languages, Mic, Pause, Power } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'pl', label: 'Polish' },
  { code: 'pt-BR', label: 'Portuguese (Brazil)' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
];

const statusText: Record<string, string> = {
  disconnected: 'Not connected.',
  connecting: 'Connecting...',
  connected: 'Ready.',
  error: 'Connection error.',
};

const statusColor: Record<string, string> = {
  disconnected: 'text-zinc-500',
  connecting: 'text-amber-700',
  connected: 'text-emerald-700',
  error: 'text-rose-700',
};

function CodeBadge({ children }: { children: string }) {
  return (
    <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-medium font-mono text-[11px] text-zinc-500">
      {children}
    </code>
  );
}

function getMessageText(message: {
  parts: Array<{ type: string; text?: string }>;
}): string {
  return message.parts
    .filter(part => part.type === 'text' && part.text != null)
    .map(part => part.text)
    .join('');
}

function getLatestText(
  messages: Array<{
    role: string;
    parts: Array<{ type: string; text?: string }>;
  }>,
  role: string,
): string {
  const matchingMessages = messages
    .filter(message => message.role === role)
    .map(getMessageText)
    .filter(text => text.length > 0);

  return matchingMessages.at(-1) ?? '';
}

export default function LiveTranslatePage() {
  const [targetLanguageCode, setTargetLanguageCode] = useState('pl');
  const [echoTargetLanguage, setEchoTargetLanguage] = useState(true);
  const [showEvents, setShowEvents] = useState(false);
  const [captureStarting, setCaptureStarting] = useState(false);
  const [showConnectedPrompt, setShowConnectedPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoStartAttemptedRef = useRef(false);
  const captureActiveRef = useRef(false);
  const captureRequestIdRef = useRef(0);
  const captureRequestPendingRef = useRef(false);
  const captureStreamRef = useRef<MediaStream | null>(null);
  const statusRef = useRef('disconnected');
  const eventsContainerRef = useRef<HTMLDivElement>(null);
  const shouldFollowEventsRef = useRef(true);

  const model = useMemo(
    () => google.experimental_realtime('gemini-3.5-live-translate-preview'),
    [],
  );

  const sessionConfig = useMemo(
    () => ({
      outputModalities: ['audio' as const],
      inputAudioFormat: { type: 'audio/pcm', rate: 16_000 },
      outputAudioFormat: { type: 'audio/pcm', rate: 24_000 },
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      providerOptions: {
        google: {
          translationConfig: {
            targetLanguageCode,
            echoTargetLanguage,
          },
        } satisfies GoogleRealtimeModelOptions,
      },
    }),
    [echoTargetLanguage, targetLanguageCode],
  );

  const {
    status,
    messages,
    events,
    isCapturing,
    isPlaying,
    connect,
    disconnect,
    commitAudio,
    startAudioCapture,
    stopAudioCapture,
    stopPlayback,
  } = experimental_useRealtime({
    model,
    api: {
      token: '/api/realtime/setup?provider=google-live-translate',
    },
    sessionConfig,
    maxEvents: 250,
    onEvent: event => {
      if (event.type !== 'audio-delta') {
        console.log('[live-translate]', event.type, event);
      }
    },
    onError: nextError => {
      setError(nextError.message);
      console.warn('[live-translate] error:', nextError.message);
    },
  });

  const realtimeActionsRef = useRef({
    commitAudio,
    startAudioCapture,
    stopAudioCapture,
  });
  realtimeActionsRef.current = {
    commitAudio,
    startAudioCapture,
    stopAudioCapture,
  };

  const visibleEvents = events.filter(event => event.type !== 'audio-delta');
  const latestVisibleEvent = visibleEvents.at(-1);

  useEffect(() => {
    if (showEvents && shouldFollowEventsRef.current) {
      const container = eventsContainerRef.current;
      if (container != null) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [latestVisibleEvent, showEvents]);

  useEffect(() => {
    statusRef.current = status;
    if (status !== 'error') {
      setError(null);
    }
  }, [status]);

  const stopListening = useCallback((commit = true) => {
    captureRequestIdRef.current += 1;
    captureRequestPendingRef.current = false;
    setCaptureStarting(false);

    if (!captureActiveRef.current) {
      return;
    }

    captureActiveRef.current = false;
    captureStreamRef.current = null;
    realtimeActionsRef.current.stopAudioCapture();

    if (commit && statusRef.current === 'connected') {
      realtimeActionsRef.current.commitAudio();
    }
  }, []);

  const startListening = useCallback(async () => {
    if (
      statusRef.current !== 'connected' ||
      captureActiveRef.current ||
      captureRequestPendingRef.current
    ) {
      return;
    }

    const requestId = ++captureRequestIdRef.current;
    captureRequestPendingRef.current = true;
    setCaptureStarting(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (
        requestId !== captureRequestIdRef.current ||
        statusRef.current !== 'connected'
      ) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      captureStreamRef.current = stream;
      captureActiveRef.current = true;
      realtimeActionsRef.current.startAudioCapture(stream);
    } catch (nextError) {
      if (requestId !== captureRequestIdRef.current) {
        return;
      }

      captureActiveRef.current = false;
      captureStreamRef.current?.getTracks().forEach(track => track.stop());
      captureStreamRef.current = null;
      setError(
        nextError instanceof Error
          ? nextError.message
          : 'Microphone access failed',
      );
    } finally {
      if (requestId === captureRequestIdRef.current) {
        captureRequestPendingRef.current = false;
        setCaptureStarting(false);
      }
    }
  }, []);

  useEffect(() => {
    if (status !== 'connected') {
      stopListening(false);
    }
  }, [status, stopListening]);

  useEffect(
    () => () => {
      statusRef.current = 'disconnected';
      captureRequestIdRef.current += 1;
      captureStreamRef.current?.getTracks().forEach(track => track.stop());
      captureStreamRef.current = null;
      captureActiveRef.current = false;
    },
    [],
  );

  useEffect(() => {
    if (status !== 'connected') {
      autoStartAttemptedRef.current = false;
      setShowConnectedPrompt(false);
      return;
    }

    setShowConnectedPrompt(true);
    const timeout = window.setTimeout(
      () => setShowConnectedPrompt(false),
      5000,
    );

    return () => window.clearTimeout(timeout);
  }, [status]);

  useEffect(() => {
    if (status !== 'connected' || autoStartAttemptedRef.current) {
      return;
    }

    autoStartAttemptedRef.current = true;
    void startListening();
  }, [startListening, status]);

  const connectOrDisconnect = async () => {
    if (status === 'connected') {
      stopListening();
      statusRef.current = 'disconnected';
      if (isPlaying) {
        stopPlayback();
      }
      disconnect();
      return;
    }

    setError(null);
    await connect();
  };

  const controlsLocked = status === 'connected' || status === 'connecting';
  const latestInput = getLatestText(messages, 'user');
  const latestTranslation = getLatestText(messages, 'assistant');
  const outputText =
    latestTranslation || latestInput || 'Translated speech will appear here.';

  const inputTranscriptCount = events.filter(
    event => event.type === 'input-transcription-completed',
  ).length;
  const outputTranscriptCount = events.filter(event =>
    event.type.startsWith('audio-transcript'),
  ).length;

  const resultStatus =
    status === 'connected'
      ? isCapturing
        ? `Listening - target language: ${targetLanguageCode}.`
        : latestTranslation
          ? `Done - target language: ${targetLanguageCode}.`
          : `Ready - target language: ${targetLanguageCode}.`
      : statusText[status];

  return (
    <main className="flex min-h-screen items-start justify-center bg-[#fafafa] px-5 py-20 text-zinc-950">
      {showConnectedPrompt && (
        <div
          className="fixed top-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-emerald-200 bg-white px-4 py-3 shadow-lg"
          role="status"
        >
          <span className="mt-1 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
          <div className="min-w-0">
            <div className="font-semibold text-sm text-zinc-900">
              You&apos;re connected
            </div>
            <div className="mt-0.5 text-xs text-zinc-500 leading-5">
              Start speaking. Translation will appear as you talk.
            </div>
          </div>
          <button
            aria-label="Dismiss connected message"
            className="ml-1 text-lg text-zinc-400 leading-none hover:text-zinc-700"
            onClick={() => setShowConnectedPrompt(false)}
            type="button"
          >
            &times;
          </button>
        </div>
      )}

      <section className="w-full max-w-[470px] rounded-xl border border-zinc-200 bg-white p-7 shadow-[0_18px_60px_rgba(0,0,0,0.10)]">
        <header className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Languages aria-hidden className="text-zinc-700" size={18} />
            <h1 className="font-semibold text-xl text-zinc-900 tracking-normal">
              Google Gemini Live Translate
            </h1>
          </div>
          <p className="text-[13px] text-zinc-500 leading-5">
            Speech-to-speech via <CodeBadge>@ai-sdk/google</CodeBadge> and{' '}
            <CodeBadge>.experimental_realtime()</CodeBadge> through{' '}
            <CodeBadge>gemini-3.5-live-translate-preview</CodeBadge>.
          </p>
        </header>

        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 font-semibold text-xs text-zinc-700">
              Target language
              <select
                className="h-10 rounded-md border border-zinc-300 bg-white px-3 font-normal text-sm text-zinc-900 outline-none transition focus:border-zinc-500 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500"
                disabled={controlsLocked}
                onChange={event => setTargetLanguageCode(event.target.value)}
                value={targetLanguageCode}
              >
                {languageOptions.map(language => (
                  <option key={language.code} value={language.code}>
                    {language.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5 font-semibold text-xs text-zinc-700">
              Echo
              <select
                className="h-10 rounded-md border border-zinc-300 bg-white px-3 font-normal text-sm text-zinc-900 outline-none transition focus:border-zinc-500 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500"
                disabled={controlsLocked}
                onChange={event =>
                  setEchoTargetLanguage(event.target.value === 'on')
                }
                value={echoTargetLanguage ? 'on' : 'off'}
              >
                <option value="on">Echo target language</option>
                <option value="off">Silence target language</option>
              </select>
            </label>
          </div>

          <button
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 font-semibold text-sm text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            disabled={status === 'connecting'}
            onClick={connectOrDisconnect}
            type="button"
          >
            <Power aria-hidden size={16} />
            {status === 'connected'
              ? 'Disconnect'
              : status === 'connecting'
                ? 'Connecting...'
                : 'Connect'}
          </button>

          <div className="my-5 border-zinc-200 border-t" />

          <div>
            <p className="mb-4 text-[13px] text-zinc-500 leading-5">
              Speak naturally once connected. Audio input and translated output
              transcripts are enabled.
            </p>

            <div
              className={`rounded-lg border p-4 transition ${
                isCapturing
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-zinc-200 bg-zinc-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isCapturing
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  <Mic aria-hidden size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm text-zinc-900">
                    {isCapturing
                      ? 'Listening...'
                      : captureStarting
                        ? 'Opening microphone...'
                        : 'Listening paused'}
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-500">
                    {isCapturing
                      ? 'Speak normally and translation will appear below.'
                      : 'Start listening when you are ready to speak.'}
                  </div>
                </div>
                {isCapturing && (
                  <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
                )}
              </div>

              <button
                className={`mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md px-3 font-semibold text-sm transition disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 ${
                  isCapturing
                    ? 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
                    : 'bg-zinc-950 text-white hover:bg-zinc-800'
                }`}
                disabled={status !== 'connected' || captureStarting}
                onClick={isCapturing ? () => stopListening() : startListening}
                type="button"
              >
                {isCapturing ? (
                  <Pause aria-hidden size={15} />
                ) : (
                  <Mic aria-hidden size={15} />
                )}
                {isCapturing ? 'Stop listening' : 'Start listening'}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 font-semibold text-sm text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400"
                disabled={!isPlaying}
                onClick={stopPlayback}
                type="button"
              >
                <Pause aria-hidden size={15} />
                Stop audio
              </button>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 font-semibold text-sm text-zinc-700 transition hover:bg-zinc-50"
                onClick={() => {
                  shouldFollowEventsRef.current = true;
                  setShowEvents(value => !value);
                }}
                type="button"
              >
                <Activity aria-hidden size={15} />
                {showEvents ? 'Hide events' : 'Show events'}
              </button>
            </div>
          </div>

          <div className="mt-1 font-medium text-[13px]">
            <span className={statusColor[status]}>{resultStatus}</span>
          </div>

          {error != null && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-800 leading-5">
              {error}
            </div>
          )}

          <div className="rounded-md bg-zinc-100 px-4 py-3 font-mono text-[13px] text-zinc-700 leading-6">
            {outputText}
          </div>

          <dl className="grid grid-cols-3 gap-2 text-center text-xs text-zinc-500">
            <div className="rounded-md border border-zinc-200 px-2 py-2">
              <dt className="mb-1 font-medium text-zinc-700">Target</dt>
              <dd>{targetLanguageCode}</dd>
            </div>
            <div className="rounded-md border border-zinc-200 px-2 py-2">
              <dt className="mb-1 font-medium text-zinc-700">Input</dt>
              <dd>{inputTranscriptCount}</dd>
            </div>
            <div className="rounded-md border border-zinc-200 px-2 py-2">
              <dt className="mb-1 font-medium text-zinc-700">Output</dt>
              <dd>{outputTranscriptCount}</dd>
            </div>
          </dl>

          {showEvents && (
            <div
              className="max-h-64 overflow-y-auto rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600"
              onScroll={event => {
                const container = event.currentTarget;
                shouldFollowEventsRef.current =
                  container.scrollHeight -
                    container.scrollTop -
                    container.clientHeight <
                  24;
              }}
              ref={eventsContainerRef}
            >
              <div className="mb-2 font-semibold text-zinc-800">
                Events ({visibleEvents.length})
              </div>
              {visibleEvents.length === 0 ? (
                <div className="rounded-md bg-white px-3 py-2 text-zinc-400">
                  No events yet.
                </div>
              ) : (
                visibleEvents.map((event, index) => (
                  <details
                    className="border-zinc-200 border-t py-2 first:border-t-0"
                    key={`${event.type}-${index}`}
                  >
                    <summary className="cursor-pointer font-mono text-zinc-700">
                      {event.type}
                    </summary>
                    <pre className="mt-2 max-h-44 overflow-auto rounded-md bg-white p-2 font-mono text-[11px] text-zinc-600 leading-5">
                      {JSON.stringify(event, null, 2)}
                    </pre>
                  </details>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
