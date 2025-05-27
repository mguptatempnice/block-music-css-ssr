// import { MongoClient } from 'mongodb';

// // Extend the NodeJS.Global type to include _mongoClientPromise
// declare global {
//   // eslint-disable-next-line no-var
//   var _mongoClientPromise: Promise<MongoClient> | undefined;
// }

// const uri = process.env.MONGODB_URI!;
// const dbName = process.env.MONGODB_DB!;
// const client = new MongoClient(uri);

// // Use the global object to store the client promise
// const clientPromise: Promise<MongoClient> = global._mongoClientPromise || client.connect();
// global._mongoClientPromise = clientPromise;

// export async function connectToDatabase() {
//   const client = await clientPromise;
//   return client.db(dbName);
// }
import { MongoClient } from 'mongodb';

let cachedClient: MongoClient | null = null;
import type { Db } from 'mongodb';
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return cachedDb;
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri || !dbName) {
    throw new Error('Please define MONGODB_URI and MONGODB_DB in your environment variables');
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return db;
}