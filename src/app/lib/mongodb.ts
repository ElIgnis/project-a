import { MongoClient, type Db } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { appName: "atlas-purple-yacht" };

let clientPromise: Promise<MongoClient>;

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
} else {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
    const client = await clientPromise;
    return client.db();
}