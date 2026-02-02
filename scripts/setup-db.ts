import { MongoClient } from "mongodb"
import { INDEX_CONFIGS } from "../db/indexes"
import "dotenv/config"

if(!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI');
}

async function setupIndexes() {
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();

    const db = client.db();
    console.log("Connected to mongo db");

    for (const config of INDEX_CONFIGS) {
        const collection = db.collection(config.collection);

        const existingIndexes = await collection.indexes();
        const existingIndexKeys = existingIndexes.map((idx)=> JSON.stringify(idx.key));

        for( const {key, options } of config.indexes) {
            const keyString = JSON.stringify(key);

            if(existingIndexKeys.includes(keyString)) {
                console.log(`Index already exists on ${config.collection}:`, key);
                continue;
            }

            console.log(`Creating index on ${config.collection}: `, key);
            await collection.createIndex(key, options);
        }
    }

    await client.close();
    console.log("DB index setup done");
}

setupIndexes()
.then(()=> process.exit(0))
.catch((err)=> {
    console.error("DB setup failed: ", err);
    process.exit(1);
});