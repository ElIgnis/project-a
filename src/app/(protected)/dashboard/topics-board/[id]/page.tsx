import { retrieveCommentsByTopicId, retrieveTopicById } from '@/../lib/topics-server-actions';
import GetServerSession from '@/../lib/utils/get-server-session';
import TopicPost from '@/app/ui/topic-post';
import { Topic, TopicComment } from '@/../lib/utils/topics-validation';
import GetUsernamesByIds from '@/../lib/utils/db-helper-functions';

export default async function PostPage({ params }: { params: { id: string } }) {

    const session = await GetServerSession();
    if (!session)
        return;

    const { id } = await params;
    const topicPost = await retrieveTopicById(id);
    const topicPostComments = await retrieveCommentsByTopicId(id);

    if (!topicPost) {
        return <div>Post not found</div>;
    }

    const commentUserIds = [topicPost.userId, ...topicPostComments.map(comment => comment.userId)];
    const idMappedUsernames = await GetUsernamesByIds(commentUserIds);

    const parsedTopic: Topic = {
        _id: topicPost._id.toString(),
        title: topicPost.title,
        content: topicPost.content,
        userId: topicPost.userId,
        username: idMappedUsernames.get(topicPost.userId.toString()) || "Deleted User",
        createdAt: topicPost.createdAt,
        updatedAt: topicPost.updatedAt,
        likes: topicPost.likes,
        dislikes: topicPost.dislikes,
    }

    const parsedTopicComments: TopicComment[] = topicPostComments.map(comment => ({
        _id: comment._id.toString(),
        postId: comment.postId.toString(),
        content: comment.content,
        userId: comment.userId,
        username: idMappedUsernames.get(comment.userId.toString()) || "Deleted User",
        likes: comment.likes,
        dislikes: comment.dislikes,
        lastEditedAt: comment.lastEditedAt.toISOString(),
    }));

//     const parsedTopicComments: TopicComment[] = topicPostComments.map(comment => {
//     const cleaned = JSON.parse(JSON.stringify(comment)); // Forces serialization
    
//     return {
//         _id: cleaned._id,
//         postId: cleaned.postId,
//         content: cleaned.content,
//         userId: cleaned.userId,
//         username: idMappedUsernames.get(comment.userId.toString()) || "Deleted User",
//         likes: cleaned.likes,
//         dislikes: cleaned.dislikes,
//         lastEditedAt: cleaned.lastEditedAt,
//     };
// });

    console.log(parsedTopicComments);
    return (
        <TopicPost userData={session.user} postTopic={parsedTopic} postTopicComments={parsedTopicComments} />
    );
}