import { google } from '@ai-sdk/google';
import { isStepCount, streamText } from 'ai';
import { run } from '../../lib/run';
import { weatherTool } from '../../tools/weather-tool';

run(async () => {
  const result = streamText({
    model: google('gemini-2.5-flash'),
    tools: { weather: weatherTool },
    prompt: 'What is the weather in San Francisco?',
    stopWhen: isStepCount(2),
    reasoning: 'low',
    onError: console.error,
  });

  for await (const part of result.stream) {
    if (part.type === 'reasoning-delta') {
      process.stdout.write('\x1b[34m' + part.text + '\x1b[0m');
    } else if (part.type === 'text-delta') {
      process.stdout.write(part.text);
    }
  }

  console.log();
  console.log('Warnings:', await result.warnings);

  console.log();
  console.log('Token usage:', await result.usage);
  console.log('Finish reason:', await result.finishReason);
});
