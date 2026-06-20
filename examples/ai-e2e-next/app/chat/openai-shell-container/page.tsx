'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { OpenAIShellContainerMessage } from '@/agent/openai/shell-container-agent';
import ChatInput from '@/components/chat-input';

export default function ChatOpenAIShellContainer() {
  const { status, sendMessage, messages } =
    useChat<OpenAIShellContainerMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/openai-shell-container',
      }),
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-4xl flex-col py-24">
      <h1 className="mb-2 font-bold text-black text-xl">
        OpenAI Shell Tool (Container)
      </h1>
      <h2 className="mb-4 border-b pb-2 text-black">
        Commands are executed server-side by OpenAI in a hosted container. No
        approval is needed since commands run remotely on OpenAI infrastructure.
      </h2>

      {messages.map(message => (
        <div className="mb-4 whitespace-pre-wrap" key={message.id}>
          <div className="mb-2">
            <div className="mb-1 font-semibold text-black text-sm">
              {message.role === 'user' ? 'User:' : 'Assistant:'}
            </div>
            <div className="space-y-4">
              {message.parts.map((part, index) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <div className="text-black" key={index}>
                        {part.text}
                      </div>
                    );
                  case 'tool-shell': {
                    const commands = part.input?.action?.commands || [];
                    const outputs =
                      part.state === 'output-available'
                        ? part.output?.output || []
                        : [];

                    return (
                      <div
                        className="mb-2 rounded-xl border border-gray-300 bg-white p-2 shadow-lg"
                        key={index}
                      >
                        <div className="rounded-t-xl border-gray-300 border-b bg-gray-100 px-6 py-3">
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap font-small text-black text-xxs tracking-wide">
                            Shell Execution (Container)
                          </div>
                        </div>

                        <div className="space-y-4 p-6">
                          {commands.map((cmd, cmdIndex) => {
                            const output = outputs[cmdIndex];
                            const outcome = output?.outcome;

                            return (
                              <div className="space-y-2" key={cmdIndex}>
                                <div>
                                  <div className="mb-2 font-medium text-black text-sm">
                                    Command {cmdIndex + 1}:
                                  </div>
                                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-gray-300 bg-gray-100 p-4 text-black text-sm">
                                    {cmd}
                                  </pre>
                                </div>

                                {outcome && (
                                  <div className="space-y-2">
                                    <div className="rounded-lg border border-gray-300 bg-gray-100 p-3">
                                      <div className="mb-1 text-black text-xs">
                                        {outcome.type === 'timeout'
                                          ? 'Timeout'
                                          : `Exit Code: ${outcome.exitCode}`}
                                      </div>
                                    </div>

                                    {output.stdout && (
                                      <div>
                                        <div className="mb-2 font-medium text-black text-sm">
                                          Output:
                                        </div>
                                        <div className="rounded-lg border border-gray-300 bg-gray-100 p-3">
                                          <div className="whitespace-pre-wrap font-mono text-black text-sm">
                                            {output.stdout}
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {output.stderr && (
                                      <div>
                                        <div className="mb-2 font-medium text-black text-sm">
                                          Error:
                                        </div>
                                        <div className="rounded-lg border border-red-300 bg-red-50 p-3">
                                          <div className="whitespace-pre-wrap font-mono text-red-600 text-sm">
                                            {output.stderr}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        </div>
      ))}

      <ChatInput onSubmit={text => sendMessage({ text })} status={status} />
    </div>
  );
}
