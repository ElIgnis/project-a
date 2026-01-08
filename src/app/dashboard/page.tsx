import {LogoutSection} from '@/app/ui/dashboard/logout-section'
import { headers } from 'next/headers'
import { auth } from '@/../auth'
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  console.log(session);

  if(!session) {
    redirect('/login');
  }
  return (
    <LogoutSection/>
  );
}
