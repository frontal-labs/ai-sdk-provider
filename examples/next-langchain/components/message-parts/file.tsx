/* eslint-disable @next/next/no-img-element */
'use client';

import { Download, ImageIcon, X, ZoomIn } from 'lucide-react';
import { useState } from 'react';

interface FileProps {
  mediaType: string;
  url: string;
}

/**
 * Renders a file message part (images, documents, etc.)
 */
export function File({ url, mediaType }: FileProps) {
  /**
   * Handle image files
   */
  if (mediaType?.startsWith('image/')) {
    const format = mediaType.split('/')[1] || 'png';
    return (
      <div>
        <GeneratedImage base64={url} format={format} />
      </div>
    );
  }

  /**
   * Handle other file types (placeholder for future extensions)
   */
  return null;
}

/**
 * Ensure image string has proper format
 * Handles: data URIs and raw base64
 */
function toImageSrc(input: string, format = 'png'): string {
  // Already a data URI
  if (input.startsWith('data:image/')) {
    return input;
  }
  // Raw base64 - add data URI prefix
  return `data:image/${format};base64,${input}`;
}

/**
 * Image viewer modal for full-size preview
 */
function ImageModal({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </button>
      <img
        alt="Generated image full size"
        className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
        src={src}
      />
    </div>
  );
}

/**
 * Component to render a generated image with download and zoom options
 * Accepts either a data URL or raw base64 string
 */
export function GeneratedImage({
  base64,
  format = 'png',
}: {
  base64: string;
  format?: string;
}) {
  const [showModal, setShowModal] = useState(false);
  /**
   * Convert to proper image source - handles data URIs and raw base64
   */
  const src = toImageSrc(base64, format);

  /**
   * Handle download of the image
   */
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `image-${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="group relative">
        <div className="relative w-fit overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]">
          <img
            alt="Image"
            className="max-w-md cursor-pointer rounded-xl transition-transform hover:scale-[1.02]"
            onClick={() => setShowModal(true)}
            src={src}
          />
          {/* Overlay with actions */}
          <div className="absolute inset-0 flex items-end justify-center gap-2 bg-gradient-to-t from-black/50 to-transparent pb-3 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 font-medium text-white text-xs backdrop-blur-sm transition-colors hover:bg-white/30"
              onClick={() => setShowModal(true)}
            >
              <ZoomIn className="h-3.5 w-3.5" />
              View
            </button>
            <button
              className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 font-medium text-white text-xs backdrop-blur-sm transition-colors hover:bg-white/30"
              onClick={handleDownload}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
          </div>
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--background-secondary)] px-2 py-1 font-medium text-[var(--foreground)] text-xs">
          <ImageIcon className="h-3.5 w-3.5" />
          <span>Image</span>
        </div>
      </div>
      {showModal && (
        <ImageModal onClose={() => setShowModal(false)} src={src} />
      )}
    </>
  );
}
