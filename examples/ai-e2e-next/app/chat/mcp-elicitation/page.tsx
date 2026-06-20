'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isDataUIPart } from 'ai';
import { useEffect, useRef, useState } from 'react';
import type {
  ElicitationAction,
  MCPElicitationUIMessage,
} from '@/app/api/chat/mcp-elicitation/types';
export default function MCPElicitationChat() {
  const [input, setInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentElicitation, setCurrentElicitation] = useState<{
    elicitationId: string;
    message: string;
    requestedSchema: unknown;
  } | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Track which elicitation IDs we've already handled
  const handledElicitationsRef = useRef<Set<string>>(new Set());

  const { messages, sendMessage } = useChat<MCPElicitationUIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat/mcp-elicitation',
    }),
  });

  // Check for NEW elicitation requests in messages (only unhandled ones)
  useEffect(() => {
    // Loop through messages in REVERSE order to find the most recent unhandled elicitation
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (!message.parts) {
        continue;
      }

      for (const part of message.parts) {
        if (isDataUIPart(part) && part.type === 'data-elicitation-request') {
          const elicitationId = part.data.elicitationId;

          // Only show modal if this elicitation hasn't been handled yet
          if (!handledElicitationsRef.current.has(elicitationId)) {
            console.log(
              '[page] New elicitation request detected:',
              elicitationId,
            );
            handledElicitationsRef.current.add(elicitationId);

            setCurrentElicitation(part.data);
            setShowModal(true);

            // Initialize form data with defaults from schema
            const schema = part.data.requestedSchema as any;
            if (schema?.properties) {
              const defaults: Record<string, any> = {};
              for (const [key, prop] of Object.entries(schema.properties)) {
                const property = prop as any;
                if (property.default !== undefined) {
                  defaults[key] = property.default;
                } else if (property.type === 'boolean') {
                  defaults[key] = false;
                }
              }
              setFormData(defaults);
            }
            return; // Show only the most recent unhandled elicitation
          }
        }
      }
    }
  }, [messages]);

  const handleElicitationResponse = async (action: ElicitationAction) => {
    if (!currentElicitation) {
      console.warn('[page] No current elicitation to respond to');
      return;
    }

    const elicitationId = currentElicitation.elicitationId;
    console.log(
      '[page] Submitting response for:',
      elicitationId,
      'action:',
      action,
    );

    // Immediately close modal and clear state to prevent double-submission
    setShowModal(false);
    const elicitationToRespond = currentElicitation;
    const dataToSend = action === 'accept' ? { ...formData } : undefined;
    setCurrentElicitation(null);
    setFormData({});

    // Send elicitation response to the separate endpoint
    try {
      const response = await fetch('/api/mcp-elicitation/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: elicitationId,
          action,
          content: dataToSend,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[page] Failed to submit response:', errorData);
        throw new Error(errorData.error || 'Failed to submit response');
      }

      console.log('[page] Successfully submitted response for:', elicitationId);
    } catch (error) {
      console.error('[page] Error sending elicitation response:', error);
      // Don't show alert as the response might have already been processed
      // alert('Failed to submit response. Please try again.');
    }
  };

  const renderFormField = (key: string, property: any, isRequired: boolean) => {
    const label = property.title || key;
    const description = property.description;
    const type = property.type;

    return (
      <div className="mb-4" key={key}>
        <label className="mb-2 block">
          <span className="font-semibold">
            {label}
            {isRequired && <span className="text-red-500">*</span>}
          </span>
          {description && (
            <span className="block text-gray-600 text-sm">{description}</span>
          )}
        </label>
        {type === 'boolean' ? (
          <input
            checked={formData[key]}
            className="h-4 w-4"
            onChange={e =>
              setFormData({ ...formData, [key]: e.target.checked })
            }
            type="checkbox"
          />
        ) : type === 'number' || type === 'integer' ? (
          <input
            className="w-full rounded border border-gray-300 p-2"
            max={property.maximum}
            min={property.minimum}
            onChange={e =>
              setFormData({
                ...formData,
                [key]:
                  type === 'integer'
                    ? Number.parseInt(e.target.value) || 0
                    : Number.parseFloat(e.target.value) || 0,
              })
            }
            required={isRequired}
            type="number"
            value={formData[key] || ''}
          />
        ) : (
          <input
            className="w-full rounded border border-gray-300 p-2"
            maxLength={property.maxLength}
            minLength={property.minLength}
            onChange={e => setFormData({ ...formData, [key]: e.target.value })}
            required={isRequired}
            type={
              property.format === 'email'
                ? 'email'
                : type === 'password'
                  ? 'password'
                  : 'text'
            }
            value={formData[key] || ''}
          />
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col py-24">
      <h1 className="mb-8 font-bold text-2xl">MCP Elicitation Example</h1>

      <div className="mb-4 flex-1 overflow-y-auto">
        {messages?.map(m => (
          <div className="mb-4 whitespace-pre-wrap" key={m.id}>
            <div className="mb-1 font-bold">
              {m.role === 'user' ? 'You' : 'Assistant'}:
            </div>
            {m.parts?.map((part, i) => {
              if (part.type === 'text') {
                return (
                  <div className="text-gray-800" key={i}>
                    {part.text}
                  </div>
                );
              }
              if (isDataUIPart(part)) {
                if (part.type === 'data-elicitation-request') {
                  return (
                    <div
                      className="mt-2 border-blue-500 border-l-4 bg-blue-50 p-3"
                      key={i}
                    >
                      <div className="text-blue-600 text-sm">
                        📋 Elicitation Request
                      </div>
                      <div className="mt-1 text-gray-700">
                        {part.data.message}
                      </div>
                    </div>
                  );
                }
                if (part.type === 'data-elicitation-response') {
                  return (
                    <div
                      className="mt-2 border-green-500 border-l-4 bg-green-50 p-3"
                      key={i}
                    >
                      <div className="text-green-600 text-sm">
                        ✅ Response: {part.data.action}
                      </div>
                      {part.data.content && (
                        <pre className="mt-1 text-gray-700 text-xs">
                          {JSON.stringify(part.data.content, null, 2)}
                        </pre>
                      )}
                    </div>
                  );
                }
              }
              return null;
            })}
          </div>
        ))}
      </div>

      <form
        className="mt-4"
        onSubmit={e => {
          e.preventDefault();
          if (!input.trim()) {
            return;
          }
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="w-full rounded border border-gray-300 p-3 shadow-sm disabled:bg-gray-100"
          disabled={showModal}
          onChange={e => setInput(e.target.value)}
          placeholder={
            showModal
              ? 'Please complete the form above...'
              : 'Type a message... (try: "register me as a new user")'
          }
          value={input}
        />
      </form>

      {/* Elicitation Modal */}
      {showModal && currentElicitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 font-bold text-xl">Information Required</h2>
            <p className="mb-6 text-gray-700">{currentElicitation.message}</p>

            <form
              onSubmit={e => {
                e.preventDefault();
                handleElicitationResponse('accept');
              }}
            >
              {(() => {
                const schema = currentElicitation.requestedSchema as any;
                if (!schema?.properties) {
                  return null;
                }

                const requiredFields = new Set(schema.required || []);

                return Object.entries(schema.properties).map(
                  ([key, property]) =>
                    renderFormField(key, property, requiredFields.has(key)),
                );
              })()}

              <div className="mt-6 flex gap-2">
                <button
                  className="flex-1 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                  type="submit"
                >
                  Submit
                </button>
                <button
                  className="flex-1 rounded bg-yellow-600 px-4 py-2 font-semibold text-white hover:bg-yellow-700"
                  onClick={() => handleElicitationResponse('decline')}
                  type="button"
                >
                  Decline
                </button>
                <button
                  className="flex-1 rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                  onClick={() => handleElicitationResponse('cancel')}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
