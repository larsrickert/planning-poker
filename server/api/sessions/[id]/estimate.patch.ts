import { and, eq } from "drizzle-orm";
import { createUpdateSchema } from "drizzle-zod";
import { publishWebsocketSessionUpdate } from "~~/server/routes/ws/updates";

export default defineEventHandler(async (event) => {
  const { user } = await requireUser(event);
  const db = useDrizzle();
  const id = getRouterParam(event, "id")!;

  const updateSchema = createUpdateSchema(schema.planningSessionUsers, {}).pick({
    estimation: true,
  });

  const body = await readValidatedBody(event, updateSchema.parse);

  const [result] = await db
    .update(schema.planningSessionUsers)
    .set(body)
    .where(
      and(
        eq(schema.planningSessionUsers.sessionId, id),
        eq(schema.planningSessionUsers.userId, user.id),
      ),
    )
    .returning();

  if (!result) {
    throw createError({
      message: "Estimation not found or you don't have access to it",
      statusCode: 404,
    });
  }

  await publishWebsocketSessionUpdate(result.sessionId);
});
