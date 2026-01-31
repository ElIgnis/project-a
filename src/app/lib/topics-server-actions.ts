'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod';

import { TopicPostSchema, TopicPostValidationErrors, TopicPostCommentSchema, TopicPostCommentValidationErrors } from './utils/topics-validation'
import { GetServerSession }  from './utils/get-server-session';
import { getDb } from "./mongodb";
import { Db, ObjectId } from 'mongodb'

type PostTopicResult = | { success: true } | { success: false; message: string | undefined; validationErrors?: TopicPostValidationErrors; apiError: string | undefined }

export async function createTopicPost(prevState: any, formData: FormData): Promise<PostTopicResult> {

    var result = await handleTopicPostUpdate('', formData);
    if (result)
        return {
            success: result.success,
            message: result.message,
            validationErrors: result.validationErrors,
            apiError: result.apiError
        };
    else
        return { success: true };
}

type EditPostTopicResult = | { success: true } | { success: false; message: string | undefined; validationErrors?: TopicPostValidationErrors; apiError: string | undefined }

export async function editTopicPost(targetId: string, prevState: any, formData: FormData): Promise<EditPostTopicResult> {

    var result = await handleTopicPostUpdate(targetId, formData);

    if (result) {
        return {
            success: result.success,
            message: result.message,
            validationErrors: result.validationErrors,
            apiError: result.apiError
        };
    }
    else
        return { success: true };
}

// Do edit if targetId is supplied
async function handleTopicPostUpdate(targetId: string, formData: FormData) {
    const validatedFields = TopicPostSchema.safeParse({
        title: formData.get("title"),
        content: formData.get("content")
    });

    if (!validatedFields.success) {
        const flattenedErrors = z.flattenError(validatedFields.error);
        return {
            success: false,
            validationErrors: flattenedErrors.fieldErrors,
            message: targetId ? 'Missing Fields, topic editing failed' : 'Missing Fields, topic posting failed',
            apiError: undefined
        }
    }

    const session = await GetServerSession();
    if (!session) {
        // return unauthorized page to prompt relogin (do later)
    }

    const posts = (await getDb()).collection('posts');

    if (targetId) {
        await posts.updateOne(
            { _id: new ObjectId(targetId) },
            {
                $set: {
                    title: validatedFields.data.title,
                    content: validatedFields.data.content,
                    updatedAt: new Date(),
                }
            }
        );
        revalidatePath(`/dashboard/topics-board/${targetId}`);
        redirect(`/dashboard/topics-board/${targetId}`);
    }
    else {
        const result = await posts.insertOne({
            title: validatedFields.data.title,
            content: validatedFields.data.content,
            userId: session?.user.id,
            username: session?.user.name,
            createdAt: new Date(),
            updatedAt: new Date(),
            likes: 0,
            dislikes: 0,
        });

        revalidatePath(`/dashboard/topics-board/${result.insertedId.toString()}`);
        redirect(`/dashboard/topics-board/${result.insertedId.toString()}`);
    }
}

type DeleteTopicPostResult = { success: true } | { success: false; apiError: string | undefined; }

export async function deleteTopicPost(topicId: string) : Promise<DeleteTopicPostResult> {
    const session = await GetServerSession();
    if (!session) {
        // return unauthorized page to prompt relogin (do later)
        return {
            success: false,
            apiError: "Unauthorized",
        };
    }

    const topics = (await getDb()).collection("posts");

    try {
        topics.deleteOne(
            { _id: new ObjectId(topicId) },
        )
    } catch (e) {
        return {
            success: false,
            apiError: "Write deletion failed"
        }
    }

    revalidatePath('/dashboard/topics-board');
    redirect('/dashboard/topics-board');
}

type PostTopicCommentResult = | { success: true } | { success: false; message: string | undefined; validationErrors?: TopicPostCommentValidationErrors; apiError: string | undefined }

export async function addCommentToTopicPost(topicId: string, prevState: any, formData: FormData): Promise<PostTopicCommentResult> {

    var result = await handleTopicPostCommentUpdate(topicId, 'create', formData);

    if (result) {
        return {
            success: result.success,
            message: result.message,
            validationErrors: result.validationErrors,
            apiError: result.apiError
        };
    }
    else
        return { success: true };
}

type EditPostTopicCommentResult = | { success: true } | { success: false; message: string | undefined; validationErrors?: TopicPostCommentValidationErrors; apiError: string | undefined }

export async function editTopicPostComment(targetId: string, prevState: any, formData: FormData): Promise<EditPostTopicCommentResult> {

    var result = await handleTopicPostCommentUpdate(targetId, 'edit', formData);
    if (result) {
        return {
            success: result.success,
            message: result.message,
            validationErrors: result.validationErrors,
            apiError: result.apiError
        };
    }
    else
        return { success: true };
}

