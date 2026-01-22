'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod';

import { PostTopicSchema, PostTopicValidationErrors, PostTopicCommentSchema } from './utils/topics-validation'
import  GetServerSession  from './utils/get-server-session';
import { getDb } from "@/../lib/mongodb";
import { ObjectId } from 'mongodb'
import { TopicComment } from './utils/topics-validation'

type PostTopicResult = | { success: true } | { success: false; message: string | undefined; validationErrors?: PostTopicValidationErrors; apiError: string | undefined }

export async function createTopicPost(prevState: any, formData: FormData): Promise<PostTopicResult> {

    const validatedFields = PostTopicSchema.safeParse({
        title: formData.get("title"),
        content: formData.get("content")
    });

    if(!validatedFields.success) {
        const flattenedErrors = z.flattenError(validatedFields.error);
        return {
            success: false,
            validationErrors: flattenedErrors.fieldErrors,
            message: 'Missing Fields, topic posting failed',
            apiError: undefined
        }
    }

    const session = await GetServerSession();
    if(!session) {
        // return unauthorized page to prompt relogin (do later)
    }

    const posts = (await getDb()).collection('posts');

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

type PostTopicCommentResult = | { success: true } | { success: false; message: string | undefined; validationErrors?: PostTopicValidationErrors; apiError: string | undefined }

export async function addCommentToTopicPost(topicId: string, prevState: any, formData: FormData): Promise<PostTopicCommentResult> {

    const validatedFields = PostTopicCommentSchema.safeParse({
        content: formData.get("content")
    });

    if(!validatedFields.success) {
        const flattenedErrors = z.flattenError(validatedFields.error);
        return {
            success: false,
            validationErrors: flattenedErrors.fieldErrors,
            message: 'Missing Fields, comment posting failed',
            apiError: undefined
        }
    }

    const session = await GetServerSession();
    if(!session) {
        // return unauthorized page to prompt relogin (do later)
    }

    const comments = (await getDb()).collection('comments');

    const result = await comments.insertOne({
        postId: new ObjectId(topicId),
        content: validatedFields.data.content,
        userId: session?.user.id,
        username: session?.user.name,
        likes: 0,
        dislikes: 0,
        lastEditedAt: new Date(),
    });

    revalidatePath(`/dashboard/topics-board/${topicId.toString()}`);

    return { success: true };
}

export async function retrieveTopicById(topicId: string) {
    const posts = (await getDb()).collection('posts');
    return await posts.findOne({ _id: new ObjectId(topicId) });
}

export async function retrieveCommentsByTopicId(topicId: string) {
    const posts = (await getDb()).collection('comments');
    return await posts.find({ postId: new ObjectId(topicId) }).toArray();
}

export async function retrieveAllTopics() {
    const posts = (await getDb()).collection('posts');
    return await posts.find().toArray();
}