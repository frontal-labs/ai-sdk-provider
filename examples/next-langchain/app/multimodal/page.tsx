'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import {
  AlertCircle,
  ImageIcon,
  Loader2,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../../components/chat-message';
import { ThinkingIndicator } from '../../components/thinking-indicator';
import type { CustomDataMessage } from '../types';

const transport = new DefaultChatTransport({
  api: '/api/multimodal',
});

/**
 * Pre-loaded image examples using local images
 * These allow users to instantly try the vision capabilities
 * Images are stored in public/images and converted to base64 before sending
 */
const IMAGE_EXAMPLES = [
  {
    label: 'Analyze Architecture',
    prompt:
      'Describe the architectural style and notable features of this building.',
    filename: 'empire-state-building.jpg',
    imagePath: '/images/empire-state-building.jpg',
  },
  {
    label: 'Describe Nature Scene',
    prompt:
      'What animals and plants can you identify in this image? Describe the ecosystem.',
    filename: 'macaw-parrot.jpg',
    imagePath: '/images/macaw-parrot.jpg',
  },
  {
    label: 'Read Document',
    prompt:
      'What information can you extract from this document? Summarize the key points.',
    filename: 'constitution.jpg',
    imagePath: '/images/constitution.jpg',
  },
  {
    label: 'Analyze Artwork',
    prompt:
      'Analyze the artistic techniques, style, and historical context of this painting.',
    filename: 'mona-lisa.jpg',
    imagePath: '/images/mona-lisa.jpg',
  },
];

/**
 * Converts an image URL to a base64 data URL
 * This is needed because OpenAI can't access localhost images
 */
async function imageToBase64(imagePath: string): Promise<string> {
  const response = await fetch(imagePath);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function MultimodalPage() {
  const { messages, sendMessage, status, error } = useChat<CustomDataMessage>({
    transport,
  });

  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = event => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!(input.trim() || selectedImage)) {
      return;
    }

    const messageContent = input.trim() || 'What is in this image?';

    if (selectedImage && imageFile) {
      /**
       * Send message with image attachment
       */
      await sendMessage({
        text: messageContent,
        files: [
          {
            type: 'file',
            mediaType: imageFile.type,
            url: selectedImage,
            filename: imageFile.name,
          },
        ],
      });
    } else {
      /**
       * Send text-only message
       */
      await sendMessage({ text: messageContent });
    }

    setInput('');
    clearImage();
  }, [input, selectedImage, imageFile, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /**
   * Handle clicking on a pre-loaded image example
   * Converts the local image to base64 and sends it to the model
   */
  const handleImageExample = async (example: (typeof IMAGE_EXAMPLES)[0]) => {
    /**
     * Convert local image to base64 data URL
     */
    const dataUrl = await imageToBase64(example.imagePath);

    /**
     * Send message with image attachment
     */
    await sendMessage({
      text: example.prompt,
      files: [
        {
          type: 'file',
          mediaType: 'image/jpeg',
          url: dataUrl,
          filename: example.filename,
        },
      ],
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex-shrink-0 rounded-t-xl border-[var(--border)] border-b p-6">
        <h1 className="mb-2 font-semibold text-2xl text-[var(--foreground)]">
          Multimodal Vision
        </h1>
        <div className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
          Send images to <strong>GPT-4o</strong> for analysis. This example
          demonstrates multimodal input using the <code>@ai-sdk/langchain</code>{' '}
          adapter, which properly converts images and files to LangChain&apos;s
          multimodal content format.
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mx-6 mt-4 animate-fade-in rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" strokeWidth={2} />
            {error.message}
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)]/10">
              <ImageIcon className="h-8 w-8 text-[var(--accent)]" />
            </div>
            <h2 className="mb-2 font-medium text-[var(--foreground)] text-xl">
              Vision-Enabled Chat
            </h2>
            <p className="mb-8 max-w-lg text-[var(--foreground-secondary)]">
              Click on any example below to see GPT-4o analyze the image, or
              upload your own image using the button below.
            </p>

            {/* Image Examples Grid */}
            <div className="grid w-full max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
              {IMAGE_EXAMPLES.map((example, index) => (
                <button
                  className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] transition-all duration-300 hover:border-[var(--accent)] hover:shadow-[var(--accent)]/10 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                  key={index}
                  onClick={() => handleImageExample(example)}
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      alt={example.label}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={example.imagePath}
                    />
                  </div>

                  {/* Label overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3">
                    <div className="flex items-center gap-1.5 font-medium text-sm text-white">
                      <Sparkles className="h-3.5 w-3.5" />
                      {example.label}
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--accent)]/0 transition-colors duration-300 group-hover:bg-[var(--accent)]/10">
                    <div className="flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1.5 font-medium text-white text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Send className="h-3 w-3" />
                      Analyze
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <p className="mt-6 text-[var(--foreground-secondary)] text-xs">
              Or upload your own image using the button below
            </p>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <ThinkingIndicator isStreaming={isLoading} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Image Preview */}
      {selectedImage && (
        <div className="mx-6 mb-2 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-3">
          <div className="flex items-start gap-3">
            <div className="relative">
              <img
                alt="Selected"
                className="h-20 w-20 rounded-md object-cover"
                src={selectedImage}
              />
              <button
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 text-[var(--foreground-secondary)] text-sm">
              <p className="font-medium text-[var(--foreground)]">
                {imageFile?.name}
              </p>
              <p>{(imageFile?.size ?? 0 / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex-shrink-0 border-[var(--border)] border-t p-4">
        <div className="flex gap-3">
          {/* Image upload button */}
          <input
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
            ref={fileInputRef}
            type="file"
          />
          <button
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground-secondary)] transition-all duration-200 hover:bg-[var(--background-tertiary)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            onClick={() => fileInputRef.current?.click()}
            title="Attach image"
          >
            <ImageIcon className="h-5 w-5" />
          </button>

          {/* Text input */}
          <div className="relative flex-1">
            <textarea
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-4 py-3 pr-12 text-[var(--foreground)] placeholder-[var(--foreground-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedImage
                  ? 'Ask about this image...'
                  : 'Type a message or attach an image...'
              }
              rows={1}
              value={input}
            />
          </div>

          {/* Send button */}
          <button
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white transition-all duration-200 hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading || !(input.trim() || selectedImage)}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>

        <p className="mt-2 text-center text-[var(--foreground-secondary)] text-xs">
          Supports JPEG, PNG, GIF, and WebP images up to 20MB
        </p>
      </div>
    </div>
  );
}
