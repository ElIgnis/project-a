import CreateTopic from "@/app/ui/create-topic";
import { GetServerSession } from '@/../lib/utils/get-server-session';
import { UserData } from '@/types/user-interfaces'

export default async function CreateTopicPage() {

    const session = await GetServerSession();
    if (!session)
        return;

    const userData : UserData = {
        ...session.user
    };

    return (
        <>
            <CreateTopic userData={userData} />
        </>
    );
}