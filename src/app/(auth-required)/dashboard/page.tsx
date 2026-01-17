
import { headers } from 'next/headers'
import { auth } from '@/../auth'
import { redirect } from 'next/navigation';
import { PostingBoard } from '@/app/ui/posting-board/posting-board'

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  console.log(session);

  if(!session) {
    console.log("a");
    redirect('/login');
  }
  return (
    <>
      <PostingBoard/>
    </>
  );
}
