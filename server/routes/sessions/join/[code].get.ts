import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const userSession = await getUserSession(event);
  if (!userSession.user) return sendRedirect(event, `/auth/github?redirectTo=${event.path}`);
  const { user } = await requireUser(event);

  const joinCode = getRouterParam(event, "code")!;
  const db = useDrizzle();

  const [session] = await db
    .select({ id: schema.planningSession.id })
    .from(schema.planningSession)
    .where(eq(schema.planningSession.joinCode, joinCode))
    .limit(1);

  if (!session) {
    throw createError({
      status: 404,
      message: "Planning session not found",
    });
  }

  await db
    .insert(schema.planningSessionUsers)
    .values({
      sessionId: session.id,
      userId: user.id,
    })
    .onConflictDoNothing();

  return sendRedirect(event, `/sessions/${session.id}`);
});
