import { createIdGenerator } from 'ai';
import { Chat } from './chat';

const generateId = createIdGenerator({ size: 32 });

export default function Page() {
  const id = generateId();

  return <Chat autoResume={false} id={id} initialMessages={[]} />;
}
