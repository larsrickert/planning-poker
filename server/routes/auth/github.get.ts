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
    async onSuccess(event, { user: gitHubUser }) {
      const user = {
        name: gitHubUser.name || gitHubUser.login,
        email: gitHubUser.email ?? "",
        picture: gitHubUser.avatar_url,
      } satisfies Session["user"];

      // create the user in the database first so if it fails, the session should also not be set
      await upsertUserToDatabase(user);
      await setUserSession(event, { user });

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
const upsertUserToDatabase = async (user: NonNullable<Session["user"]>) => {
  const db = useDrizzle();
  await db.insert(schema.users).values(user).onConflictDoUpdate({
    target: schema.users.email,
    set: user,
  });
};
