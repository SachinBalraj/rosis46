import { MongoClient, type MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not configured");
}

if (!/^mongodb(?:\+srv)?:\/\//.test(uri)) {
  throw new Error("MONGODB_URI must be a mongodb or mongodb+srv connection string");
}

const connectionUri: string = uri;

const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  maxIdleTimeMS: 60_000,
};

declare global {
  var __rosissMongoClient: MongoClient | undefined;
  var __rosissMongoClientPromise: Promise<MongoClient> | undefined;
}

async function connect(): Promise<MongoClient> {
  const client = new MongoClient(connectionUri, options);
  await client.connect();
  return client;
}

export function getMongoClient(): Promise<MongoClient> {
  if (global.__rosissMongoClient) {
    return Promise.resolve(global.__rosissMongoClient);
  }

  if (!global.__rosissMongoClientPromise) {
    global.__rosissMongoClientPromise = connect()
      .then((client) => {
        global.__rosissMongoClient = client;
        return client;
      })
      .catch((error) => {
        global.__rosissMongoClientPromise = undefined;
        throw error;
      });
  }

  return global.__rosissMongoClientPromise;
}