async function handleTopicPostCommentUpdate(topicId: string, updateType: 'create' | 'edit', formData: FormData) {

    const validatedFields = TopicPostCommentSchema.safeParse({
        content: formData.get("content")
    });

    if (!validatedFields.success) {
        const flattenedErrors = z.flattenError(validatedFields.error);
        return {
            success: false,
            validationErrors: flattenedErrors.fieldErrors,
            message: 'Missing Fields, comment posting failed',
            apiError: undefined
        }
    }

    const session = await GetServerSession();
    if (!session) {
        // return unauthorized page to prompt relogin (do later)
        return {
            success: false,
            message: 'User not authenticated',
            apiError: 'Unauthorized',
        };
    }

    const comments = (await getDb()).collection('comments');

    switch (updateType) {
        case 'edit':
            await comments.updateOne(
                { _id: new ObjectId(topicId) },
                {
                    $set: {
                        content: validatedFields.data.content,
                        lastEditedAt: new Date(),
                    }
                }
            );
        case 'create':
            await comments.insertOne({
                postId: new ObjectId(topicId),
                content: validatedFields.data.content,
                userId: session?.user.id,
                username: session?.user.name,
                likes: 0,
                dislikes: 0,
                lastEditedAt: new Date(),
            });
            break;
    }

    revalidatePath(`/dashboard/topics-board/${topicId.toString()}`);
}

type DeleteTopicPostCommentResult = { success: true } | { success: false; apiError: string | undefined; }

export async function deleteTopicPostComment(postId: string, commentId: string) : Promise<DeleteTopicPostCommentResult> {
    const session = await GetServerSession();
    if (!session) {
        // return unauthorized page to prompt relogin (do later)
        return {
            success: false,
            apiError: "Unauthorized",
        };
    }

    const topics = (await getDb()).collection("comments");

    try {
        topics.deleteOne(
            { _id: new ObjectId(commentId) },
        )
    } catch (e) {
        return {
            success: false,
            apiError: "Write deletion failed"
        }
    }

    revalidatePath(`/dashboard/topics-board/${postId}`);
    redirect(`/dashboard/topics-board/${postId}`);
}

export async function updateTopicPostReactions(targetId: string, reactionType: 'like' | 'dislike') {

    const session = await GetServerSession();
    if (!session) {
        //TODO: Add a redirect to page for unauthorized
        return;
    }

    const db = await getDb();

    // Check if posts exists
    const post = await db.collection('posts').findOne({ _id: new ObjectId(targetId) });

    if (!post) {
        //TODO: Add a redirect to page for post not found
    }

    await handleReactions(db, session.user.id, targetId, 'posts', reactionType);
    revalidatePath(`/dashboard/topics-board/${targetId.toString()}`);
}

export async function updateTopicPostCommentReactions(targetId: string, reactionType: 'like' | 'dislike') {
    const session = await GetServerSession();
    if (!session) {
        //TODO: Add a redirect to page for unauthorized
        return;
    }

    const db = await getDb();

    // Check if posts exists
    const post = await db.collection('comments').findOne({ _id: new ObjectId(targetId) });

    if (!post) {
        //TODO: Add a redirect to page for post not found
    }

    await handleReactions(db, session.user.id, targetId, 'comments', reactionType);
    revalidatePath(`/dashboard/topics-board/${targetId.toString()}`);
}

async function handleReactions(db: Db, userId: string, targetId: string, targetType: 'posts' | 'comments', reactionType: 'like' | 'dislike') {

    const userReactions = db.collection('user_reactions');
    const targetCollection = db.collection(targetType);

    const existingReaction = await userReactions.findOne({ userId, targetId: targetId });

    const objectTargetId = new ObjectId(targetId);

    // Remove reaction
    if (existingReaction?.reactionType === reactionType) {
        await userReactions.deleteOne({ userId, targetId: targetId });
        await targetCollection.updateOne(
            { _id: objectTargetId },
            { $inc: { [reactionType === 'like' ? 'likes' : 'dislikes']: -1 } }
        );
    }
    // Change reaction
    else if (existingReaction) {
        const prevReactionType = existingReaction.reactionType;

        await userReactions.updateOne(
            { userId, targetId: targetId },
            { $set: { reactionType: reactionType, updatedAt: new Date() } }
        );

        await targetCollection.updateOne(
            { _id: objectTargetId },
            {
                $inc: {
                    [prevReactionType === 'like' ? 'likes' : 'dislikes']: -1,
                    [reactionType === 'like' ? 'likes' : 'dislikes']: 1
                }
            });
    }
    // New reaction
    else {
        await userReactions.insertOne({
            userId: userId,
            targetId: targetId,
            reactionType: reactionType,
            targetType: targetType,
            updatedAt: new Date()
        });
        await targetCollection.updateOne(
            { _id: objectTargetId },
            { $inc: { [reactionType === 'like' ? 'likes' : 'dislikes']: 1 } }
        );
    }
}

export async function retrieveTopicPostById(topicId: string) {
    const posts = (await getDb()).collection('posts');
    return await posts.findOne({ _id: new ObjectId(topicId) });
}

export async function retrieveCommentsByTopicPostId(topicId: string) {
    const posts = (await getDb()).collection('comments');
    return await posts.find({ postId: new ObjectId(topicId) }).toArray();
}

export async function retrieveAllTopicPosts() {
    const posts = (await getDb()).collection('posts');
    return await posts.find().toArray();
}