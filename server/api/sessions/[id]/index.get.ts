import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUser(event);
  const db = useDrizzle();
  const id = getRouterParam(event, "id")!;

  const [result] = await db
    .select()
    .from(schema.planningSession)
    .innerJoin(
      schema.planningSessionUsers,
      eq(schema.planningSession.id, schema.planningSessionUsers.sessionId),
    )
    .where(and(eq(schema.planningSession.id, id), eq(schema.planningSessionUsers.userId, user.id)))
    .limit(1);

  const session = result?.planning_sessions;

  if (!session) {
    throw createError({
      message: "Planning session not found or you don't have access to it",
      statusCode: 404,
    });
  }

  return session;
});
