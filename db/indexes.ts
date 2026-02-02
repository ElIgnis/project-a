import { CreateIndexesOptions, IndexSpecification } from "mongodb"

export interface IndexConfig {
    collection: string;
    indexes: Array<{
        key: IndexSpecification;
        options?: CreateIndexesOptions
    }>;
}

export const INDEX_CONFIGS: IndexConfig[] = [
    {
        collection: 'user_reactions',
        indexes: [
            { key: { userId: 1, targetId: 1 }, options: { unique: true } },
            { key: { targetId: 1, reactions: 1 }, options: {} }
        ]
    },
    {
        collection: 'posts',
        indexes: [
            { key: { createdAt: -1 }, options: {} },
            { key: { userId: 1, createdAt: -1 }, options: {} }
        ]
    },
    {
        collection: 'comments',
        indexes: [
            { key: { postId: 1, createdAt: 1 }, options: {} }
        ]
    }
];