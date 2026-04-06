import {
  json,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// re-usable data types
const createdAt = timestamp("created_at", { mode: "string" }).defaultNow().notNull();
const id = uuid().primaryKey().defaultRandom();
const userId = uuid()
  .references(() => users.id, { onDelete: "cascade" })
  .notNull();

export const planningSourceEnum = pgEnum("planning_source", ["github"]);

export const planningStatusEnum = pgEnum("planning_status", ["vote", "reveal"]);

export const users = pgTable("users", {
  id,
  createdAt,
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  picture: varchar(),
});

export const planningSession = pgTable("planning_sessions", {
  id,
  createdAt,
  userId,
  name: varchar({ length: 64 }).notNull(),
  source: planningSourceEnum().notNull(),
  estimationUnits: json().$type<number[]>().notNull(),
  repository: varchar({ length: 1028 }),
  story: json().$type<PlanningStory>(),
  joinCode: varchar("join_code", { length: 4 }).notNull().unique(),
  status: planningStatusEnum().notNull().default("vote"),
});

export const planningSessionUsers = pgTable(
  "planning_session_users",
  {
    sessionId: uuid()
      .references(() => planningSession.id, { onDelete: "cascade" })
      .notNull(),
    userId,
    joinedAt: timestamp("joined_at", { mode: "string" }).defaultNow().notNull(),
    estimation: numeric({ mode: "number" }),
  },
  (table) => [primaryKey({ columns: [table.sessionId, table.userId] })],
);
