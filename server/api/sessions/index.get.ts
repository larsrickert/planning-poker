import { asc, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUser(event);
  const db = useDrizzle();

  const results = await db
    .select()
    .from(schema.planningSession)
    .innerJoin(
      schema.planningSessionUsers,
      eq(schema.planningSession.id, schema.planningSessionUsers.sessionId),
    )
    .where(eq(schema.planningSessionUsers.userId, user.id));

  const sessions = results.map<EnrichedPlanningSession>((result) => ({
    ...result.planning_sessions,
    users: [],
  }));

  await Promise.all(
    sessions.map(async (session) => {
      const results = await db
        .select()
        .from(schema.planningSessionUsers)
        .innerJoin(schema.users, eq(schema.planningSessionUsers.userId, schema.users.id))
        .where(eq(schema.planningSessionUsers.sessionId, session.id))
        .orderBy(asc(schema.planningSessionUsers.joinedAt));

      session.users = results.map((result) => result.users);
    }),
  );

  return sessions;
});
