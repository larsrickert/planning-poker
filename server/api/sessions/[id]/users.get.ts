import { and, asc, eq } from "drizzle-orm";

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
      message: "Planning session not found or you are not authorized to view it",
      statusCode: 404,
    });
  }

  const results = await db
    .select({
      user: schema.users,
      // join table fields
      estimation: schema.planningSessionUsers.estimation,
      sessionStatus: schema.planningSession.status,
    })
    .from(schema.planningSessionUsers)
    .innerJoin(schema.users, eq(schema.planningSessionUsers.userId, schema.users.id))
    .innerJoin(
      schema.planningSession,
      eq(schema.planningSessionUsers.sessionId, schema.planningSession.id),
    )
    .where(eq(schema.planningSessionUsers.sessionId, session.id))
    .orderBy(asc(schema.planningSessionUsers.joinedAt));

  const users = results.map<EnrichedUser>((result) => {
    const showEstimation = result.sessionStatus === "reveal" || result.user.id === user.id;
    return {
      ...result.user,
      estimation: showEstimation ? result.estimation : !!result.estimation,
    };
  });

  return users;
});
