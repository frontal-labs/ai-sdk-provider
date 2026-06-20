import { createJustBashSandbox } from '@ai-sdk/sandbox-just-bash';
import { printFullStream } from '../../lib/print-full-stream';
import { run } from '../../lib/run';
import { sandboxAgent } from './sandbox-agent';

run(async () => {
  const sandboxSession = await createJustBashSandbox({
    cwd: '/home/user',
  }).createSession();

  const result = await sandboxAgent.stream({
    prompt:
      'Create a file named greeting.txt with a short greeting, then list the files and show the file contents.',
    experimental_sandbox: sandboxSession.restricted(),
  });

  await printFullStream({ result });
});
