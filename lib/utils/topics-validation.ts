import { ObjectId } from 'mongodb';
import { z } from 'zod';

export interface PostTopicValidationErrors {
    title?: string[] | undefined,
    content?: string[] | undefined,
}

export const PostTopicSchema = z.object({
    title: z.string().min(10, "Minimum of 10 characters"),
    content: z.string().min(10, "Minimum of 10 characters"),
});

export interface Topic {
    _id: string;
    title: string;
    content: string;
    userId: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    likes: number;
    dislikes: number;
}

export interface PostTopicCommentValidationErrors {
    content?: string[] | undefined,
}

export const PostTopicCommentSchema = z.object({
    content: z.string().min(5, "Minimum of 5 characters"),
});

export interface TopicComment {
    _id: string;
    postId: string;
    content: string;
    userId: string;
    username: string;
    likes: number;
    dislikes: number;
    lastEditedAt: Date;
}