import { getDb } from "@/../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function GetUsernamesByIds(userIds: string[]): Promise<Map<string, string>> {
    const usersCollection = (await getDb()).collection('user');

    const uniqueIds = [...new Set(userIds)];

    const users = await usersCollection.find(
        { _id: { $in: uniqueIds.map(id => new ObjectId(id)) } },
        { projection: { id: 1, name: 1 } }
    ).toArray();

    return new Map(users.map(user => [user._id.toString(), user.name]));
}