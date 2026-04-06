import { createInsertSchema } from "drizzle-zod";
import type z from "zod/v4";

const insertSchema = createInsertSchema(schema.planningSession, {
  name: (schema) => schema.trim(),
  repository: (schema) => schema.trim(),
}).pick({
  estimationUnits: true,
  name: true,
  repository: true,
  source: true,
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUser(event);

  const body = await readValidatedBody(event, insertSchema.parse);

  if (body.source === "github" && !body.repository) {
    throw createError({
      message: "github owner is required for GitHub source type",
      status: 400,
    });
  }

  const db = useDrizzle();
  const session = await createSession(user.id, body);

  // automatically join the session
  await db.insert(schema.planningSessionUsers).values({ sessionId: session.id, userId: user.id });

  return session;
});

async function createSession(userId: string, data: z.infer<typeof insertSchema>) {
  const db = useDrizzle();
  const MAX_RETRIES = 10;
  let attempts = 0;

  do {
    const code = generateJoinCode();

    try {
      const [session] = await db
        .insert(schema.planningSession)
        .values({ ...data, joinCode: code, userId })
        .returning();

      return session!;
    } catch (e) {
      const isUniqueError = e && typeof e === "object" && "code" in e && e.code === "23505";

      if (isUniqueError) {
        attempts++;
        continue;
      }

      throw e;
    }
  } while (attempts < MAX_RETRIES);

  throw createError({
    statusCode: 503,
    statusMessage: "The server is currently busy. Please try again.",
  });
}
