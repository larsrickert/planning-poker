import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../database/schema";
export { schema };

let db: NodePgDatabase<typeof schema>;

/**
 * Utility to use a database connection.
 * If not already created, it will create a new db with a connection pool, otherwise re-use the existing one.
 */
export const useDrizzle = () => {
  if (db) return db;

  const config = useRuntimeConfig();
  const pool = new Pool({
    database: config.db.name,
    user: config.db.user,
    password: config.db.password,
    host: config.db.host,
    ssl: !["localhost", "db"].includes(config.db.host),
    max: 2,
  });
  db = drizzle(pool);
  return db;
};
