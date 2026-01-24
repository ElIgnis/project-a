import TopicsBoard from '@/app/ui/topics-board'
import Navbar from '@/app/ui/navbars/navbar';
import GetServerSession from '@/../lib/utils/get-server-session';
import { retrieveAllTopics } from '@/../lib/topics-server-actions';
import { Topic } from '@/../lib/utils/topics-validation';
import GetUsernamesByIds from '@/../lib/utils/db-helper-functions';

export default async function TopicsBoardPage() {

  const session = await GetServerSession();
  if (!session)
    return;

  const retrievedTopics = await retrieveAllTopics();
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

  return (
    <>
      <Navbar />
      <TopicsBoard userData={session.user} postTopics={parsedTopics} />
    </>
  );
}
