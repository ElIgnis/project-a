import { z } from 'zod';

export interface TopicPostValidationErrors {
    title?: string[] | undefined,
    content?: string[] | undefined,
}

export const TopicPostSchema = z.object({
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

export interface TopicPostCommentValidationErrors {
    content?: string[] | undefined,
}

export const TopicPostCommentSchema = z.object({
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