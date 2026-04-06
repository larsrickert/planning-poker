import type { UserSession } from "#auth-utils";
import z from "zod";

// currently needed to provide intellisense for session below
type Session = Pick<UserSession, "user" | "secure">;

const REDIRECT_COOKIE_NAME = "auth_redirect_to";

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(
    event,
    z.object({
      redirectTo: z.string().optional(),
    }).parse,
  );

  if (query.redirectTo) {
    setCookie(event, REDIRECT_COOKIE_NAME, query.redirectTo);
  }

  const gitHubHandler = defineOAuthGitHubEventHandler({
    config: {
      emailRequired: true,
    },
    async onSuccess(event, { user }) {
      const session = await setUserSession(event, {
        user: {
          name: user.name,
          email: user.email ?? "",
          picture: user.avatar_url,
        },
      } satisfies Session);

      await upsertUserToDatabase(session);

      const redirectTo = getCookie(event, REDIRECT_COOKIE_NAME) ?? "/";
      deleteCookie(event, REDIRECT_COOKIE_NAME);
      return sendRedirect(event, redirectTo);
    },
    onError: (event) => {
      deleteCookie(event, REDIRECT_COOKIE_NAME);
    },
  });

  return gitHubHandler(event);
});

/**
 * Insert (or updates if already exists) the given user into the database.
 */
const upsertUserToDatabase = async ({ user }: UserSession) => {
  if (!user) return;
  const db = useDrizzle();

  await db.insert(schema.users).values(user).onConflictDoUpdate({
    target: schema.users.email,
    set: user,
  });
};
