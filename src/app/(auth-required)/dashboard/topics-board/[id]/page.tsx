
import { headers } from 'next/headers'
import { auth } from '@/../auth'
import { redirect } from 'next/navigation';
import  TopicsBoard  from '@/app/ui/posting-board/topics-board'

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  console.log(session);

  if(!session) {
    redirect('/login');
  }
  return (
    <>
      <TopicsBoard/>
    </>
  );
}
