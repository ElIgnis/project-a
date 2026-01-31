import TopicsBoard from '@/app/ui/topics-board'
import Navbar from '@/app/ui/navbars/navbar';
import { GetServerSession } from '@/../lib/utils/get-server-session';
import { retrieveAllTopicPosts } from '@/../lib/topics-server-actions';
import { Topic } from '@/../lib/utils/topics-validation';
import GetUsernamesByIds from '@/../lib/utils/db-helper-functions';
import { UserData } from '@/types/user-interfaces'

export default async function TopicsBoardPage() {

  const session = await GetServerSession();
  if (!session)
    return;

  const retrievedTopics = await retrieveAllTopicPosts();
  const userIds = retrievedTopics.map(topic => topic.userId);
  const usernames = await GetUsernamesByIds(userIds);
  const parsedTopics: Topic[] = retrievedTopics.map(topic => ({
    _id: topic._id.toString(),
    title: topic.title,
    content: topic.content,
    userId: topic.userId,
    username: usernames.get(topic.userId.toString()) || "Unknown User",
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt,
    likes: topic.likes,
    dislikes: topic.dislikes,
    comments: topic.comments
  }));

  const userData : UserData = {
        ...session.user
    };

  return (
    <>
      <Navbar />
      <TopicsBoard userData={userData} postTopics={parsedTopics} />
    </>
  );
}
