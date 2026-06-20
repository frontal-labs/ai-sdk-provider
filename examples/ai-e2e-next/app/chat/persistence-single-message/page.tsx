import { createChat } from '@util/chat-store';
import { redirect } from 'next/navigation';

export default async function ChatPage() {
  const id = await createChat();
  redirect(`/chat/persistence-single-message/${id}`);
}
