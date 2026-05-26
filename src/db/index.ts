import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

let db: ReturnType<typeof drizzle> | null = null;
let client: ReturnType<typeof createClient> | null = null;

function getDb() {
  if (!db) {
    const url = process.env.TURSO_DATABASE_URL;
    if (!url) {
      throw new Error("TURSO_DATABASE_URL environment variable is not set");
    }

    client = createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    db = drizzle(client);
  }
  return db;
}

// For use in API routes
export { getDb as db };
