import { CreateIndexesOptions, IndexSpecification, MongoClient, type Db } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { appName: "atlas-purple-yacht" };

let clientPromise: Promise<MongoClient>;
let indexesCreated = false; // Use in-memory flag instead

if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
        _indexesCreated?: boolean;
    };

    if (!globalWithMongo._mongoClientPromise) {
        const client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
    indexesCreated = globalWithMongo._indexesCreated || false;
} else {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
    const client = await clientPromise;
    const db = client.db();

    // Only create indexes once per instance lifetime
    if (!indexesCreated) {
        await ensureIndexesCreated(db);
        indexesCreated = true;
        
        if (process.env.NODE_ENV === "development") {
            const globalWithMongo = global as typeof globalThis & {
                _indexesCreated?: boolean;
            };
            globalWithMongo._indexesCreated = true;
        }
    }

    return db;
}

async function ensureIndexesCreated(db: Db) {
    interface IndexConfig {
        collection: string;
        indexes: Array<{key: IndexSpecification; options: CreateIndexesOptions}>;
    }

    const indexConfigs : IndexConfig[] = [
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

    for (const config of indexConfigs) {
        const collection = db.collection(config.collection);

        for (const { key, options } of config.indexes) {
            try {
                await collection.createIndex(key, options);
                console.log(`Index created on ${config.collection}:`, key);
            } catch (err: any) {
                // Ignore "index already exists" errors
                if (err.code !== 85 && err.code !== 86) {
                    console.error(`Error creating index on ${config.collection}:`, err);
                }
            }
        }
    }
}