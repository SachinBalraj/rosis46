import { config } from "dotenv";
import { MongoClient } from "mongodb";
import { COLLECTIONS } from "../src/lib/collections";

config({ path: ".env.local" });

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;
  if (!uri || !dbName) {
    console.error("MONGODB_URI and MONGODB_DB_NAME must be set in .env.local");
    process.exit(1);
  }

  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npm run db:admin <email>");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    const result = await db
      .collection(COLLECTIONS.users)
      .updateOne({ email }, { $set: { role: "ADMIN" } });

    if (result.matchedCount === 0) {
      console.error(`No user found with email ${email}`);
      process.exit(1);
    }

    console.log(`Promoted ${email} to ADMIN`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("Failed to promote user:", error);
  process.exit(1);
});