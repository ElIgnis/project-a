import EditTopic from "@/app/ui/edit-topic";
import { GetServerSession }  from '@/app/lib/utils/get-server-session';
import { retrieveTopicPostById } from "@/app/lib/topics-server-actions";
import { Topic } from "@/app/lib/utils/topics-validation";
import { UserData } from '@/types/user-interfaces'

export default async function EditTopicPage({ params }: { params: { id: string } }) {

    const session = await GetServerSession();
    if (!session)
        return;

    const { id } = await params;
    const topicPost = await retrieveTopicPostById(id);

    if (!topicPost) {
        return <div>Post not found</div>;
    }

    const parsedTopic: Topic = {
        _id: topicPost._id.toString(),
        title: topicPost.title,
        content: topicPost.content,
        userId: topicPost.userId,
        username: session.user.name,
        createdAt: topicPost.createdAt,
        updatedAt: topicPost.updatedAt,
        likes: topicPost.likes,
        dislikes: topicPost.dislikes,
    }

    const userData : UserData = {
        ...session.user
    };

    return (
        <>
            <EditTopic userData={userData} postTopic={parsedTopic} />
        </>
    );
}