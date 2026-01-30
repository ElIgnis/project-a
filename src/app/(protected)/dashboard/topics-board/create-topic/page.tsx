import CreateTopic from "@/app/ui/create-topic";
import { GetServerSession }  from '@/../lib/utils/get-server-session';

export default async function CreateTopicPage() {

    const session = await GetServerSession();
      if(!session)
        return;

    return (
        <>
            <CreateTopic userData={session.user}/>
        </>
    );
}