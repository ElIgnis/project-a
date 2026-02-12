import CreateTopic from "@/app/ui/create-topic";
import { GetServerSession } from '@/app/lib/utils/get-server-session';
import { UserData } from '@/types/user-interfaces'

export default async function CreateTopicPage() {

    await GetServerSession();

    return (
        <>
            <CreateTopic />
        </>
    );
}