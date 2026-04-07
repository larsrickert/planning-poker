import { and, eq } from "drizzle-orm";
import { createUpdateSchema } from "drizzle-zod";
import z from "zod/v4";
import { publishWebsocketSessionUpdate } from "~~/server/routes/ws/updates";

export default defineEventHandler(async (event) => {
  const { user } = await requireUser(event);
  const db = useDrizzle();
  const id = getRouterParam(event, "id")!;

  const baseSchema = createUpdateSchema(schema.planningSession, {}).pick({
    story: true,
    status: true,
  });

  const patchSchema = baseSchema.extend({
    status: z.preprocess((val) => val ?? "vote", baseSchema.shape.status),
  });

  const body = await readValidatedBody(event, patchSchema.parse);

  const [session] = await db
    .update(schema.planningSession)
    .set({ ...body })
    .where(and(eq(schema.planningSession.id, id), eq(schema.planningSession.userId, user.id)))
    .returning();

  if (!session) {
    throw createError({
      message: "Planning session not found or you don't have access to it",
      statusCode: 404,
    });
  }

  // reset all user votes when story is changed
  if (body.story !== undefined) {
    await db
      .update(schema.planningSessionUsers)
      .set({ estimation: null })
      .where(eq(schema.planningSessionUsers.sessionId, id));
  }

  await publishWebsocketSessionUpdate(session.id);
  return session;
});
